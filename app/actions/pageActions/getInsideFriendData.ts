'use server'

import { Friend } from "@/lib/types/friend";
import { UserData } from "@/lib/types/user";
import { ProductType } from "@/lib/types/products";
import { MongoClient, ObjectId } from "mongodb";

export default async function getInsideFriendData(userId: string) {
  const uri = process.env.MONGODB_URI || '';
  const mongoClient = new MongoClient(uri);

  try {
    const db = mongoClient.db('hitmygift');

    const result = await db.collection<UserData>('users').aggregate([
      { $match: { _id: new ObjectId(userId) } },
      {
        $lookup: {
          from: 'users',
          let: { friends: { $map: { input: '$friendsList', as: 'friendId', in: { $toObjectId: '$$friendId' } } } },
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$_id', '$$friends'] }
              }
            },
            {
              $project: {
                _id: 0,
                id: { $toString: '$_id' },
                firstName: 1,
                lastName: 1
              }
            }
          ],
          as: 'friendsData'
        }
      },
      {
        $lookup: {
          from: 'products',
          let: { userIdObj: { $toObjectId: userId } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$userId', '$$userIdObj'] }
              }
            },
            {
              $project: {
                _id: 0,
                id: { $toString: '$_id' },
                userId: { $toString: '$userId' },
                price: 1,
                currency: 1,
                title: 1,
                productUrl: 1,
                imageUrl: 1,
                description: 1
              }
            }
          ],
          as: 'productsData'
        }
      },
      {
        $project: {
          _id: 0,
          userInfo: {
            hobbyInfo: '$hobbyInfo',
            firstName: '$firstName',
            lastName: '$lastName',
            verified: '$verified',
            verificationToken: '$verificationToken',
            email: '$email',
            birthday: '$birthday'
          },
          friends: '$friendsData',
          products: '$productsData',
          status: 200
        }
      }
    ]).toArray();

    if (result.length === 0) {
      return {
        message: 'User not found',
        status: 400
      };
    }

    return result[0];

  } catch (e) {
    console.error(e);
    return {
      message: 'Server failed to access data',
      status: 500
    };
  } finally {
    mongoClient.close();
  }
}