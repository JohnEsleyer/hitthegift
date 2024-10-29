'use client'

import { Suspense, useEffect, useState } from "react";
import sendPasswordResetRequest from "../actions/email/sendPasswordResetEmail";
import { useRouter, useSearchParams } from "next/navigation";
import verifyResetToken from "../actions/email/verifyResetToken";
import ResetPasswordPage from "./ResetPasswordPage";

// Example Query: domain.com/forgot-password?token=3423juhfwuie&emai=johndoe@gmail.com

// If no query parameters are given, redirect to /mylist or /login

function ForgotPassword(){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isValidQuery, setIsValidQuery] = useState(false);

    const searchParams = useSearchParams();
    const tokenQuery = searchParams.get('token');
    const emailQuery = searchParams.get('email');


    useEffect(()=> {
      const validateQueryParameters = async () => {
        if (emailQuery && tokenQuery){
          const res = await verifyResetToken(tokenQuery, emailQuery);
          if (res.status == 200){
            setIsValidQuery(true);
          }else{
            setIsValidQuery(false);
          }
        }else{
          console.log('no query parameters given');
        }
      }

      validateQueryParameters();
    }, []);


    const handleSendPasswordRequest = async () => {
        setIsSent(true);

        try{
            const res = await  sendPasswordResetRequest(email);
            if (res.status == 200){
              console.log('200');
            }else{
              console.log(`${res.status == 200}: ${res.message}`);
            }
        }catch(e){
          console.log(e);
        }
    }

  return (
    <div>

    {!isValidQuery ?  <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-[#FEFEFE] via-[#E7C279] to-[#CC0D23]">
  <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
    <h1 className="text-2xl font-bold text-center mb-4 text-[#15621F]">Forgot Password</h1>
    <p className="text-gray-600 text-center mb-6">
      Please enter your email address to receive password reset instructions.
    </p>
    <form>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D52C1F] focus:border-transparent"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {setEmail(e.target.value)}}
        />
      </div>
      {isSent ? 
      <div className="w-full border rounded-full font-bold py-2 px-4  flex justify-center">
        Sent</div> : 
      <button
        type="submit"
        onClick={handleSendPasswordRequest}
        className="w-full bg-gradient-to-r from-[#D52C1F] to-[#E7C279] hover:from-[#15621F] hover:to-[#CC0D23] text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105"
      >
        Send Reset Link
      </button>}
    </form>
    <p className="mt-4 text-center text-sm text-gray-500">
      Remembered your password?{' '}
      <a href="/login" className="text-[#D52C1F] hover:underline">
        Login here.
      </a>
    </p>
  </div>
</div> : <ResetPasswordPage email={emailQuery || ''}/>}
</div>
  );
}

export default function ForgotPasswordPage(){
  return (
    <Suspense>
      <ForgotPassword/>
    </Suspense>
  )
}