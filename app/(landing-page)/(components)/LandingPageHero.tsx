"use client";

import { LoginData } from "@/lib/types/authTypes";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loading from "/public/loading.svg";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "@/lib/features/userData";
import { updateCurrentPopup } from "@/lib/features/popups";
import Cookies from "js-cookie";
import { RootState } from "@/lib/store";
import verifyToken from "@/app/actions/auth/verifyToken";
import { navigateTo } from "@/app/actions/navigateTo";
import getUserInfo from "@/app/actions/user/getUserInfo";
import useIsDesktop from "@/utils/hooks/useIsDesktop";
import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";

type ResponseData = {
  message: string;
  status: number;
  userId: string;
};

export default function LandingPageHero() {
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
  const isDesktop = useIsDesktop();

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
    <RenderClientOnly loading={<div className="h-screen w-screen"></div>}>
      <div>
        {isDesktop ? (
          <div
            style={{ height: 720 }}
            className={`bg-[#31241e] w-screen bg-[url("https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/background.webp")] bg-cover bg-center flex flex-col md:flex-row items-start justify-center min-h-screen`}
          >
            {/* Hero */}
            <div className="w-full md:w-fit md:h-screen text-white p-2 md:p-0 flex flex-col items-center md:items-start">
              <img
                style={{ height: 80 }}
                className="mt-12 mb-8 mx-auto md:mx-0"
                src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/logo.png`}
                alt={"profile"}
              />
              <p className="pr-24 font-bold text-4xl md:text-9xl leading-none text-center md:text-left">
                Share your
              </p>
              <p className="text-[#027afe] font-bold text-4xl md:text-8xl leading-none text-center md:text-left">
                wishes
              </p>

              <p className="font-bold text-2xl md:text-5xl leading-none text-center md:text-left">
                the easiest way to get it
              </p>
              <p className="text-[#027afe] font-bold text-2xl md:text-5xl leading-none text-center md:text-left">
                right
              </p>
            </div>
            {/* Login Form */}
            <div className="h-screen flex items-center">
              <div className=" w-full max-w-sm flex flex-col bg-white rounded-2xl p-8 mt-8 md:mt-0 hidden md:flex">
                {/* Login Form Fields */}
                <label>Email:</label>
                <input
                  className={`${
                    errorEmail ? "border-red-500" : "border-gray-300"
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
                    className={`${
                      errorPassword ? "border-red-500" : "border-gray-300"
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
                  <div className="w-32">
                    {isLoading ? (
                      <div className="flex justify-center">
                        <Image src={Loading} alt="" width={30} height={30} />
                      </div>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="h-full w-32 bg-blue-600 text-white rounded border-black rounded-2xl py-2"
                      >
                        Log In
                      </button>
                    )}
                  </div>
                  <div className="w-full">
                    <Link
                      href="/register"
                      className="h-full w-40 flex justify-center items-center rounded bg-black text-white rounded-2xl py-2"
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
                <Link href={"/forgot-password"} className="mt-8 underline">
                  Forgot Password
                </Link>
              </div>
            </div>
            {/* Mobile Buttons */}
            <div className="w-full flex flex-col items-center mt-8 md:hidden">
              <Link
                href="/login"
                className="mb-4 w-1/2 bg-blue-600 text-white rounded border-black rounded-2xl py-2 text-center"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="w-1/2 bg-black text-white rounded border-black rounded-2xl py-2 text-center"
              >
                Register
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-screen flex flex-col items-start justify-start min-h-screen">
            <div className="w-screen flex flex-col justify-center ">
            <div className=" pl-8 mt-8 w-full flex justify-between items-center text-2xl ">
              <img
                style={{ height: 70 }}
                className="mb-8"
                src={`https://imageassets-hitmygift.${process.env.NEXT_PUBLIC_SPACES_CDN_ENDPOINT}/logo-black.png`}
                alt={"logo"}
              />
              <a className="pr-8" href="#about">
                About
              </a>
            </div>
            <div className="pl-2 w-full flex flex-col items-center">
              <p className="w-96 mt-12 font-bold text-6xl leading-none text-start text-black">
                Share your
              </p>
              <p className="w-96 text-[#027afe]font-bold text-6xl leading-none text-start">
                wishes
              </p>
              <div className="w-96 pl-1">
                <p className="font-bold text-3xl leading-none text-start text-black">
                  the easiest way to get it
                </p>
                <p className="text-[#027afe] font-bold text-3xl leading-none text-start">
                  right
                </p>
              </div>
              <p className="max-w-96 flex mt-4 text-start text-black text font-bold text-gray-500">
                Start creating your lists and events today and enjoy a modern
                and practical way to celebrate life!
              </p>
              <div className="w-80 flex flex items-center justify-between mt-8 gap-2">
                <Link
                  href="/login"
                  className="mb:w-64 w-32 bg-blue-600 text-white rounded-2xl py-2 text-center"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="mb:w-64 w-40 bg-black text-white rounded-2xl py-2 text-center"
                >
                  Create an account
                </Link>
              </div>
            </div>
            </div>
          </div>
        )}
      </div>
    </RenderClientOnly>
  );
}
