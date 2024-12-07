"use client";

import acceptFriendRequest from "@/app/actions/user/acceptFriendRequest";

import { DebouncedInput } from "@/components/DebounceInput";
import UserProfileImage from "@/components/UserProfileImage";
import {
  updateFriendRequests,
  updateFriendRequestsReceiver,
  updateFriendRequestsSender,
  updateFriends,
  updateSearchResults,
  updateToDeleteFriend,
  updateToDeleteFriendRequest,
} from "@/lib/features/friendsSidebar";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import checkmark from "/public/checkmark.svg";
import xicon from "/public/xicon.svg";
import xicongray from "/public/xicongray.svg";
import LimitText from "@/components/ui/LimitText";
import loading from '/public/loading.svg';
import { isEmail } from "@/utils/isEmail";

export default function FriendsSidebar() {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.userData.id);
  const userEmail = useSelector((state: RootState) => state.userData.email);
  const friends = useSelector(
    (state: RootState) => state.friendsSidebar.friends
  );
  const searchResults = useSelector((state: RootState) => state.friendsSidebar.searchResults);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [loadingRequestId, setLoadingRequestId] = useState<string | null>(null);

  const friendRequestsReceiver = useSelector((state: RootState) => state.friendsSidebar.friendRequestsReceiver);
  const friendRequestsSender = useSelector((state: RootState) => state.friendsSidebar.friendRequestsSender);

  const friendRequests = useSelector(
    (state: RootState) => state.friendsSidebar.friendRequests
  );

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    const results = friends.filter(
      (friend) =>
        friend.firstName.toLowerCase().includes(trimmedQuery) ||
        friend.lastName.toLowerCase().includes(trimmedQuery)
    );

    dispatch(updateSearchResults(results));
  };

  const handleSearchWait = () => {
    setSearchLoading(true);
  };

  useEffect(() => {
    dispatch(updateSearchResults(friends));

    if (friendRequests) {
      friendRequests.map((request) => {
        if (request?.receiverEmail == userEmail) {
          if (
            friendRequestsReceiver.includes(request) ||
            friendRequestsReceiver.some((res) => res.receiverEmail == request.receiverEmail)
          ) {
            return;
          }
          dispatch(
            updateFriendRequestsReceiver(
              friendRequestsReceiver
                ? [...friendRequestsReceiver, request]
                : [request]
            )
          );
        }
        if (request?.sender.id == userId) {
          if (
            friendRequestsSender.includes(request) ||
            friendRequestsSender.some((res) => res.id == request.id)
          ) {
            return;
          }
          dispatch(
            updateFriendRequestsSender(
              friendRequestsSender
                ? [...friendRequestsSender, request]
                : [request]
            )
          );
        }
      });
    }
  }, [friendRequests]);

  const handleAcceptFriendRequest = async (friendRequestId: string) => {
    try {
      setLoadingRequestId(friendRequestId);
      await acceptFriendRequest(userId, friendRequestId);
      
      const acceptedRequest = friendRequestsReceiver.find(
        (request) => request.id === friendRequestId
      );

      if (acceptedRequest) {
        dispatch(updateFriends([
          ...friends,
          {
            id: acceptedRequest.sender.id,
            firstName: acceptedRequest.sender.firstName,
            lastName: acceptedRequest.sender.lastName,
          }
        ]));
        dispatch(
          updateSearchResults([
            ...searchResults,
            {
              id: acceptedRequest.sender.id,
              firstName: acceptedRequest.sender.firstName,
              lastName: acceptedRequest.sender.lastName,
            },
          ])
        );

        dispatch(
          updateFriendRequestsReceiver(
            friendRequestsReceiver.filter(
              (element) => element.id !== friendRequestId
            )
          )
        );

        // Remove the friend request locally
        dispatch(updateFriendRequests(
          friendRequests.filter((element) => element.id !== friendRequestId)
        ));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRequestId(null);
    }
  };

  return (
    <div
      style={{ width: 183 }}
      className="flex flex-col bg-white h-full overflow-auto hide-scrollbar "
    >
      <div className=" ">
        <DebouncedInput
          onUserStopTyping={handleSearch}
          onWait={handleSearchWait}
          placeholder="Search friends..."
          fontSize={14}
          delay={1000}
          width={180}
          height={40}
          isCenter={false}
          value=""
          rounded={true}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
        />
      </div>

      {/**Friends Request */}
      <div>
        {friendRequests ? (
          <div>
            {!searchLoading && searchInput.length == 0 && (
              <div>
                {friendRequestsReceiver?.length > 0 && <p className="mt-2">Friend Requests</p>}
                {friendRequestsReceiver?.map((friendRequest, index) => (
                  <div
                    key={index}
                    style={{ height: 35, fontSize: 14 }}
                    className="flex bg-white border border-gray-400 border rounded-2xl pl-2 pr-2 p-1 mt-2 flex justify-between"
                  >
                    <div className="flex items-center">
                      <UserProfileImage userId={friendRequest.sender.id} userName={friendRequest.sender.firstName} width={30} height={30} alt={"user profile"}/> 
                     
                      <LimitText
                        text={friendRequest.sender.firstName}
                        fontSize={13}
                        length={11}
                        color={"text-black"}
                      />
                    </div>
                    <div className="flex">
                      {loadingRequestId === friendRequest.id  ? (
                        <div className="flex items-center"><Image src={loading} alt="loading" width={20} height={20}/></div>
                      ) : (
                        <button
                          onClick={() => handleAcceptFriendRequest(friendRequest.id)}
                        >
                          <Image
                            src={checkmark}
                            alt="checkmark"
                            width={20}
                            height={20}
                          />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          dispatch(
                            updateToDeleteFriendRequest(friendRequest.id)
                          );
                          dispatch(updateCurrentPopup("deleteFriendRequest"));
                        }}
                      >
                        <Image src={xicon} alt="xicon" width={20} height={20} />
                      </button>
                    </div>
                  </div>
                ))}

                {/**Sent Requests */}
                {friendRequestsSender?.length > 0 && <p className="mt-2">Sent Requests</p>}
                {friendRequestsSender?.map((friendRequest, index) => (
                  <div
                    key={index}
                    style={{ height: 35, fontSize: 14 }}
                    className="flex bg-white border border-gray-400 border rounded-2xl pl-2 pr-2 p-1 mt-2 flex justify-between"
                  >
                    <div className="flex items-center">
                    <UserProfileImage 
                      userId={friendRequest.receiver.id} 
                      userName={friendRequest.receiver.firstName} 
                      width={28} 
                      height={28} 
                      alt={"user profile"}/> 
                      <LimitText
                        text={friendRequest.receiver.firstName == "" ? friendRequest.receiverEmail : friendRequest.receiver.firstName}
                        fontSize={10}
                        length={11}
                        color={"text-black"}
                      />
                     
                    </div>
                    <div className="flex">
                      <p style={{fontSize: 9}} className="flex justify-center items-center text-gray-600">Pending</p>
                      <button
                        onClick={() => {
                          dispatch(
                            updateToDeleteFriendRequest(friendRequest.id)
                          );
                          dispatch(updateCurrentPopup("deleteFriendRequestSender"));
                        }}
                      >
                        <Image src={xicon} alt="xicon" width={20} height={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2 flex justify-center items-center text-gray-300"></div>
        )}
      </div>

      {/**Friends Section */}
      <div className="flex-1 flex flex-col justify-between">
        {searchResults?.length > 0 ? (
          <div className="flex-1 flex-col justify-between items-between">
            <div>
              <p>Friends</p>
              <div>
                {searchResults.map((friend) => (
                  <div
                    key={friend.id}
                    style={{ height: 35, fontSize: 14 }}
                    className="bg-white border border-gray-400 border rounded-2xl pl-2 pr-2 p-1 mt-2  flex justify-between "
                  >
                    <div className="flex items-center gap-2 ">
                      <div className="flex justify-center items-center bg-gray-300 rounded-xl">
                        <UserProfileImage
                          userId={friend.id}
                          alt={friend.firstName}
                          userName={friend.firstName}
                          width={28}
                          height={28}
                        />
                      </div>
                      <span>{friend.firstName}</span>
                    </div>
                    <button
                      className="flex items-center text-red-600"
                      onClick={() => {
                        dispatch(updateToDeleteFriend(friend.id));
                        dispatch(updateCurrentPopup("deleteFriend"));
                      }}
                    >
                      <Image
                        src={xicongray}
                        alt="xicongray"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-300 mt-24 flex justify-center items-center">
            No Friends to Show
          </div>
        )}
        <div className="flex justify-center">
          <button
            style={{ fontSize: 14, width: 138 }}
            className="bg-[#027afe] text-white rounded-full"
            onClick={() => {
              dispatch(updateCurrentPopup("addFriend"));
            }}
          >
            Add Friend
          </button>
        </div>
      </div>
    </div>
  );
}
