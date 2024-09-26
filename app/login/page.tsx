'use client'



import { LoginData } from "@/lib/types/authTypes";
import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';
import Loading from '/public/loading.svg';
import { loginUserAction } from "../actions/auth/loginUser";
import {useRouter} from 'next/navigation';

export default function LoginPage(){
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [loginData, setLoginData] = useState<LoginData>(
        {
            email: '',
            password:'',
        }
    );

    const handleSubmit = () => {
        setIsLoading(true);

        const loginUser = async () => {
            const response = await loginUserAction({
                email: loginData.email,
                password: loginData.password,
            });

            if (response){
                setResponseMessage(response.message);
                setTimeout(()=>{
                  setIsLoading(false);
                
                  router.push('/mylist');
                }, 3000);
               
              }
        }

        loginUser();
        
    };


    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col border-2 border-black rounded-2xl p-8">
                <label>Email:</label>
                <input 
                    className="border-2 border-black rounded"
                    type="text" 
                    placeholder="firstname@email.com"
                    value={loginData.email}
                    onChange={(e) => {
                        setLoginData((prev) => ({
                            ...prev,
                            email: e.target.value,
                        }));
                    }}
                />
                <label>Password:</label>
                <input 
                    className="border-2 border-black rounded"
                    type="password" 
                    placeholder="******"
                    value={loginData.password}
                    onChange={(e) => {
                        setLoginData((prev) => ({
                            ...prev,
                            password: e.target.value,
                        }));
                    }}
               />
                
                <div className="pt-4 flex gap-2">
                    <button  onClick={handleSubmit} className="p-2 border-2 rounded border-black rounded">
                        Log In
                    </button>
                    <Link href="/register" className="p-2 border-2 rounded border-black rounded">
                        Create an Account
                    </Link>
                </div>
                {responseMessage && <p>{responseMessage}</p>}
                <span className="pt-8 underline">Forgot Password</span>
                {/*Loading */}
                <div className="flex justify-center h-12">
                    {isLoading && <Image 
                        src={Loading}
                        alt=""
                        width={30}
                        height={30}
                    />}
                </div>
            </div>
        </div>
    );
}