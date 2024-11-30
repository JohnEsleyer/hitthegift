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

/**
 * Fetches all data required for the /mylist page.
 *
 * This function retrieves events, products, conversation data, friends, and friend requests for a specific user.
 * It utilizes MongoDB aggregations to optimize data fetching and reduce waiting time.
 *
 * @param userId The ID of the user.
 * @returns An object containing the fetched data or an error message.
 */
export async function getMyListData(userId: string) {
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
                          { $eq: ["$isRead", false] },
                          { $ne: ["$sender", userId] },
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
                      $expr: { $eq: ["$_id", { $toObjectId: "$$friendId" }] },
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
                  let: { friendsList: "$friendsList" }, // Create a variable to hold the friendsList array
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $in: [
                            { $toString: "$_id" }, // Convert _id to string for comparison
                            "$$friendsList" // Access the friendsList variable
                          ]
                        }
                      }
                    }
                  ],
                  as: "friendsData"
                }
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
                // Use $or to find requests where userId is sender OR receiver
                $or: [{ senderId: userId }, { receiverId: userId }],
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
                          { $eq: ["$_id", { $toObjectId: "$$senderId" }] },
                          { $eq: ["$_id", { $toObjectId: "$$receiverId" }] },
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
                  // Find the sender from userData
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$userData",
                        as: "user",
                        cond: {
                          $eq: [{ $toString: "$$user._id" }, "$senderId"],
                        },
                      },
                    },
                    0,
                  ],
                },
                receiver: {
                  // Find the receiver from userData
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$userData",
                        as: "user",
                        cond: {
                          $eq: [{ $toString: "$$user._id" }, "$receiverId"],
                        },
                      },
                    },
                    0,
                  ],
                },
                isSeenSender: 1, // Include isSeenSender
                isSeenReceiver: 1, // Include isSeenReceiver
              },
            },
            {
              // Optionally, clean up the sender and receiver fields
              $addFields: {
                sender: {
                  $ifNull: ["$sender", { id: "", firstName: "", lastName: "" }],
                },
                receiver: {
                  $ifNull: [
                    "$receiver",
                    { id: "", firstName: "", lastName: "" },
                  ],
                },
              },
            },
          ])
          .toArray(),
      ]);

    console.log(`events: ${events.length}`);
    console.log(`products: ${products.length}`);
    console.log(`conversations: ${conversations.length}`);
    console.log(`friends: ${friends.length}`);
    console.log(`friendRequests: ${friendRequests.length}`);

    (friendRequests as FriendRequestServerResponse[]).map((req) => {
      console.log(`friendRequest Id: ${req.id}`);
      console.log(`friendRequest Sender: ${req.sender.firstName}`);
      console.log(`friendRequest Receiver: ${req.receiver.firstName}`);
    });

    const eventsResponse: ServerResponseForEvents[] = events.map((event) => ({
      id: event.id.toString(),
      date: event.date,
      userId: event.userId,
      eventTitle: event.eventTitle,
      invitedFriends: event.invitedFriends,
    }));

    const productsResponse: ProductType[] = products.map((product) => ({
      id: product.id.toString(),
      userId: product.userId,
      price: product.price,
      currency: product.currency,
      title: product.title,
      productUrl: product.productUrl,
      imageUrl: product.imageUrl,
      description: product.description,
    }));

    const conversationsResponse: UserConversation[] = conversations.map(
      (conversation) => ({
        conversationId: conversation.conversationId,
        unreadMessageCount: conversation.unreadMessageCount,
        friend: conversation.friend,
      })
    );

    const friendsResponse: Friend[] = friends.map((friend) => ({
      id: friend.id.toString(),
      firstName: friend.firstName,
      lastName: friend.lastName,
    }));

    const friendRequestsResponse: FriendRequestServerResponse[] =
    friendRequests.map((friendRequest) => ({
        id: friendRequest.id.toString() || '', 
        sender: {
            firstName: friendRequest.sender.firstName || '',
            lastName: friendRequest.sender.lastName || '',
            id: friendRequest.sender._id.toString() || '', // Convert _id to string
        },
        receiver: {
            firstName: friendRequest.receiver.firstName || '',
            lastName: friendRequest.receiver.lastName || '',
            id: friendRequest.receiver._id.toString() || '', // Convert _id to string
        },
        isSeenSender: friendRequest.isSeenSender as boolean || false,
        isSeenReceiver: friendRequest.isSeenReceiver as boolean || false,
    }));
    console.log(friendRequests);

    return {
      events: eventsResponse,
      products: productsResponse,
      conversations: conversationsResponse,
      friends: friendsResponse,
      friendRequests: friendRequestsResponse,
    };
  } catch (e) {
    console.error(e);
    return {};
  } finally {
    mongoClient.close();
  }
}
