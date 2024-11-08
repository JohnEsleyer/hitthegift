"use client";

import acceptFriendRequest from "@/app/actions/user/acceptFriendRequest";
import getAllFriends from "@/app/actions/user/getAllFriends";
import getFriendRequests from "@/app/actions/user/getFriendRequests";
import { DebouncedInput } from "@/components/DebounceInput";
import FriendSkeleton from "@/components/skeletons/FriendSkeleton";
import UserProfileImage from "@/components/UserProfileImage";
import {
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
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // States about Friend Request
  const [friendRequests, setFriendRequests] = useState<
    FriendRequestServerResponse[]
  >([]);
  const [isFriendsRequestsPending, startFriendRequestsTransition] =
    useTransition();

  // Did the sidebar just opened? Used to prevent some useEffect to be perform actions on initial render
  const [justOpened, setJustOpened] = useState(true);

  const handleSearch = (query: string) => {
    setSearchLoading(true);
    const trimmedQuery = query.trim().toLowerCase();
    const results = friends.filter(
      (friend) =>
        friend.firstName.toLowerCase().includes(trimmedQuery) ||
        friend.lastName.toLowerCase().includes(trimmedQuery)
    );

    setSearchResults(results);
    setSearchLoading(false);
  };

  const handleSearchWait = () => {
    setSearchLoading(true);
  };

  function fetchFriends() {
    dispatch(updateIsSidebarOpen(true));
    startTransition(async () => {
      console.log(`id sent to server: ${userId}`);
      const results = await getAllFriends(userId);
      console.log(`status: ${results?.status}`);
      if (results) {
        setFriends(results.friends || []);
        setSearchResults(results.friends || []);
      }

      setJustOpened(false);
    });
  }

  useEffect(() => {
    fetchFriends();
    startFriendRequestsTransition(async () => {
      try {
        const res = await getFriendRequests(userId);
        if (res.data) {
          console.log("fetching FriendRequests success");
          setFriendRequests(res.data);
        }
      } catch (e) {
        console.error(e);
      }
    });
  }, []);

  useEffect(() => {
    if (!justOpened) {
      fetchFriends();
    }
  }, [friendRequests]);

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
          delay={20000}
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

      {isFriendsRequestsPending ? (
        <div>
          <FriendSkeleton />
          <FriendSkeleton />
          <FriendSkeleton />
          <FriendSkeleton />
          <FriendSkeleton />
        </div>
      ) : (
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
                        setFriendRequests((prev) =>
                          prev.filter(
                            (element) => element.id !== friendRequest.id
                          )
                        );
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
      )}

      {/**Friends Section */}
      {isPending || searchLoading ? (
        <div>
          <FriendSkeleton />
          <FriendSkeleton />
          <FriendSkeleton />
          <FriendSkeleton />
          <FriendSkeleton />
        </div>
      ) : (
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
      )}
    </div>
  );
}
