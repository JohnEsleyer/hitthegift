'use client'

import Link from "next/link";


export default function LoginPage(){
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col border-2 border-black rounded-2xl p-8">
                <label>Email:</label>
                <input 
                    className="border-2 border-black rounded"
                    type="text" 
                    placeholder="firstname@email.com"
                    id="fname" 
                    name="fname"/>
                <label>Password:</label>
                <input 
                    className="border-2 border-black rounded"
                    type="password" 
                    placeholder="******"
                    id="fname" 
                    name="fname"/>
                
                <div className="pt-4 flex gap-2">
                    <Link href="" className="p-2 border-2 rounded border-black rounded">
                        Log In
                    </Link>
                    <Link href="/register" className="p-2 border-2 rounded border-black rounded">
                        Create an Account
                    </Link>
                </div>
                <span className="pt-8 underline">Forgot Password</span>
            </div>
        </div>
    );
}