import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import jwt from 'jsonwebtoken';
import {cookies} from 'next/headers';

const secret = process.env.JWT_SECRET || '';

async function fetchHello(){
    const data = await fetch('/api/hello');
    console.log((await data.json()));
}

export function middleware(request: NextRequest){
   
    const cookieToken = cookies().get('token');
    console.log(`Middleware token check: ${cookieToken?.value}`)
    
    // Define an array of public routes 
    const publicRoutes = ['login', 'register', 'sandbox'];

    // Check if the current route is public 
    if (publicRoutes.includes(request.nextUrl.pathname.slice(1))){
        return NextResponse.next();
    }

    // Check for valid token
    if (!cookieToken){
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // verify token and redirect to /mylist if verified
    try{
        console.log('try');
        console.log(`cookieToken: ${cookieToken.value} process.env.: ${process.env.JWT_SECRET || ''}`)
        const decoded = fetch(new URL(`${request.url}/api/verify-token`));
        // const decoded = jwt.verify(cookieToken.value, process.env.JWT_SECRET || '');        
        console.log(`decode: ${decoded}`);
        // Perform operations to the decoded JWT if needed.

        // Continue to the requested route
        console.log("Token Verification Success");
        return NextResponse.next();
    }catch(error){
        console.log(error);
        console.log("Token Verification Failed");
        return NextResponse.redirect(new URL('/login', request.url));
    }
}
