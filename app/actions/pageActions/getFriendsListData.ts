'use server'

import { EventData, InvitedEventsResponse } from "@/lib/types/event";
import { Friend } from "@/lib/types/friend";
import { ProductType } from "@/lib/types/products";
import { UserData } from "@/lib/types/user";
import { MongoClient, ObjectId } from "mongodb";

/**
 * This function combines the functionality of all the provided functions 
 * and returns the following data for a given userId:
 * - User Info
 * - Profile Picture URL
 * - All Invited Events with owner names
 * - All Friends with their products
 */
export async function getFriendsListData(userId: string) {
  const uri = process.env.MONGODB_URI || '';
  const mongoClient = new MongoClient(uri);
  
  try {
    const db = mongoClient.db('hitmygift');

    // 1. Fetch User Info
    const user = await db.collection<UserData>('users').findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return {
        message: 'User not found',
        status: 404,
      };
    }

    const userInfo = {
      hobbyInfo: user.hobbyInfo,
      firstName: user.firstName,
      lastName: user.lastName,
      verified: user.verified,
      verificationToken: user.verificationToken,
      email: user.email,
      birthday: user.birthday,
    }


    // 2. Fetch All Invited Events
    const events = await db.collection<EventData>('events').find({
      invitedFriends: userId,
    }).toArray();

    const invitedEvents: InvitedEventsResponse[] = await Promise.all(
      events.map(async (event) => {
        const ownerInfo = await db.collection<UserData>('users').findOne({
          _id: new ObjectId(event.userId),
        });
        return {
          id: event._id.toString(),
          userId: event.userId,
          date: event.date,
          eventTitle: event.eventTitle,
          invitedFriends: event.invitedFriends,
          ownerName: ownerInfo ? `${ownerInfo.firstName} ${ownerInfo.lastName}` : 'Unknown Owner',
        };
      })
    );

    // 4. Fetch All Friends and their Products
    const userFriendsIdList: string[] = user.friendsList.map((friendId) => friendId.toString());

    const friendsWithProducts = await Promise.all(
      userFriendsIdList.map(async (friendIdStr) => {
        const friend = await db.collection<UserData>('users').findOne({
          _id: new ObjectId(friendIdStr),
        });
        if (friend) {
          const friendProducts = await db.collection<ProductType>('products').find({ userId: friendIdStr }).toArray();
          return {
            friendId: friendIdStr,
            friendFirstName: friend.firstName,
            products: friendProducts.map((product) => ({
              id: product._id.toString(),
              userId: product.userId,
              price: product.price,
              currency: product.currency,
              title: product.title,
              productUrl: product.productUrl,
              imageUrl: product.imageUrl,
              description: product.description,
            })),
          };
        }
        return null;
      })
    ).then(friends => friends.filter((friend): friend is { 
      friendId: string; 
      friendFirstName: string; 
      friendImageURL: string; 
      products: ProductType[]; 
    } => friend !== null));

    return {
      message: "Successfully fetched all user data",
      data: {
        userInfo: userInfo,
        invitedEvents: invitedEvents,
        friendsWithProducts: friendsWithProducts,
      },
      status: 200,
    };

  } catch (e) {
    console.error(e);
    return {
      message: "Failed to fetch user data",
      status: 500,
    };
  } finally {
    mongoClient.close();
  }
}
