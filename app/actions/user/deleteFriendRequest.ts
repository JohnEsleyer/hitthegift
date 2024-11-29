'use server'


import { MongoClient, ObjectId } from "mongodb";

export default async function deleteFriendRequest(friendRequestId: string){
    console.log(`Deleting friend request: ${friendRequestId}`);
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try{
        const db = mongoClient.db('hitmygift');

        const res = await db.collection('friendRequest').deleteOne({
            _id: new ObjectId(friendRequestId)
        });

        if (res.deletedCount > 0){
            console.log(`Friend request deleted successfully`);
            return {
                status: 200,
                message: 'Friend request deleted successfully.',
            };
        }else{
            console.log(`No friend request was deleted`);
            return {
                status: 400,
                message: 'No friend request was deleted. Cannot find friend request',
            }
        }
    }catch(e){
        console.log(e);
        console.log(`Friend request deletion failed`);

        return {
            status: 500,
            message: 'Internal server error',
        }
    }finally{
        mongoClient.close();
    }
}