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

        // Fetch user info
        const user = await db.collection<UserData>('users').findOne({
            _id: new ObjectId(userId)
        });

        if (!user) {
            return {
                message: 'User not found',
                status: 400,
            };
        }

        // Fetch friends
        const userFriendsIdList: string[] = user.friendsList.map((friendId) => friendId.toString());
        let userFriends: Friend[] = [];

        const friendsData = await Promise.all(
            userFriendsIdList.map(async (friendIdStr) => {
                const friend = await db.collection<UserData>('users').findOne({
                    _id: new ObjectId(friendIdStr),
                });

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

        // Fetch products
        const products = await db.collection<ProductType>('products').find({ userId: userId }).toArray();
        let userProducts: ProductType[] = [];

        products.map((product) => {
            userProducts.push({
                id: product._id.toString(),
                userId: product.userId,
                price: product.price,
                currency: product.currency,
                title: product.title,
                productUrl: product.productUrl,
                imageUrl: product.imageUrl,
                description: product.description,
            });
        });

        return {
            userInfo: {
                hobbyInfo: user.hobbyInfo,
                firstName: user.firstName,
                lastName: user.lastName,
                verified: user.verified,
                verificationToken: user.verificationToken,
                email: user.email,
                birthday: user.birthday,
            },
            friends: userFriends,
            products: userProducts,
            status: 200,
        };

    } catch (e) {
        console.error(e);
        return {
            message: 'Server failed to access data',
            status: 500,
        };
    } finally {
        mongoClient.close();
    }
}