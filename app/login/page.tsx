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
    <div style={{height:720}} className={`bg-[#31241e] w-screen bg-[url("https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/background.webp")] bg-cover bg-center flex items-center justify-center`}>
      {/*Hero */}
      <div style={{width: 600, height: 600}} className="text-white ml-16  mr-40 " >
      <img className="mb-8" src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/logo.png`} alt={"profile"} width={200} height={200}/> 
        <p style={{ fontSize: 112, lineHeight: 1 }} className="font-bold">Share your <span className="text-[#027afe]">wishes</span></p>
        <p style={{fontSize: 64, lineHeight:1}} className="font-bold">the easiest way to get it right</p>
      </div>
      {/**Login Form */}
      <div style={{ fontSize: 14 }} className="flex flex-col bg-white rounded-2xl p-8">
      <label>Email:</label>
      <input
        className={`${errorEmail ? "border-red-500" : "border-gray-300"
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
        onKeyDown={handleKeyDown} // Add this line
      />
      <label className="pt-8">Password:</label>
      <div className={`relative`}>
        <input
          type={showPassword ? "text" : "password"}
          className={`${errorPassword ? "border-red-500" : "border-gray-300"
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
          onKeyDown={handleKeyDown} // Add this line
        />
        <button
          type="button"
          className="absolute right-2 top-3 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {/*Check box */}
      <div className=" flex items-center pt-2">
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
      <div style={{ width: 300 }} className="pt-4 flex gap-2 flex justify-center">
        <div style={{ width: 200, height: 35 }}>
          {isLoading ? <div style={{ width: 110 }} className="flex justify-center"><Image
            src={Loading}
            alt=""
            width={30}
            height={30}
          /> </div> : <button
            style={{ fontSize: 13 }}
            onClick={handleSubmit}
            className="h-full w-full bg-blue-600 text-white rounded border-black rounded-2xl"
          >
            Log In
          </button>}
        </div>
        <div style={{ width: 200, height: 35 }}>
          <Link
            style={{ fontSize: 13 }}
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
      <Link style={{ width: 120 }} href={"/forgot-password"} className="mt-8 underline">Forgot Password</Link>
    </div>
    </div>
    <div style={{height: 500}} className="text-gray-500 font-bold bg-[#ffffff] p-16">
      <p style={{fontSize: 52}} className="text-black">What is HitMyGift?</p>
      <p style={{fontSize: 24, marginBottom: '20px', textAlign: 'justify'}}>At HitMyGift we offer you an innovative platform where you can easily create and share your wish lists. Do you have a birthday, christening, wedding or any special occasion coming up? Don't worry! You can also organize your events and share them with your friends and family, so they know what to give you and when to give it.
</p>
<p style={{fontSize: 24, textAlign: 'justify'}}>With HitMyGift, gift giving becomes an error-free and satisfying experience for everyone. Start creating your lists and events today and enjoy a modern and practical way to celebrate life!</p>
    </div>
    {/**Benefits */}
    <div style={{height: 530}} className="bg-[#f5f5f5]">
      <p style={{fontSize: 52}} className="font-bold flex justify-center items-center">Benefits</p>
      <div className="flex w-full justify-between pr-12 pl-12 mt-4">
      <div style={{width: 200}}>
        <img src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/check.png`} alt={"profile"} width={200} height={200}/> 
        <div className="flex justify-center">
        <p style={{fontSize: 24, width: 150}} className="font-bold text-center">
          You will always like your gift
        </p>
        </div>
      </div>
      <div style={{width: 200}}>
        <img src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/target.png`} alt={"profile"} width={200} height={200}/> 
        <div className="flex justify-center">
        <p style={{fontSize: 24, width: 150}} className="font-bold text-center">
          You will always give the right thing
        </p>
        </div>
      </div>
      <div style={{width: 200}}>
        <img src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/reminder.png`} alt={"profile"} width={200} height={200}/> 
        <div className="flex justify-center">
        <p style={{fontSize: 24, width: 150}} className="font-bold text-center">
          You will never forget your friends events
        </p>
        </div>
      </div>
      <div style={{width: 200}}>
        <img src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/chat_dialog.png`} alt={"profile"} width={200} height={200}/> 
        <div className="flex justify-center">
        <p style={{fontSize: 24, width: 150}} className="font-bold text-center">
          You can do a group gift with others
        </p>
        </div>
      </div>
      
      </div>
    </div>
    {/**Features */}
    <div style={{height: 530}} className="bg-[#ffffff]">
      <p style={{fontSize: 52}} className="font-bold flex justify-center items-center">Features</p>
      <div className="flex w-full justify-between pr-12 pl-12 mt-4">
      <div style={{width: 200}}>
        <img src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/wishlist.png`} alt={"profile"} width={200} height={200}/> 
        <div className="flex justify-center">
        <p style={{fontSize: 24, width: 150}} className="font-bold text-center">
          You will always like your gift
        </p>
        </div>
      </div>
      <div style={{width: 200}}>
        <img src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/buynow.png`} alt={"profile"} width={200} height={200}/> 
        <div className="flex justify-center">
        <p style={{fontSize: 24, width: 150}} className="font-bold text-center">
          You will always give the right thing
        </p>
        </div>
      </div>
      <div style={{width: 200}}>
        <img src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/calendar.png`} alt={"profile"} width={200} height={200}/> 
        <div className="flex justify-center">
        <p style={{fontSize: 24, width: 150}} className="font-bold text-center">
          You will never forget your friends events
        </p>
        </div>
      </div>
      <div style={{width: 200}}>
        <img src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/communication.png`} alt={"profile"} width={200} height={200}/> 
        <div className="flex justify-center">
        <p style={{fontSize: 24, width: 150}} className="font-bold text-center">
          You can do a group gift with others
        </p>
        </div>
      </div>
      
      </div>
    </div>
    <div style={{height: 250}} className="bg-[#027afe] text-white p-4">
    <p className="flex justify-center" style={{fontSize: 50}}>HitMyGift.com <span style={{fontSize: 24}}>&copy;</span></p>
    <p className="flex justify-center" style={{fontSize: 30}}>Terms & conditions</p>
    <p className="flex justify-center" style={{fontSize: 25}}>Contact Us</p>
    <p className="flex justify-center" style={{fontSize: 25}}>Cookies</p>
    </div>
  
    </div>
  );
}