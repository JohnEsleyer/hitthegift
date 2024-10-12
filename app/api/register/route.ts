
import { comparePassword, hashPassword } from "@/lib/hashPassword";
import { mongoClient } from "@/lib/mongodb";
import { LoginData } from "@/lib/types/authTypes";
import { UserData } from "@/lib/types/user";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: Request) {

    try {
        const data: UserData = await req.json();
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
              "66fe544c2426b7d616e5f80b",
              "66fe4ef22426b7d616e5f80a",
              "66fe4eba2426b7d616e5f809",
              "66fe4d302426b7d616e5f807",

            ],
            conversations: [],
        });

        const payload = {userId: res.insertedId.toString()};
        const token = jwt.sign(payload, process.env.JWT_SECRET || '', {expiresIn: '3h'});

        cookies().set('token', token);

        return new Response(JSON.stringify({
            message: "Registration Success", 
            status: 200, 
            userId: res.insertedId.toString()
        }));

    } catch (e) {
        console.log(e);
        return new Response(JSON.stringify({
            message: "Registration Failed", 
            status: 500, 
            userId: '' 
        }));
    }
}

