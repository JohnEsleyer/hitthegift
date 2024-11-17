'use server'

import { EventData } from "@/lib/types/event";
import getFriendsByIds from "../user/getFriendsByIds";
import { MongoClient } from "mongodb";
import { ProductType } from "@/lib/types/products";
import { Conversation } from "@/lib/types/conversation";
import { Message } from "@/lib/types/message";
import { ObjectId } from "mongodb";
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
    const uri = process.env.MONGODB_URI || "";
    const mongoClient = new MongoClient(uri);

    try {
        const db = mongoClient.db("hitmygift");

        // Fetch events
        const events = await db.collection<EventData>("events").find({ userId: userId }).toArray();
        let eventsData: { id: string; userId: string; date: string; eventTitle: string; invitedFriends: Friend[]; }[] = [];
        if (events.length > 0) {
            eventsData = await Promise.all(
                events.map(async (event) => {
                    const friendsData = await getFriendsByIds(event.invitedFriends);
                    return {
                        id: event._id.toString(),
                        userId: userId,
                        date: event.date.toString(),
                        eventTitle: event.eventTitle,
                        invitedFriends: friendsData.friends,
                    };
                })
            );
        }

        // Fetch products
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

        // Fetch conversations
        const conversations = await db
            .collection<Conversation>("conversations")
            .find({ participants: userId })
            .toArray();

        const userConversations = [];
        for (const conversation of conversations) {
            const unreadCount = await db
                .collection<Message>("messages")
                .countDocuments({
                    conversationId: conversation._id.toString(),
                    isRead: false,
                    sender: { $ne: userId },
                });

            const friendId = conversation.participants.find((id) => id !== userId);
            if (!friendId) {
                console.warn(`Conversation ${conversation._id} has less than 2 participants.`);
                continue;
            }

            const friend = await db.collection("users").findOne({ _id: new ObjectId(friendId) });
            if (!friend) {
                console.warn(`Friend with ID ${friendId} not found.`);
                continue;
            }

            userConversations.push({
                conversationId: conversation._id.toString(),
                unreadMessageCount: unreadCount,
                friend: {
                    id: friendId,
                    name: `${friend.firstName} ${friend.lastName}`,
                },
            });
        }

        // Fetch friends ID
        const user = await db.collection<UserData>('users').findOne({ _id: new ObjectId(userId) });
        let userFriends: Friend[] = [];
        if (user) {
            const userFriendsIdList: string[] = user.friendsList.map((friendId) => friendId.toString());
            const friendsData = await Promise.all(
                userFriendsIdList.map(async (friendIdStr) => {
                    const friend = await db.collection<UserData>('users').findOne({ _id: new ObjectId(friendIdStr) });
                    if (friend) {
                        return {
                            id: friendIdStr,
                            firstName: friend.firstName,
                            lastName: friend.lastName,
                        };
                    }
                    return null;
                })
            );
            userFriends = friendsData.filter((friend): friend is Friend => friend !== null);
        }

        // Fetch friend requests
        const friendRequestsResponse = await db.collection<FriendRequestMongoType>('friendRequest').find({ receiverId: userId }).toArray();
        let friendRequests: FriendRequestServerResponse[] = [];
        if (friendRequestsResponse.length > 0) {
            friendRequests = await Promise.all(friendRequestsResponse.map(async (friendRequest) => {
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
        }

        console.log(`events: ${eventsData.length}`);
        console.log(`products: ${products.length}`);
        console.log(`conversations: ${conversations.length}`);
        console.log(`friends: ${userFriends.length}`);
        console.log(`friendRequests: ${friendRequests.length}`);
        return {
            events: eventsData,
            products: productsData,
            conversations: userConversations,
            friends: userFriends,
            friendRequests: friendRequests
        };
    } catch (e) {
        console.error(e);
        return {};
    } finally {
        mongoClient.close();
    }
}