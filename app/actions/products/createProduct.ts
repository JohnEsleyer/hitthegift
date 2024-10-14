'use server'

import { mongoClient } from "@/lib/mongodb";
import { ServerResponseForEvents } from "@/lib/types/event";


type RequestPayload = {
    userId: string;
    title: string;
    price: string;
    currency: string;
    productUrl: string;
    imageUrl: string;
    description: string;
}

export async function createProduct(data: RequestPayload) {
    console.log('Creating product');
    try {
        const db = mongoClient.db('hitmygift');
   
        await db.collection('products').insertOne({ // Await the database operation
            userId: data.userId,
            title: data.title, 
            productUrl: data.productUrl,
            currency: data.currency,
            price: data.price,
            imageUrl: data.imageUrl,
            description: data.description,
        });

   

        console.log("create product: SUCCESS");
        return { message: "Product Creation Success", status: 200 };
    } catch (e) {
        console.log(e);
        return { message: "Product Creation Failed", status: 500 };
    }
}
