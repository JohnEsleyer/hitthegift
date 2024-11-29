import { FriendRequestServerResponse } from "@/lib/types/friendrequest";

export function countUnseenFriendRequests(friendRequests: FriendRequestServerResponse[]): number {
    let count = 0;
  
    for (const request of friendRequests) {
      if (!request.isSeen) {
        count++;
      }
    }
  
    return count;
  }