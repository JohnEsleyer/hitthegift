'use server'

import { ProductType } from "@/lib/types/products";
import getAllFriends from "../user/getAllFriends"
import { getUserProducts } from "./getUserProducts";
import { getProfilePicture } from "../s3/getProfilePicture";
import { MongoClient } from "mongodb";

interface FriendsProducts {
    friendId: string;
    friendFirstName: string;
    friendImageURL: string;
    products: ProductType[];
}

// Function to display friends' products
export default async function getFriendsProducts(userId: string) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const response = await getAllFriends(userId);
        if (response) {
            const friends = response.friends;

            // Fetch products for each friend
            const friendsProducts: FriendsProducts[] = (
                await Promise.all(
                    friends.map(async (friend) => {

                        // Fetch friend profile picture
                        const friendProfilePictureUrl = await getProfilePicture(friend.id);
                        const userProductsResponse = await getUserProducts(friend.id);
                        if (userProductsResponse && userProductsResponse.data) {
                            return {
                                friendId: friend.id || '',
                                friendFirstName: friend.firstName || '',
                                friendImageURL: friendProfilePictureUrl.data || '',
                                products: userProductsResponse.data || '',
                            };
                        }
                        return undefined; // Return undefined if no products found
                    })
                )
            ).filter((friendProduct): friendProduct is FriendsProducts => friendProduct !== undefined); // Filter out undefined entries

            console.log(`FriendsProduct Length: ${friendsProducts.length}`);
            
             
            return {
                status: 200,
                data: friendsProducts,
            };
        } else {
             
            return {
                status: 400,
            };
        }
    } catch (e) {
        console.error(e);
         
        return {
            status: 500,
        };
    }finally{
        mongoClient.close();
    }
}
