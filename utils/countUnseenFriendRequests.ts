import { FriendRequestServerResponse } from "@/lib/types/friendrequest";

export function countUnseenFriendRequests(
  friendRequests: FriendRequestServerResponse[],
  userId: string
): number {
  let count = 0;

  for (const request of friendRequests) {
    if (request.sender.id === userId) {
      // User is the sender, check isSeenSender
      if (!request.isSeenSender) {
        count++;
      }
    } else {
      // User is the receiver, check isSeenReceiver
      if (!request.isSeenReceiver) {
        count++;
      }
    }
  }

  return count;
}