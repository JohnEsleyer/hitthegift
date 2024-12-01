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
          let: { userId: '$_id' }, 
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toObjectId: '$userId' }, '$$userId'] // Convert userId in products to ObjectId
                }
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

    {/**Start modifying after this comment. */}
    console.log(result[0]);
    
    // return result[0];
    return {
      userInfo: {
        hobbyInfo: result[0].userInfo.hobbyInfo,
        firstName: result[0].userInfo.firstName,
        lastName: result[0].userInfo.lastName,
        verified: result[0].userInfo.verified,
        verificationToken: result[0].userInfo.verificationToken,
        email: result[0].userInfo.email,
        birthday: result[0].userInfo.birthday,
      },
      friends: result[0].friends.map((friend: { id: any; firstName: any; lastName: any; }) => ({
        id: friend.id,
        firstName: friend.firstName,
        lastName: friend.lastName,
      })),
      products: result[0].products.map((product: { id: any; userId: any; price: any; currency: any; title: any; productUrl: any; imageUrl: any; description: any; }) => ({
        id: product.id,
        userId: product.userId,
        price: product.price,
        currency: product.currency,
        title: product.title,
        productUrl: product.productUrl,
        imageUrl: product.imageUrl,
        description: product.description,
      })),
      status: 200,
    };

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