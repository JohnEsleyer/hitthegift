"use client";

import acceptFriendRequest from "@/app/actions/user/acceptFriendRequest";
import getAllFriends from "@/app/actions/user/getAllFriends";
import getFriendRequests from "@/app/actions/user/getFriendRequests";
import { DebouncedInput } from "@/components/DebounceInput";
import FriendSkeleton from "@/components/skeletons/FriendSkeleton";
import UserProfileImage from "@/components/UserProfileImage";
import {
  updateFriendRequests,
  updateFriends,
  updateIsSidebarOpen,
  updateToDeleteFriend,
  updateToDeleteFriendRequest,
} from "@/lib/features/friendsSidebar";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { Friend } from "@/lib/types/friend";
import { FriendRequestServerResponse } from "@/lib/types/friendrequest";
import Avvvatars from "avvvatars-react";
import { Check, Search, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";

interface FriendsSidebarProps {
  onClick: () => void;
}

export default function FriendsSidebar({ onClick }: FriendsSidebarProps) {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const userId = useSelector((state: RootState) => state.userData.id);
  const friends = useSelector((state: RootState) => state.friendsSidebar.friends);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const friendRequests = useSelector((state: RootState) => state.friendsSidebar.friendRequests);
 

  const handleSearch = (query: string) => {
    console.log('start handleSearch');
    // setSearchLoading(true);
    const trimmedQuery = query.trim().toLowerCase();
    const results = friends.filter(
      (friend) =>
        friend.firstName.toLowerCase().includes(trimmedQuery) ||
        friend.lastName.toLowerCase().includes(trimmedQuery)
    );

    setSearchResults(results);
    // setSearchLoading(false);
    console.log('end handleSearch ')
  };

  const handleSearchWait = () => {
    setSearchLoading(true);
  };



  useEffect(() => {
    setSearchResults(friends);

  }, []);


  const handleAcceptFriendRequest = async (friendRequestId: string) => {
    try {
      await acceptFriendRequest(userId, friendRequestId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full overflow-auto hide-scrollbar ">
      <div className="flex items-center ">

        <DebouncedInput 
          onUserStopTyping={handleSearch}
          onWait={handleSearchWait}
          placeholder="Search friends..."
          fontSize={16}
          delay={1000}
          width={300}
          height={50}
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
       
          {friendRequests.length > 0 ? (
            <div>
              {!searchLoading && searchInput.length == 0 && 
              <div>
                   <p>Requests</p>
              {friendRequests.map((friendRequest) => (
                <div
                  key={friendRequest.id}
                  className="flex bg-white border border-gray-400 border rounded-2xl pl-2 pr-2 p-1 mt-2 flex justify-between"
                >
                  <div className="flex items-center">
                    {friendRequest.sender.imageUrl == "" ? (
                      <Avvvatars
                        size={48}
                        value={friendRequest.sender.firstName}
                      />
                    ) : (
                      <img
                        className="border rounded-full"
                        src={friendRequest.sender.imageUrl}
                        alt={friendRequest.sender.imageUrl}
                        width={48}
                        height={48}
                      />
                    )}
                    <p>{friendRequest.sender.firstName}</p>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => {
                        handleAcceptFriendRequest(friendRequest.id);
                        // Remove the accepted friend request from state
                        setSearchResults((friends) => [...friends, {id: friendRequest.sender.id,firstName: friendRequest.sender.firstName, lastName: friendRequest.sender.lastName}])
                        dispatch(updateFriendRequests(friendRequests.filter((element) => element.id !== friendRequest.id)));
                      }}
                    >
                      <Check color={"green"} />
                    </button>
                    <button
                      onClick={() => {
                        dispatch(updateToDeleteFriendRequest(friendRequest.id));
                        dispatch(updateCurrentPopup("deleteFriendRequest"));
                      }}
                    >
                      <X color={"red"} />
                    </button>
                  </div>
                </div>
              ))}
              </div>}
            </div>
          ) : (
            <div className="mt-2 flex justify-center items-center text-gray-300">
            </div>
          )}
        </div>

      {/**Friends Section */}
     
        <div>
          {searchResults.length > 0 ? (
            <div>
              <p>Friends</p>
            <div>
              {searchResults.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white border border-gray-400 border rounded-2xl pl-2 pr-2 p-1 mt-2  flex justify-between "
                >
                  <div className="flex items-center gap-2 ">
                    <div className="flex justify-center items-center w-12 h-12 bg-blue-400 rounded-full">
                      <UserProfileImage
                        userId={friend.id}
                        alt={friend.firstName}
                        userName={friend.firstName}
                        width={48}
                        height={48}
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
                    <X />
                  </button>
                </div>
              ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-300 mt-24 flex justify-center items-center">
              No Friends to Show
            </div>
          )}
          {/* Display a message when there are no search results */}
          {/* {!searchLoading && searchResults.length === 0 && (
            <div>No friends found</div>
          )} */}
        </div>
    </div>
  );
}
