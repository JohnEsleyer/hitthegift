'use server'

import { mongoClient } from "@/lib/mongodb";
import { ProductType } from "@/lib/types/products";

export async function createProduct(data: ProductType) {
    try {
        const db = mongoClient.db('hitmygift');
   
        await db.collection('products').insertOne({ // Await the database operation
            title: data.title, 
            productUrl: data.productUrl,
            imageUrl: data.imageUrl,
            description: data.description,
        });

        return { message: "Product Insertion Success", status: 200 };
    } catch (e) {
        console.log(e);
        return { message: "Product Insertion Failed", status: 500 };
    }
}

export async function testAction(data: string){
    console.log("Hello " +data);
}