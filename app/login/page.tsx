'use client'



import { LoginData } from "@/lib/types/authTypes";
import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';
import Loading from '/public/loading.svg';
import {useRouter} from 'next/navigation';
import { useDispatch } from "react-redux";
import { updateUserFirstNameStore, updateUserId} from "@/lib/features/userData";
import { updateCurrentPopup } from "@/lib/features/popups";
import updateUserFirstName from "../actions/user/updateUserFirstName";
import getUserInfo from "../actions/user/getUserInfo";

type ResponseData = {
    message: string;
    status: number;
    userId: string;
}

export default function LoginPage(){
    const dispatch = useDispatch();

    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [responseData, setResponseData] = useState<ResponseData>({
        message: '',
        status: 200,
        userId: '',
    });
    // const [isError, setIsError] = useState(false);
    const [loginData, setLoginData] = useState<LoginData>(
        {
            email: '',
            password:'',
        }
    );

    const handleSubmit = () => {
        setIsLoading(true);

        const loginUser = async () => {
            try{
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: loginData.email,
                        password: loginData.password,
                    }),
                });

              
                const data: ResponseData = await response.json();

                if (data){
                    setResponseData(data);

                    const userData = await getUserInfo(data.userId);
                    setTimeout(()=>{
                        if (response.status == 200){
           
                            dispatch(updateUserId(data.userId));
        
                            dispatch(updateUserFirstNameStore(userData.firstName as string));
                            
                            
                            
                            // setIsError(false);
                            dispatch(updateCurrentPopup('none'));
                            router.push('/mylist');
                        }else{
                            // setIsError(true);
                            setIsLoading(false);
                        }
                      
                    
                    }, 3000);
                
                }else{

                }
            }catch(e){
                console.log(`Client Error: ${e}`);
                setResponseData({
                    message: 'Authentication failed. Please try again later',
                    status: 500,
                    userId: '',
                });
            }
        }

        loginUser();
        
    };


    return (
        <div 
           
        className='h-screen w-screen bg-[url("/background.png")] flex items-center justify-center'>
            <div className="flex flex-col bg-white rounded-2xl p-8">
                <label>Email:</label>
                <input 
                    className="border-2 p-2 rounded-2xl border-black rounded"
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
                <label className="pt-8">Password:</label>
                <input 
                
                    className="border-2 p-2 rounded-2xl border-black rounded"
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
               {/**Check box */}
               <div className=" flex items-center pt-2">
                <input type="checkbox" onChange={(e) => {
                    console.log(e);
                // setUserData((prev) => ({
                //   ...prev,
                //   showInterest: e.target.checked,
                // }));
                 }}/>
                 <span className="pl-2">Remember me</span>
                </div>
                
                <div className="pt-4 flex gap-2 flex justify-center">
                    <button style={{fontSize: 13}}  onClick={handleSubmit} className=" p-2 pl-8 pr-8 bg-blue-500 text-white rounded border-black rounded-2xl">
                        Log In
                    </button>
                    <Link style={{fontSize: 13}} href="/register" className="p-2 border-2 pl-8 pr-8 rounded bg-black text-white rounded-2xl">
                        Create an Account
                    </Link>
                </div>
             
                {/*Loading */}
                <div className="flex justify-center h-12">
                    {isLoading && <Image 
                        src={Loading}
                        alt=""
                        width={30}
                        height={30}
                    />}
                </div>
                {responseData.message && <p className={`flex justify-center ${responseData.status == 200 ? 'text-green-600' : 'text-red-500'} `}>
                    {responseData.message}
                </p>}
                <span className="pt-8 underline ">Forgot Password</span>

            </div>
        </div>
    );
}