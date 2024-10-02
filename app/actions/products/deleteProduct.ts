'use server'

import { hashPassword } from "@/lib/hashPassword";
import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/authTypes";
import { ObjectId } from "mongodb";

export async function deleteProduct(id: string) {
    try {
        const db = mongoClient.db('hitmygift');
   
        await db.collection('products').deleteOne({_id: new ObjectId(id)});

        return { message: "Product deletion success", status: 200 };
    } catch (e) {
        console.log(e);
        return { message: "Product deletion failed", status: 500 };
    }
}

export async function testAction(data: string){
    console.log("Hello " +data);
}