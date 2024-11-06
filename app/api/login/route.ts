import { comparePassword } from "@/lib/hashPassword";
import { LoginData } from "@/lib/types/authTypes";
import jwt from 'jsonwebtoken';
import { MongoClient } from "mongodb";
import { cookies } from 'next/headers';

export async function POST(req: Request){
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try{
        console.log(`processing request...`)
        const requestData: LoginData = await req.json();

        const {email, password} = requestData;
        console.log(`Password received from server: ${password}`);
        const db = mongoClient.db('hitmygift');
        
        // Find the user by email
        const user = await db.collection('users').findOne({email});

        // Validate user 
        if (!user){
             
            return new Response(JSON.stringify({
                message: 'Invalid email or password',
                status: 590,
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Compare password entered to the hashed password 
        const isMatch = await comparePassword(password, user.password)
        console.log(`isMatch value: ${isMatch}`);
        if (!isMatch){
            console.log("Passwords don't match");

             
            return new Response(JSON.stringify({
                message: 'Invalid email or password',
                status: 401,
            }), {
            
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        console.log("Passwords match");

        console.log(`_id: ${user._id.toString()}`)
        const payload = {userId: user._id};
        
        // Generate JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET || '', {expiresIn: '3h'});

        // Set the token in the response header
        cookies().set('token', token);


        console.log(`isVerified: ${user.verified}`);

         
        return new Response(JSON.stringify({
            message: 'Login successful',
            userId: user._id,
            verified: user.verified,
            status: 200,
        }), {
           
            headers: {
                'Content-Type': 'application/json',
            },
        });

    }catch(e){
        console.log("Failed");
        console.log(e);

         
        return new Response(JSON.stringify({
            message: 'Login Failed',
            status: 500,
        }), {
        
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}