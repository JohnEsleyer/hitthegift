"use client";

import { LoginData } from "@/lib/types/authTypes";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import Loading from "/public/loading.svg";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateUserData } from "@/lib/features/userData";
import { updateCurrentPopup } from "@/lib/features/popups";
import getUserInfo from "../actions/user/getUserInfo";
import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { SnowHills } from "../(landing-page)/Snowhills";
import { Snowfall } from "../(landing-page)/Snowfall";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import { Spicy_Rice } from "next/font/google";

type ResponseData = {
  message: string;
  status: number;
  userId: string;
};

const spicy = Spicy_Rice({
  weight: "400",
  subsets: ["latin"],
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const { width, height } = useWindowSize();
  const router = useRouter();
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
              router.push("/mylist");
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

  return (
    <RenderClientOnly loading={<div></div>}>
      <div className="overflow-auto h-screen w-screen hide-scrollbar overflow-x-hidden">
        <div className="relative h-screen w-screen flex flex-col bg-gradient-to-b from-[#030c42] to-blue-500 text-white ">
          <div className="flex justify-center">
            <p
              style={{
                fontSize: 30,
              }}
              className={`${spicy.className} font-bold`}
            >
              <span className="text-[#eb4034]">Hit</span>
              <span className="text-white">My</span>
              <span className="text-[#0cb00c]">Gift</span>
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-start pt-4 items-center text-center w-screen">
          
            {/**Login */}
            <div className="relative flex justify-center w-screen pt-24" style={{zIndex: 100}}>
            <div className="absolute flex flex-col bg-white rounded-2xl p-8 text-black">
              <label className=" flex justify-start">Email:</label>
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
              <label className="pt-8  flex justify-start">Password:</label>
              <div className={`relative`}>
                <input
                  type={showPassword ? "text" : "password"}
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
                    console.log(e);
                  }}
                />
                <span className="pl-2">Remember me</span>
              </div>
              <div className="pt-4 flex gap-2 flex justify-center">
                <button
                  style={{ fontSize: 13 }}
                  onClick={handleSubmit}
                  className=" p-2 pl-8 pr-8 bg-blue-600 text-white rounded border-black rounded-2xl"
                >
                  Log In
                </button>
                <Link
                  style={{ fontSize: 13 }}
                  href="/register"
                  className="p-2 border-2 pl-8 pr-8 rounded bg-black text-white rounded-2xl"
                >
                  Create an Account
                </Link>
              </div>
              {/*Loading */}
              <div className="flex justify-center h-12">
                <Image
                  src={Loading}
                  alt=""
                  className={`${!isLoading && "invisible"}`}
                  width={30}
                  height={30}
                />
              </div>
              <p
                className={`h-4 ${
                  !errorMessage && "invisible"
                } flex justify-center text-red-500`}
              >
                {errorMessage}
              </p>
              <Link href={"/forgot-password"} className="pt-8 underline">
                Forgot Password
              </Link>
            </div>
          </div>
          </div>
          <div className="absolute">
            <Snowfall />
          </div>
        </div>
      </div>
    </RenderClientOnly>
  );
}
