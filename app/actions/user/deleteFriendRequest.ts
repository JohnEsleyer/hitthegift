'use server'


import { MongoClient, ObjectId } from "mongodb";

export default async function deleteFriendRequest(friendRequestId: string){
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try{

        const db = mongoClient.db('hitmygift');

        const res = await db.collection('friendRequest').deleteOne({
            _id: new ObjectId(friendRequestId)
        });

        if (res.deletedCount > 0){
             
            return {
                status: 200,
                message: 'Friend request deleted successfully.',
            };
        }
    }catch(e){
        console.log(e);
         
        return {
            status: 500,
            message: 'Internal server error',
        }
    }finally{
        mongoClient.close();
    }
}