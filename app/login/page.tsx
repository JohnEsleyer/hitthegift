"use client";

import { LoginData } from "@/lib/types/authTypes";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loading from "/public/loading.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserData,
} from "@/lib/features/userData";
import { updateCurrentPopup } from "@/lib/features/popups";
import getUserInfo from "../actions/user/getUserInfo";
import AuthMiddleware from "@/components/AuthMiddleware";
import Cookies from "js-cookie"; 
import { navigateTo } from "../actions/navigateTo";
import { RootState } from "@/lib/store";
import verifyToken from "../actions/auth/verifyToken";

type ResponseData = {
  message: string;
  status: number;
  userId: string;
};

export default function LoginPage() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<ResponseData>({
    message: "",
    status: 200,
    userId: "",
  });
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // States to track input field errors (for styling).
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  // State to control password visibility.
  const [showPassword, setShowPassword] = useState(false);
  const isVerified = useSelector((state: RootState) => state.userData.verified);   

  const handleSubmit = () => {
    // Reset error message and set loading state
    setErrorMessage('');
    setIsLoading(true);

    // Reset input field error states
    setErrorEmail(false);
    setErrorPassword(false);

    let invalidInputs = 0;

    if (loginData.email == "") {
      setErrorEmail(true);
      setErrorMessage("Email address field is empty");
      invalidInputs++;
    }

    if (loginData.password == "") {
      setErrorPassword(true);
      setErrorMessage("Password field is empty");
      invalidInputs++;
    }

    if (invalidInputs == 1) {
      setIsLoading(false);
      return;
    } else if (invalidInputs > 1) {
      setErrorMessage("Email and password fields are empty");
      setIsLoading(false);
      return;
    }
    
    const loginUser = async () => {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
          }),
        });

        const data: ResponseData = await response.json();

        if (data) {
          setResponseData(data);
         
          const userData = await getUserInfo(data.userId);
          setTimeout(() => {
            console.log(`Response Status: ${response.status}`)
            if (data.status == 200 && userData) {
  
              dispatch(updateUserData({
                id: data.userId || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                verified: userData.verified || false,
                verificationToken: userData.verificationToken || '',
                email: userData.email || "",
                hobbyInfo: userData.hobbyInfo || '',
                showInterest: false,
                birthday: userData.birthday || '',
              }));

              dispatch(updateCurrentPopup("none"));
              navigateTo("/mylist");
            } else {
              setErrorMessage(data.message);
              setIsLoading(false);
            }
          }, 3000);
        } else {
        }
      } catch (e) {
        setResponseData({
          message: "Authentication failed. Please try again later",
          status: 500,
          userId: "",
        });
      }
    };
    loginUser();
  };

  useEffect(() => {
   async function validateToken() {
    const token = Cookies.get("token");
    const rememberMe = Cookies.get("rememberMe") === "true"; 
    console.log(`Auth - RememberMe: ${rememberMe}`);
    console.log(`Auth - isVerified: ${isVerified}`);
    if (token){
      const res = await verifyToken(token);
      if (res.status == 200 && rememberMe && isVerified){
        navigateTo('/mylist');
      }
    }
   }
   validateToken();
  }, []);
  return (
    <div className='bg-[#31241e] h-screen w-screen bg-[url("https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/background.webp")] bg-cover bg-center flex items-center justify-center'>
      <div style={{fontSize: 14}} className="flex flex-col bg-white rounded-2xl p-8">
        <label>Email:</label>
        <input
          className={`${
            errorEmail ? "border-red-500" : "border-gray-300"
          } mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
          type="text"
          placeholder="firstname@email.com"
          value={loginData.email}
          onChange={(e) => {
            setErrorEmail(false);
            setLoginData((prev) => ({
              ...prev,
              email: e.target.value,
            }));
          }}
        />
        <label className="pt-8">Password:</label>
        <div className={`relative`}>
        <input
          type={showPassword ? "text":  "password"}
           className={`${
            errorPassword ? "border-red-500" : "border-gray-300"
          } mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
          placeholder="******"
          value={loginData.password}
          onChange={(e) => {
            setErrorPassword(false);
            setLoginData((prev) => ({
              ...prev,
              password: e.target.value,
            }));
          }}
        />
        <button
          type="button"
          className="absolute right-2 top-3 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
        </div>
        {/**Check box */}
        <div className=" flex items-center pt-2">
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked){
                Cookies.set("rememberMe", "true",{expires:30} );
              }else{
                Cookies.set("rememberMe", "false");
              }
            }}
          />
          <span className="pl-2">Remember me</span>
        </div>
        <div style={{width: 300}} className="pt-4 flex gap-2 flex justify-center">
          <div  style={{width: 200, height: 35}}>
          {isLoading ?   <div style={{width: 110}} className="flex justify-center"><Image
            src={Loading}
            alt=""
            width={30}
            height={30}
          /> </div> : <button
            style={{ fontSize: 13}}
            onClick={handleSubmit}
            className="h-full w-full bg-blue-600 text-white rounded border-black rounded-2xl"
          >
            Log In
          </button>}
          </div>
          <div style={{width: 200, height: 35}}>
          <Link
            style={{ fontSize: 13}}
            href="/register"
            className="h-full flex justify-center items-center  rounded bg-black text-white rounded-2xl"
          >
            Create an Account
          </Link>
          </div>
        </div>
        <p
          className={`h-4 ${
            !errorMessage && "invisible"
          } flex justify-center text-red-500`}
        >
          {errorMessage}
        </p>
        <Link style={{width: 120}} href={"/forgot-password" } className="mt-8 underline">Forgot Password</Link>
      </div>
    </div>
  );
}