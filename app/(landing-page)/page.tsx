"use client";

import { LoginData } from "@/lib/types/authTypes";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loading from "/public/loading.svg";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "@/lib/features/userData";
import { updateCurrentPopup } from "@/lib/features/popups";
import getUserInfo from "../actions/user/getUserInfo";
import Cookies from "js-cookie";
import { navigateTo } from "../actions/navigateTo";
import { RootState } from "@/lib/store";
import verifyToken from "../actions/auth/verifyToken";
import LandingPageHero from "./(components)/LandingPageHero";

type ResponseData = {
  message: string;
  status: number;
  userId: string;
};

export default function LandingPage() {
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
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // Reset error message and set loading state
    setErrorMessage("");
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
            console.log(`Response Status: ${response.status}`);
            if (data.status == 200 && userData) {
              dispatch(
                updateUserData({
                  id: data.userId || "",
                  firstName: userData.firstName || "",
                  lastName: userData.lastName || "",
                  verified: userData.verified || false,
                  verificationToken: userData.verificationToken || "",
                  email: userData.email || "",
                  hobbyInfo: userData.hobbyInfo || "",
                  showInterest: false,
                  birthday: userData.birthday || "",
                })
              );

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
      if (token) {
        const res = await verifyToken(token);
        if (res.status == 200 && rememberMe && isVerified) {
          navigateTo("/mylist");
        }
      }
    }
    validateToken();
  }, []);
  return (
    <div>
      <LandingPageHero/>
      {/* What is HitMyGift section */}
      <div id="about" className="text-gray-500 font-bold bg-[#ffffff] p-4 md:p-16">
        <p className="text-black text-4xl md:text-6xl">What is HitMyGift?</p>
        <p className="text-lg md:text-xl mb-4 mt-8 text-justify">
          At HitMyGift we offer you an innovative platform where you can easily
          create and share your wish lists. Do you have a birthday, christening,
          wedding or any special occasion coming up? Don't worry! You can also
          organize your events and share them with your friends and family, so
          they know what to give you and when to give it.
        </p>
        <p className="text-lg md:text-xl mt-8 text-justify">
          With HitMyGift, gift giving becomes an error-free and satisfying
          experience for everyone. Start creating your lists and events today
          and enjoy a modern and practical way to celebrate life!
        </p>
      </div>
      {/* Benefits */}
      <div className="bg-[#f5f5f5] p-4 md:p-8">
        <p className="font-bold text-4xl md:text-6xl flex justify-center items-center">
          Benefits
        </p>
        <div className="flex flex-col md:flex-row w-full justify-between mt-4">
          <div className="w-full md:w-1/4 flex flex-col items-center mb-8 md:mb-0">
            <img
              src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/check.png`}
              alt={"profile"}
              className="w-32 h-32 md:w-48 md:h-48"
            />
            <p className="font-bold text-center text-xl md:text-xl mt-4">
              You will always like your gift
            </p>
          </div>
          <div className="w-full md:w-1/4 flex flex-col items-center mb-8 md:mb-0">
            <img
              src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/target.png`}
              alt={"profile"}
              className="w-32 h-32 md:w-48 md:h-48"
            />
            <p className="font-bold text-center text-xl md:text-xl mt-4">
              You will always give the right thing
            </p>
          </div>
          <div className="w-full md:w-1/4 flex flex-col items-center mb-8 md:mb-0">
            <img
              src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/reminder.png`}
              alt={"profile"}
              className="w-32 h-32 md:w-48 md:h-48"
            />
            <p className="font-bold text-center text-xl md:text-xl mt-4">
              You will never forget your friends' events
            </p>
          </div>
          <div className="w-full md:w-1/4 flex flex-col items-center">
            <img
              src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/chat_dialog.png`}
              alt={"profile"}
              className="w-32 h-32 md:w-48 md:h-48"
            />
            <p className="font-bold text-center text-xl md:text-xl mt-4">
              You can do a group gift with others
            </p>
          </div>
        </div>
      </div>
      {/* Features */}
      <div className="bg-[#ffffff] p-4 md:p-8">
        <p className="font-bold text-4xl md:text-6xl flex justify-center items-center">
          Features
        </p>
        <div className="flex flex-col md:flex-row w-full justify-between mt-4">
          <div className="w-full md:w-1/4 flex flex-col items-center mb-8 md:mb-0">
            <img
              src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/wishlist.png`}
              alt={"profile"}
              className="w-32 h-32 md:w-48 md:h-48"
            />
            <p className="font-bold text-center text-xl md:text-2xl mt-4">
              Create wishlists with ease
            </p>
          </div>
          <div className="w-full md:w-1/4 flex flex-col items-center mb-8 md:mb-0">
            <img
              src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/buynow.png`}
              alt={"profile"}
              className="w-32 h-32 md:w-48 md:h-48"
            />
            <p className="font-bold text-center text-xl md:text-2xl mt-4">
              Buy gifts directly
            </p>
          </div>
          <div className="w-full md:w-1/4 flex flex-col items-center mb-8 md:mb-0">
            <img
              src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/calendar.png`}
              alt={"profile"}
              className="w-32 h-32 md:w-48 md:h-48"
            />
            <p className="font-bold text-center text-xl md:text-2xl mt-4">
              Event reminders
            </p>
          </div>
          <div className="w-full md:w-1/4 flex flex-col items-center">
            <img
              src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/landing-page/communication.png`}
              alt={"profile"}
              className="w-32 h-32 md:w-48 md:h-48"
            />
            <p className="font-bold text-center text-xl md:text-2xl mt-4">
              Group gifting
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#027afe] text-white p-4">
        <p className="flex justify-center text-4xl md:text-3xl">
          HitMyGift.com <span className="text-xl md:text-xl">&copy;</span>
        </p>
        <p className="flex justify-center text-2xl md:text-sm">
          Terms & Conditions
        </p>
        <p className="flex justify-center text-xl md:text-sm">Contact Us</p>
        <p className="flex justify-center text-xl md:text-sm">Cookies</p>
      </div>
    </div>
  );
}