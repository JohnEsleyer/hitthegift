'use server'

import { hashPassword } from "@/lib/hashPassword";
import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/user";


export async function createUser(data: UserData) {
    try {
        const db = mongoClient.db('hitmygift');
        // Encrypt password before sending to DB
        const encryptedPassword = await hashPassword(data.password); // Await the hashing

        const res = await db.collection<UserData>('users').insertOne({ // Await the database operation
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: encryptedPassword,
            hobbyInfo: data.hobbyInfo,
            birthday: data.birthday,
            showInterest: data.showInterest,
            friendsList: [
          
            ],
            conversations: [],
        });

        const payload = {userId: res.insertedId.toString()};

        return { message: "Registration Success", status: 200, userId: res.insertedId.toString()};
    } catch (e) {
        console.log(e);
        return { message: "Registration Failed", status: 500, userId: '' };
    }
}

