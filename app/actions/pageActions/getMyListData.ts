'use server'

import { EventData } from "@/lib/types/event";
import { MongoClient, ObjectId } from "mongodb";
import { ProductType } from "@/lib/types/products";
import { Conversation } from "@/lib/types/conversation";
import { Message } from "@/lib/types/message";
import { Friend } from "@/lib/types/friend";
import { UserData } from "@/lib/types/user";
import { FriendRequestMongoType, FriendRequestServerResponse } from "@/lib/types/friendrequest";
import { getProfilePicture } from "../s3/getProfilePicture";
import getUserInfo from "../user/getUserInfo";

/**
 * Fetches all data required for the /mylist page.
 *
 * This function retrieves events, products, conversation data, friends, and friend requests for a specific user.
 * It combines the functionality of `getAllEvents`, `getUserProducts`, `fetchAllConversationsByUserId`, `getAllFriends`, and `getFriendRequests`.
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

        // 1. Fetch user data with friends and events populated
        console.log('Fetching user data with friends and events');
        const user = await db.collection<UserData>('users').aggregate([
            { $match: { _id: new ObjectId(userId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "friendsList",
                    foreignField: "_id",
                    as: "friends"
                }
            },
            {
                $lookup: {
                    from: "events",
                    localField: "_id",
                    foreignField: "userId",
                    as: "events"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "events.invitedFriends",
                    foreignField: "_id",
                    as: "invitedFriends"
                }
            },
            {
                $project: {
                    _id: 0,
                    friends: {
                        id: { $toString: "$_id" },
                        firstName: 1,
                        lastName: 1,
                    },
                    events: {
                        id: { $toString: "$_id" },
                        userId: { $toString: "$_id" }, 
                        date: { $toString: "$date" },
                        eventTitle: 1,
                        invitedFriends: {
                            id: { $toString: "$_id" },
                            firstName: 1,
                            lastName: 1,
                        }
                    }
                }
            }
        ]).toArray();

        console.log('Fetching user data with friends and events done!');

        // Extract friends and events
        const userFriends: Friend[] = user[0]?.friends || [];
        const eventsData = user[0]?.events || [];

        // 2. Fetch products
        console.log('Fetching products');
        const products = await db.collection<ProductType>("products").find({ userId: userId }).toArray();
        const productsData: ProductType[] = products.map((product) => ({
            id: product._id.toString(),
            userId: product.userId,
            price: product.price,
            currency: product.currency,
            title: product.title,
            productUrl: product.productUrl,
            imageUrl: product.imageUrl,
            description: product.description,
        }));
        console.log('Fetching products done!');

        // 3. Fetch conversations and unread counts
        console.log('Fetching conversations');
        const conversations = await db.collection<Conversation>("conversations").aggregate([
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
                                        { $ne: ["$sender", userId] }
                                    ]
                                }
                            }
                        },
                        { $count: "unreadCount" }
                    ],
                    as: "unreadMessages"
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { friendId: { $arrayElemAt: [{ $filter: { input: "$participants", as: "participant", cond: { $ne: ["$$participant", userId] } } }, 0] } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$friendId" }] } } }
                    ],
                    as: "friend"
                }
            },
            {
                $project: {
                    _id: 0,
                    conversationId: { $toString: "$_id" },
                    unreadMessageCount: { $ifNull: [{ $arrayElemAt: ["$unreadMessages.unreadCount", 0] }, 0] },
                    friend: {
                        id: { $toString: { $arrayElemAt: ["$friend._id", 0] } },
                        name: { $concat: [{ $arrayElemAt: ["$friend.firstName", 0] }, " ", { $arrayElemAt: ["$friend.lastName", 0] }] }
                    }
                }
            }
        ]).toArray();

        console.log('Fetching conversations done!');

        // 4. Fetch friend requests (both sent and received)
        console.log('Fetching friend requests');
        const friendRequests = await db.collection<FriendRequestMongoType>('friendRequest').aggregate([
            { $match: { $or: [{ senderId: userId }, { receiverId: userId }] } },
            {
                $lookup: {
                    from: "users",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "senderData"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receiverId",
                    foreignField: "_id",
                    as: "receiverData"
                }
            },
            {
                $project: {
                    _id: 0,
                    id: { $toString: "$_id" },
                    sender: {
                        id: "$senderId",
                        firstName: { $arrayElemAt: ["$senderData.firstName", 0] },
                        lastName: { $arrayElemAt: ["$senderData.lastName", 0] },
                    },
                    receiver: {
                        id: "$receiverId",
                        firstName: { $arrayElemAt: ["$receiverData.firstName", 0] },
                        lastName: { $arrayElemAt: ["$receiverData.lastName", 0] },
                    },
                    isSeen: 1
                }
            }
        ]).toArray();

        // Fetch profile pictures for senders and receivers
        const friendRequestsWithImages = await Promise.all(friendRequests.map(async (request) => {
            const [senderProfileImage, receiverProfileImage] = await Promise.all([
                getProfilePicture(request.sender.id),
                getProfilePicture(request.receiver.id)
            ]);
            return {
                ...request,
                sender: {
                    ...request.sender,
                    imageUrl: senderProfileImage.data || '',
                },
                receiver: {
                    ...request.receiver,
                    imageUrl: receiverProfileImage.data || '',
                }
            };
        }));

        console.log('Fetching friend requests done!');
        console.log(`events: ${eventsData.length}`);
        console.log(`products: ${products.length}`);
        console.log(`conversations: ${conversations.length}`);
        console.log(`friends: ${userFriends.length}`);
        console.log(`friendRequests: ${friendRequests.length}`);

        return {
            events: eventsData,
            products: productsData,
            conversations: conversations,
            friends: userFriends,
            friendRequests: friendRequestsWithImages,
        };
    } catch (e) {
        console.error(e);
        return {};
    } finally {
        mongoClient.close();
    }
}