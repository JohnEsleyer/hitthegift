"use client";

import acceptFriendRequest from "@/app/actions/user/acceptFriendRequest";
import getAllFriends from "@/app/actions/user/getAllFriends";
import getFriendRequests from "@/app/actions/user/getFriendRequests";
import FriendSkeleton from "@/components/skeletons/FriendSkeleton";
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

  // States about Friend Request
  const [friendRequests, setFriendRequests] = useState<
    FriendRequestServerResponse[]
  >([]);
  const [isFriendsRequestsPending, startFriendRequestsTransition] =
    useTransition();

  // Did the sidebar just opened? Used to prevent some useEffect to be perform actions on initial render
  const [justOpened, setJustOpened] = useState(true);

  function fetchFriends() {
    dispatch(updateIsSidebarOpen(true));
    startTransition(async () => {
      console.log(`id sent to server: ${userId}`);
      const results = await getAllFriends(userId);
      console.log(`status: ${results?.status}`);
      if (results) {
        setFriends(results.friends || []);
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
    <div className="h-full overflow-auto">
      <div className="flex items-center rounded-xl p-2 bg-white w-fulls">
        <input type="text" style={{ width: 230 }} placeholder="Search friend" />
        <Search style={{ width: 26, height: 20, strokeWidth: 3 }} />
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
          <p>Requests</p>
          {friendRequests.length > 0 ? <div>
            {friendRequests.map((friendRequest) => (
              <div key={friendRequest.id} className="flex border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex justify-between">
                <div className="flex items-center">
                  {friendRequest.sender.imageUrl == "" ? (
                    <Avvvatars
                      size={48}
                      value={friendRequest.sender.firstName}
                    />
                  ) : (
                    <img
                      src={friendRequest.sender.imageUrl}
                      width={40}
                      height={40}
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
          </div> : <div className="flex justify-center items-center text-gray-300">No Friend Request</div>}
        </div>
      )}

      {/**Friends Section */}
      {isPending ? (
        <div>
          <FriendSkeleton />
          <FriendSkeleton />
          <FriendSkeleton />
          <FriendSkeleton />
          <FriendSkeleton />
        </div>
      ) : (
        <div>
          {friends.length > 0 ? (
            <div>
              <p>Friends</p>
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2  flex justify-between "
                >
                  <div className="flex items-center gap-2 ">
                    <div className="flex justify-center items-center w-12 h-12 bg-blue-400 rounded-full">
                      <Avvvatars size={48} value={friend.firstName} />
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
          ) : (
            <div className="text-gray-400 mt-24 flex justify-center items-center">
              No friends to show
            </div>
          )}
        </div>
      )}
    </div>
  );
}
