"use client";

import { startTransition, useState, useTransition } from "react";
import updateUserPasswordByEmail from "../actions/user/updateUserPasswordByEmail";
import Link from "next/link";
import Image from "next/image";
import loading from "/public/loading.svg";


interface ResetPasswordPageProps {
  email: string;
}

export default function ResetPasswordPage({ email }: ResetPasswordPageProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false); 
  const [resetPending, startResetTransition] = useTransition()

  const handlePasswordReset = async (e: React.FormEvent) => {
    setErrorMessage("");
    e.preventDefault();

    // Check if the forms are not empty and are valid


    if (newPassword == ""){
      setErrorMessage('Please input your new password');
      return;
    }

    if (confirmNewPassword == ""){
      setErrorMessage('Please confirm your new password');
      return;
    }

    if (newPassword !== confirmNewPassword){
      setErrorMessage('New password confirmation do not match');
      return
    }

    startResetTransition(async () => {
      try {
     
  
        const res = await updateUserPasswordByEmail(email, newPassword);
        if (res.status == 200) {
          setIsSuccessful(true);
        } else {
          console.log("Failed to update password");
          setErrorMessage("Failed to update password");
          setIsSuccessful(false);
        }
      } catch (e) {
        console.log(e);
        setErrorMessage("Failed to reset password");
        setIsSuccessful(false);
      }
    });
   
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-300">
      {isSuccessful ? <div style={{height: 400}} className="flex flex-col justify-center bg-white p-8 rounded-xl shadow-lg w-96 max-s-sm">
        <p className="text-2xl font-bold text-center mb-4 text-[#15621F]">Password Reset is Successful</p>
        
        <div className="flex justify-center ">
        <Link href={'/login'}
            className="bg-amber-400 text-black font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105"
          >
            Go to login page
          </Link>
        </div>
              
              </div> : <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4 ">
          Reset Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Please enter your old password, new password, and confirm your new
          password.
        </p>
        <form onSubmit={handlePasswordReset}>
          
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                id="confirmNewPassword"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Confirm your new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
              >
                {showConfirmNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105"
          >
            Reset Password
          </button>
        </form>
        {resetPending && <div className="flex justify-center">
        <Image src={loading} width={30} height={30} alt=""/>
        </div>
        }
        <p className="text-red-600 flex justify-center">{errorMessage}</p>
        <p className="mt-4 text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <a href="/login" className="text-[#D52C1F] hover:underline">
            Login here.
          </a>
        </p>
      </div>}
    </div>
  );
}
