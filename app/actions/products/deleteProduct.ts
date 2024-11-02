'use server'

import { MongoClient, ObjectId } from "mongodb";

export async function deleteProduct(id: string) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');
   
        await db.collection('products').deleteOne({_id: new ObjectId(id)});

         
        return { message: "Product deletion success", status: 200 };
    } catch (e) {
        console.log(e);
         
        return { message: "Product deletion failed", status: 500 };
    }finally{
        mongoClient.close();
    }
}

