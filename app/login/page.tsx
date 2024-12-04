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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

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
    <div>
      <div className={`bg-[#31241e] w-screen bg-[url("https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/background.webp")] bg-cover bg-center flex flex-col md:flex-row items-center justify-center min-h-screen`}>

        {/**Login Form */}
        <div className="w-full max-w-sm flex flex-col bg-white rounded-2xl p-8 mt-8 md:mt-0">
          <label>Email:</label>
          <input
            className={`${errorEmail ? "border-red-500" : "border-gray-300"
              } mt-1 block w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
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
            onKeyDown={handleKeyDown}
          />
          <label className="pt-8">Password:</label>
          <div className={`relative`}>
            <input
              type={showPassword ? "text" : "password"}
              className={`${errorPassword ? "border-red-500" : "border-gray-300"
                } mt-1 block w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
              placeholder="******"
              value={loginData.password}
              onChange={(e) => {
                setErrorPassword(false);
                setLoginData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="absolute right-2 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {/* Check box */}
          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  Cookies.set("rememberMe", "true", { expires: 30 });
                } else {
                  Cookies.set("rememberMe", "false");
                }
              }}
            />
            <span className="pl-2">Remember me</span>
          </div>
          <div className="pt-4 flex gap-2 justify-center">
            <div className="w-full">
              {isLoading ? (
                <div className="flex justify-center">
                  <Image src={Loading} alt="" width={30} height={30} />
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="h-full w-full bg-blue-600 text-white rounded border-black rounded-2xl py-2"
                >
                  Log In
                </button>
              )}
            </div>
            <div className="w-full">
              <Link
                href="/register"
                className="h-full flex justify-center items-center rounded bg-black text-white rounded-2xl py-2"
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
          <Link href={"/forgot-password"} className="mt-8 underline">Forgot Password</Link>
        </div>
      </div>
     
    </div>
  );
}
