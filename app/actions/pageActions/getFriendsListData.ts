'use server'
import { InvitedEventsResponse } from "@/lib/types/event";
import { FriendWithProducts } from "@/lib/types/friend";
import { MongoClient, ObjectId } from "mongodb";

export async function getFriendsListData(userId: string){
  const uri = process.env.MONGODB_URI || '';
  const mongoClient = new MongoClient(uri);

  try {
    const db = mongoClient.db('hitmygift');

    const events = await db.collection('events').aggregate([
      {
        $match: {
          invitedFriends: { $in: [userId] }, // Use $in to check if userId is in the array
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: { $toObjectId: '$userId' } }, // Convert userId string to ObjectId
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$userId'] } } }, // Match _id in users collection
          ],
          as: 'ownerDetails', // Output the matched user data
        },
      },
      {
        $unwind: {
          path: '$ownerDetails', // Use the correct field from $lookup
          preserveNullAndEmptyArrays: false, // Exclude events without owner details
        },
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' }, // Convert ObjectId to string
          userId: 1,
          date: 1,
          eventTitle: 1,
          invitedFriends: 1,
          ownerName: { $concat: ['$ownerDetails.firstName', ' ', '$ownerDetails.lastName'] },
        },
      },
    ]).toArray();

    console.log(events);

    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(userId) 
    });

    if (user) {
      // Assuming friendsList contains ObjectIds as strings
      const friendsList = user.friendsList as string[]; 

    const friendsWithProducts = await db.collection('users').aggregate([
      {
        $match: {
          _id: { $in: friendsList.map(id => new ObjectId(id)) }
        }
      },
      {
        $lookup: {
          from: 'products',
          let: { userId: '$_id' }, 
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toObjectId: '$userId' }, '$$userId'] // Convert userId in products to ObjectId
                }
              }
            }
          ],
          as: 'products'
        }
      },
      {
        $project: {
          _id: 0,
          friendId: { $toString: '$_id' },
          friendFirstName: '$firstName',
          products: {
            $map: {
              input: '$products',
              as: 'product',
              in: {
                id: { $toString: '$$product._id' },
                userId: '$$product.userId',
                price: '$$product.price',
                currency: '$$product.currency',
                title: '$$product.title',
                productUrl: '$$product.productUrl',
                imageUrl: '$$product.imageUrl',
                description: '$$product.description'
              }
            }
          }
        }
      }
    ]).toArray();

    console.log(friendsWithProducts);
    console.log('user');
    console.log(user);
    console.log('events');
    console.log(events);

    // Return statement: Combine events and friendsWithProducts
    return {
      events: events as InvitedEventsResponse[], 
      friendsWithProducts: friendsWithProducts as FriendWithProducts[],
    };

    } else {
      return {
        events: [],
        friendsWithProducts: [],
      };
    }


  } catch (error) {
    console.error("Error fetching invited events:", error);
    return {
      events: [],
      friendsWithProducts: [],
    };
  } finally {
    await mongoClient.close();
  }
}