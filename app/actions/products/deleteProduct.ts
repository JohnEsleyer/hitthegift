'use server'

import { MongoClient, ObjectId } from "mongodb";
import deleteProductImage from "../s3/deleteProductImage";

export async function deleteProduct(id: string) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');
   
        await db.collection('products').deleteOne({_id: new ObjectId(id)});

        // Delete the product image stored in S3
        await deleteProductImage(id);

        return { message: "Product deletion success", status: 200 };
    } catch (e) {
        console.log(e);
         
        return { message: "Product deletion failed", status: 500 };
    }finally{
        mongoClient.close();
    }
}

