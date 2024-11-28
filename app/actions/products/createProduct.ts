'use server'

import { ServerResponseForEvents } from "@/lib/types/event";
import { ProductType } from "@/lib/types/products";
import { MongoClient, ObjectId } from "mongodb";

type RequestPayload = {
    _id: string;
    userId: string;
    title: string;
    price: string;
    currency: string;
    productUrl: string;
    imageUrl: string;
    description: string;
}

export async function createProduct(data: RequestPayload) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');
   
        const product = await db.collection('products').insertOne({ // Await the database operation
            _id: new ObjectId(data._id),
            userId: data.userId,
            title: data.title, 
            productUrl: data.productUrl,
            currency: data.currency,
            price: data.price,
            imageUrl: data.imageUrl,
            description: data.description,
        });

        const responseData: ProductType = {
            id: data._id,
            userId: data.userId,
            title: data.title, 
            productUrl: data.productUrl,
            currency: data.currency,
            price: data.price,
            imageUrl: data.imageUrl,
            description: data.description,
        }

        console.log("create product: SUCCESS");
        console.log(`Inserted ID: ${product.insertedId}`);
        return { message: "Product Creation Success",data: responseData, status: 200 };
    } catch (e) {
        console.log(e);
         
        return { message: "Product Creation Failed", status: 500 };
    }finally{
        mongoClient.close();
    }
}
