'use server'

import { mongoClient } from "@/lib/mongodb";
import { ServerResponseForEvents } from "@/lib/types/event";
import { ProductType } from "@/lib/types/products";
import { ObjectId } from "mongodb";


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
    console.log('Creating product');
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
        return { message: "Product Creation Success",data: responseData, status: 200 };
    } catch (e) {
        console.log(e);
        return { message: "Product Creation Failed", status: 500 };
    }
}
