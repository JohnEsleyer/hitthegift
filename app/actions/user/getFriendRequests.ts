'use server';

import { mongoClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import getUserInfo from "./getUserInfo";
import { getProfilePicture } from "../s3/getProfilePicture";
import { FriendRequestMongoType, FriendRequestServerResponse } from "@/lib/types/friendrequest";

export default async function getFriendRequests(userId: string) {
    try {
        const db = mongoClient.db('hitmygift');

        // Find all friend requests where the receiver is the given userId
        const response = await db.collection<FriendRequestMongoType>('friendRequest').find({
            receiverId: userId
        }).toArray();

        if (!response.length) {
            console.log('No friend requests found');
            return {
                status: 404,
                message: 'No friend requests found',
                data: []
            };
        }

        
        // Convert friendRequests to FriendRequestServerResponse type
        const friendRequests: FriendRequestServerResponse[] = await Promise.all(response.map(async (friendRequest) => {
            const [senderInfo, senderProfileImage, receiverInfo, receiverProfileImage] = await Promise.all([
              getUserInfo(friendRequest.senderId),
              getProfilePicture(friendRequest.senderId),
              getUserInfo(friendRequest.receiverId),
              getProfilePicture(friendRequest.receiverId)
            ]);
          
            return {
              id: friendRequest._id.toString(),
              sender: {
                id: friendRequest.senderId,
                firstName: senderInfo.firstName || '',
                lastName: senderInfo.lastName || '',
                imageUrl: senderProfileImage.data || '',
              },
              receiver: {
                id: friendRequest.receiverId,
                firstName: receiverInfo.firstName || '',
                lastName: receiverInfo.lastName || '',
                imageUrl: receiverProfileImage.data || '',
              }
            };
          }));
          


        return {
            status: 200,
            message: 'Friend requests retrieved successfully',
            data: friendRequests
        };
    } catch (e) {
        console.log(e);
        return {
            status: 500,
            message: 'Internal server error',
            data: []
        };
    }
}