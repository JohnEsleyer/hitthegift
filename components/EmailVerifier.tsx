'use client'

import sendEmailVerification from "@/app/actions/email/sendEmailVerification";
import { RootState } from "@/lib/store";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

interface EmailVerifierProps{
    children: React.ReactNode;
}

export default function EmailVerifier({children}: EmailVerifierProps){
    const isVerified = useSelector((state: RootState) => state.userData.verified);   
    const userId = useSelector((state: RootState) => state.userData.id);
    const userEmail = useSelector((state: RootState) => state.userData.email);
    const firstName = useSelector((state: RootState) => state.userData.firstName);
    const lastName = useSelector((state: RootState) => state.userData.lastName);
    const verificationToken = useSelector((state: RootState) => state.userData.verificationToken);
    const [enableResend, setEnableResend] = useState(true);

    const onResendVerification = async () => {
      setEnableResend(false);
        try{
            await sendEmailVerification(userId, userEmail, firstName, lastName, verificationToken);
        }catch(e){
            console.log(e);
        }
       
    }
 
    if (!isVerified){
        return ( <div className="w-screen flex items-center justify-center bg-gray-300 p-4">
            <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6 text-center">
              <div className="flex justify-center">
                <div className="bg-red-500 p-6 rounded-full">
                <MailCheck  size={32} color="white"/>
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-black mb-4">
                Verify Your Email to Get Started
              </h1>
              <p className="text-gray-700 mb-4">
                Hi there! It looks like you haven't verified your email yet.
              </p>
              <p className="text-gray-700 mb-6">
                To access and use all the features of our web app, please verify your email address.
                We've sent a verification link to <span className="font-semibold">{userEmail}</span>. Just click on that link, and you'll be all set!
              </p>
              <div className="text-left mb-6">
                <h2 className="text-lg font-semibold text-black mb-2">If you haven't received the email:</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Check your spam or junk folder — sometimes, our emails might end up there.</li>
                  <li>Make sure you entered the correct email address during registration.</li>
                </ul>
              </div>
              <p className="text-gray-700 mb-4">
                Didn't receive the email?
              </p>
              <button
                onClick={onResendVerification}
                disabled={!enableResend}
                className={`${enableResend ? 'bg-red-500 text-white ' : 'bg-gray-300'} font-semibold py-2 px-4 rounded-lg mb-4`}
              >
                {enableResend ? 'Resend Verification Email' : 'Email Sent!'}
              </button>
              <p className="text-gray-700">
                If you're still having trouble verifying your email, please <a href="#" className="text-blue-500 underline">contact our support team</a> for assistance. We're here to help you get started!
              </p>
              <p className="mt-6 text-gray-500 text-sm">
                Thank you for your patience! We can't wait for you to explore everything our app has to offer once you're verified.
              </p>
            </div>
          </div>)
    }

    return (
        <div>
            {children}
        </div>
    );
}