"use client";

import { LoginData } from "@/lib/types/authTypes";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loading from "/public/loading.svg";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  updateUserData,
  updateUserFirstNameStore,
  updateUserId,
} from "@/lib/features/userData";
import { updateCurrentPopup } from "@/lib/features/popups";
import updateUserFirstName from "../actions/user/updateUserFirstName";
import getUserInfo from "../actions/user/getUserInfo";

type ResponseData = {
  message: string;
  status: number;
  userId: string;
};

export default function LoginPage() {
  const dispatch = useDispatch();

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

  // States to display red border if error
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    setErrorMessage('');
    setIsLoading(true);
    setErrorMessage("");

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
              // dispatch(updateUserId(data.userId));
              // dispatch(updateUserFirstNameStore(userData.firstName as string));
              dispatch(updateUserData({
                id: data.userId || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                verified: userData.verified || false,
                verificationToken: userData.verificationToken || '',
                email: userData.email || "",
                hobbyInfo: userData.hobbyInfo || '',
                showInterest: false,
              }));

              // seterrorMessage(false);
              dispatch(updateCurrentPopup("none"));
              router.push("/mylist");
            } else {
              setErrorMessage(data.message);
              // seterrorMessage(true);
              setIsLoading(false);
            }
          }, 3000);
        } else {
        }
      } catch (e) {
        console.log(`Client Error: ${e}`);
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
    <div className='h-screen w-screen bg-[url("https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/background.webp")] bg-cover bg-center flex items-center justify-center'>

      <div className="flex flex-col bg-white rounded-2xl p-8">
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
              console.log(e);
              // setUserData((prev) => ({
              //   ...prev,
              //   showInterest: e.target.checked,
              // }));
            }}
          />
          <span className="pl-2">Remember me</span>
        </div>

        <div className="pt-4 flex gap-2 flex justify-center">
          <button
            style={{ fontSize: 13 }}
            onClick={handleSubmit}
            className=" p-2 pl-8 pr-8 bg-blue-500 text-white rounded border-black rounded-2xl"
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
        <Link href={"/forgot-password"}className="pt-8 underline">Forgot Password</Link>
      </div>
    </div>
  );
}
