"use server";

import { EventData, ServerResponseForEvents } from "@/lib/types/event";
import { MongoClient, ObjectId } from "mongodb";
import { ProductType } from "@/lib/types/products";
import { Conversation, UserConversation } from "@/lib/types/conversation";
import { Message } from "@/lib/types/message";
import { Friend } from "@/lib/types/friend";
import {
  FriendRequestMongoType,
  FriendRequestServerResponse,
} from "@/lib/types/friendrequest";

export async function getMyListData(userId: string, userEmail: string) {
  console.log(`getMyListData userId: ${userId}`);
  const uri = process.env.MONGODB_URI || "";
  const mongoClient = new MongoClient(uri);

  try {
    const db = mongoClient.db("hitmygift");
    const objectId = new ObjectId(userId);

    const [events, products, conversations, friends, friendRequests] =
      await Promise.all([
        // Fetch events with invited friends data
        db
          .collection<EventData>("events")
          .aggregate([
            { $match: { userId: userId } },
            {
              $addFields: {
                invitedFriends: {
                  $map: {
                    input: "$invitedFriends",
                    as: "friendId",
                    in: {
                      $cond: [
                        {
                          $and: [
                            { $eq: [{ $strLenCP: "$$friendId" }, 24] },
                            { $regexMatch: { input: "$$friendId", regex: /^[a-fA-F0-9]{24}$/ } },
                          ],
                        },
                        { $toObjectId: "$$friendId" },
                        null,
                      ],
                    },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "invitedFriends",
                foreignField: "_id",
                as: "invitedFriendsData",
              },
            },
            {
              $project: {
                _id: 0,
                id: { $toString: "$_id" },
                userId: 1,
                date: { $toString: "$date" },
                eventTitle: 1,
                invitedFriends: {
                  $map: {
                    input: "$invitedFriendsData",
                    as: "friend",
                    in: {
                      id: { $toString: "$$friend._id" },
                      firstName: "$$friend.firstName",
                      lastName: "$$friend.lastName",
                    },
                  },
                },
              },
            },
          ])
          .toArray(),

        // Fetch products
        db
          .collection<ProductType>("products")
          .aggregate([
            { $match: { userId: userId } },
            {
              $project: {
                _id: 0,
                id: { $toString: "$_id" },
                userId: 1,
                price: 1,
                currency: 1,
                title: 1,
                productUrl: 1,
                imageUrl: 1,
                description: 1,
              },
            },
          ])
          .toArray(),

        // Fetch conversations with unread message count and friend data
        db
          .collection<Conversation>("conversations")
          .aggregate([
            { $match: { participants: userId } },
            {
              $lookup: {
                from: "messages",
                let: { conversationId: { $toString: "$_id" } },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$conversationId", "$$conversationId"] },
                          { $ne: ["$sender", userId] },
                          { $eq: ["$receiverIsRead", false] },
                        ],
                      },
                    },
                  },
                  { $count: "unreadCount" },
                ],
                as: "unreadMessages",
              },
            },
            {
              $lookup: {
                from: "users",
                let: {
                  friendId: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$participants",
                          as: "participant",
                          cond: { $ne: ["$$participant", userId] },
                        },
                      },
                      0,
                    ],
                  },
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: [{ $strLenCP: "$$friendId" }, 24] },
                          { $regexMatch: { input: "$$friendId", regex: /^[a-fA-F0-9]{24}$/ } },
                        ],
                      },
                    },
                  },
                ],
                as: "friendData",
              },
            },
            {
              $project: {
                _id: 0,
                conversationId: { $toString: "$_id" },
                unreadMessageCount: {
                  $ifNull: [
                    { $arrayElemAt: ["$unreadMessages.unreadCount", 0] },
                    0,
                  ],
                },
                friend: {
                  $let: {
                    vars: { friend: { $arrayElemAt: ["$friendData", 0] } },
                    in: {
                      id: { $toString: "$$friend._id" },
                      name: {
                        $concat: [
                          "$$friend.firstName",
                          " ",
                          "$$friend.lastName",
                        ],
                      },
                    },
                  },
                },
              },
            },
          ])
          .toArray(),

        // Fetch friends data
        db
          .collection<Friend>("users")
          .aggregate([
            { $match: { _id: objectId } },
            {
              $lookup: {
                from: "users",
                let: { friendsList: "$friendsList" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: [
                          { $toString: "$_id" },
                          "$$friendsList",
                        ],
                      },
                    },
                  },
                ],
                as: "friendsData",
              },
            },
            {
              $project: {
                _id: 0,
                friends: {
                  $map: {
                    input: "$friendsData",
                    as: "friend",
                    in: {
                      id: { $toString: "$$friend._id" },
                      firstName: "$$friend.firstName",
                      lastName: "$$friend.lastName",
                    },
                  },
                },
              },
            },
            { $unwind: "$friends" },
            { $replaceRoot: { newRoot: "$friends" } },
          ])
          .toArray(),

        // Fetch friend requests (both sent and received) with sender and receiver data
        db
          .collection("friendRequest")
          .aggregate([
            {
              $match: {
                $or: [
                  { senderId: userId },
                  { receiverId: userId },
                  { receiverEmail: userEmail },
                ],
              },
            },
            {
              $lookup: {
                from: "users",
                let: { senderId: "$senderId", receiverId: "$receiverId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $or: [
                          {
                            $and: [
                              { $eq: [{ $strLenCP: "$$senderId" }, 24] },
                              { $regexMatch: { input: "$$senderId", regex: /^[a-fA-F0-9]{24}$/ } },
                            ],
                          },
                          {
                            $and: [
                              { $eq: [{ $strLenCP: "$$receiverId" }, 24] },
                              { $regexMatch: { input: "$$receiverId", regex: /^[a-fA-F0-9]{24}$/ } },
                            ],
                          },
                        ],
                      },
                    },
                  },
                ],
                as: "userData",
              },
            },
            {
              $project: {
                _id: 0,
                id: { $toString: "$_id" },
                sender: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$userData",
                        as: "user",
                        cond: { $eq: [{ $toString: "$$user._id" }, "$senderId"] },
                      },
                    },
                    0,
                  ],
                },
                receiver: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$userData",
                        as: "user",
                        cond: { $eq: [{ $toString: "$$user._id" }, "$receiverId"] },
                      },
                    },
                    0,
                  ],
                },
                receiverEmail: 1,
                isSeenSender: 1,
                isSeenReceiver: 1,
              },
            },
          ])
          .toArray(),
      ]);

    return {
      events,
      products,
      conversations,
      friends,
      friendRequests,
    };
  } catch (e) {
    console.error(e);
    return {};
  } finally {
    mongoClient.close();
  }
}
