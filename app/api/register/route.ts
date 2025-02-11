
import sendEmailVerification from "@/app/actions/email/sendEmailVerification";
import { hashPassword } from "@/lib/hashPassword";
import { UserData } from "@/lib/types/user";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { MongoClient } from "mongodb";

export async function POST(req: Request) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const data: UserData = await req.json();
        const db = mongoClient.db('hitmygift');
        // Encrypt password before sending to DB
        const encryptedPassword = await hashPassword(data.password); // Await the hashing

        // Generate a verification token for email
        const verificationToken = crypto.randomBytes(16).toString('hex');

        const res = await db.collection<UserData>('users').insertOne({ // Await the database operation
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: encryptedPassword,
            hobbyInfo: data.hobbyInfo,
            birthday: data.birthday,
            showInterest: data.showInterest,
            verified: false,
            verificationToken: verificationToken,
            friendsList: [],
            conversations: [],
            resetToken: '',
        });

        const payload = {userId: res.insertedId.toString()};
        const token = jwt.sign(payload, process.env.JWT_SECRET || '', {expiresIn: '3h'});


        await sendEmailVerification(
            res.insertedId.toString(),
            data.email, 
            data.firstName, 
            data.lastName , 
            verificationToken );

        cookies().set('token', token);
            
         
        return new Response(JSON.stringify({
            message: "Registration Success", 
            status: 200, 
            userId: res.insertedId.toString(),
            verificationToken: verificationToken,
            
        }));

    } catch (e) {
        console.log(e);
         
        return new Response(JSON.stringify({
            message: "Registration Failed", 
            status: 500, 
            userId: '' 
        }));
    }finally{
        mongoClient.close();
    }
}

