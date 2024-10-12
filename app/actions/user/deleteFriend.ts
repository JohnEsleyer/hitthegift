'use server'

import { mongoClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { FilterQuery } from "mongoose";


export default async function deleteFriend(userId: string, friendId: string) {
  try {
    const db = mongoClient.db('hitmygift');
    
    // Cast the update query to a FilterQuery<any> to satisfy TypeScript
    const updateQuery: FilterQuery<any> = {
      $pull: { friendsList: friendId } // Remove the friendId from the list
    };

    // Remove the friendId from the user's friendsList
    const res = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      updateQuery
    );

    if (res.modifiedCount > 0) {
      console.log('Friend deleted successfully');
      console.log(200);
      return {
        status: 200,
        message: 'Friend deleted successfully'
      };
    } else {
     console.log(400);
      return {
        status: 400,
        message: 'Friend not found or not in list'
      };
    }
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: 'Internal server error'
    };
  }
}