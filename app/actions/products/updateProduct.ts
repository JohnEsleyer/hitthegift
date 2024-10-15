'use server'

'use server';

import { mongoClient } from "@/lib/mongodb";
import { ServerResponseForEvents } from "@/lib/types/event";
import { ProductType } from "@/lib/types/products";
import { ObjectId } from "mongodb";

type UpdateRequestPayload = {
    productId: string;
    userId: string;
    title?: string;
    price?: string;
    currency?: string;
    productUrl?: string;
    imageUrl?: string;
    description?: string;
};

export async function updateProduct(data: UpdateRequestPayload) {
    console.log('Updating product');
    try {
        const db = mongoClient.db('hitmygift');
        const { productId, ...updateData } = data;

        const updateFields = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== undefined)
        );

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(productId), userId: data.userId },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            console.log("update product: Product not found");
            return { message: "Product not found", status: 404 };
        }

        console.log("update product: SUCCESS");
        return { message: "Product Update Success", status: 200 };
    } catch (e) {
        console.log(e);
        return { message: "Product Update Failed", status: 500 };
    }
}
