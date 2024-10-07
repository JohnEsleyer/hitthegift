'use server'

import { mongoClient } from "@/lib/mongodb";
import { ProductType } from "@/lib/types/products";
import { ObjectId } from "mongodb";

type RequestPayload = {
    userId: string;
    title: string;
    price: string;
    productUrl: string;
    imageUrl: string;
    description: string;
}

export async function createProduct(data: RequestPayload) {
    try {
        const db = mongoClient.db('hitmygift');
   
        await db.collection('products').insertOne({ // Await the database operation
            userId: data.userId,
            title: data.title, 
            productUrl: data.productUrl,
            price: data.price,
            imageUrl: data.imageUrl,
            description: data.description,
        });

        return { message: "Product Creation Success", status: 200 };
    } catch (e) {
        console.log(e);
        return { message: "Product Creation Failed", status: 500 };
    }
}
