"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "/public/loading.svg";
import Image from "next/image";
import { UserData } from "@/lib/types/user";
import { useDispatch } from "react-redux";
import { updateCurrentPopup } from "@/lib/features/popups";
import {
  updateUserData,
  updateUserFirstNameStore,
  updateUserId,
} from "@/lib/features/userData";
import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { Spicy_Rice } from "next/font/google";
import { Snowfall } from "../(landing-page)/Snowfall";



const spicy = Spicy_Rice({
    weight: "400",
    subsets: ["latin"],
  });


export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showTermsNConditions, setShowTermsNConditions] =
    useState<boolean>(false);
  const [didReadTerms, setDidReadTerms] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    hobbyInfo: "",
    birthday: "",
    showInterest: true,
    verified: false,
    verificationToken: "",
    friendsList: [],
    conversations: [],
    resetToken: "",
  });

  // States to display red border if error
  const [errorFirstName, setErrorFirstName] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
  const [errorDateOfBirth, setErrorDateOfBirth] = useState(false);
  const [errorHobbiesInfo, setErrorHobbiesInfo] = useState(false);
  const [errorTerms, setErrorTerms] = useState(false);

  const handleSubmit = async () => {
    setResponseMessage("");
    setIsError(false);
    setIsLoading(true);

    setErrorFirstName(false);
    setErrorLastName(false);
    setErrorEmail(false);
    setErrorPassword(false);
    setErrorConfirmPassword(false);
    setErrorDateOfBirth(false);
    setErrorHobbiesInfo(false);
    setErrorTerms(false);
    
    let invalidInputs = 0; // count the number of invalid inputs
    if (userData.firstName == "") {
      setResponseMessage("Please provide your first name.");
      setErrorFirstName(true);
      invalidInputs++;
    }

    if (userData.lastName == "") {
      setResponseMessage("Please provide your last name.");
      setErrorLastName(true);
      invalidInputs++;
    }

    if (userData.email == "") {
      setResponseMessage("Please provide your email address.");
      setErrorEmail(true);
      invalidInputs++;
    }

    if (userData.password == "") {
      setResponseMessage("Password is empty.");
      setErrorPassword(true);
      invalidInputs++;
    }

    if (confirmPassword == "") {
      setResponseMessage("Please confirm your passsword.");
      setErrorConfirmPassword(true);
      invalidInputs++;
    }

    if (userData.birthday == "") {
      setResponseMessage("Please provide your date of birth.");
      setErrorDateOfBirth(true);
      invalidInputs++;
    }

    if (userData.hobbyInfo == "") {
      setResponseMessage("Please provide your hobbies and interest.");
      setErrorHobbiesInfo(true);
      invalidInputs++;
    }

    if (!didReadTerms) {
      setResponseMessage("Please read the terms and conditions.");
      setErrorTerms(true);
      invalidInputs++;
    }

    if (confirmPassword !== userData.password) {
      setErrorPassword(true);
      setErrorConfirmPassword(true);
      setResponseMessage("Passwords do not match");
      invalidInputs++;
    }

    // Do not proceed if there are still errors
    if (invalidInputs == 1) {
      setIsError(true);
      setIsLoading(false);
      return;
    } else if (invalidInputs > 1) {
      setIsError(true);
      setIsLoading(false);
      setResponseMessage("Missing or invalid input");
      return;
    }

    const registerUser = async () => {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "applcation/json",
          },
          body: JSON.stringify({
            firstName: userData?.firstName as string,
            lastName: userData?.lastName as string,
            email: userData?.email as string,
            password: userData?.password as string,
            hobbyInfo: userData?.hobbyInfo as string,
            birthday: userData?.birthday as string,
            showInterest: userData?.showInterest as boolean,
            friendsList: [],
            conversations: [],
          }),
        });

        const responseData = await response.json();

        console.log(`Status: ${response.status}`);
        if (response.status == 200) {
          setResponseMessage(responseData.message);
          setTimeout(() => {

            dispatch(
              updateUserData({
                id: responseData.userId,
                firstName: userData.firstName,
                lastName: userData.lastName,
                verified: userData.verified,
                verificationToken: responseData.verificationToken,
                email: userData.email,
                hobbyInfo: userData.hobbyInfo,
                showInterest: false,
                birthday: userData.birthday,
              })
            );

            setIsError(false);
            dispatch(updateCurrentPopup("none"));
            router.push("/mylist");
          }, 3000);
        } else {
          setIsLoading(false);
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    };
    registerUser();
  };
  return (
    <RenderClientOnly loading={<div></div>}>
      <div className="h-screen w-screen">
        <div className="overflow-auto relative  hide-scrollbar h-screen w-screen flex flex-col bg-gradient-to-b from-[#030c42] to-blue-500 text-black ">
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
          
            {/**Register */}
            <div className="relative flex justify-center w-screen pt-4" style={{zIndex: 100}}>
            <div className="text-xs gap-4 p-4 flex flex-col border bg-white rounded-2xl">
          <div className="flex gap-2">
            {/*Name */}
            <div className="flex-1 flex flex-col">
              <label>First Name:</label>
              <input
                className={`${
                  errorFirstName ? "border-red-500" : "border-[#d9d9d9]"
                } border-2 p-2 rounded`}
                type="text"
                placeholder="First Name"
                onChange={(e) => {
                  setErrorFirstName(false);
                  setUserData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }));
                }}
                required
              />
            </div>

            {/*Last Name */}
            <div className="flex-1 flex flex-col">
              <label>Last Name:</label>
              <input
                className={`${
                  errorLastName ? "border-red-500" : "border-[#d9d9d9]"
                } border-2 p-2  rounded`}
                type="text"
                placeholder="Last Name"
                onChange={(e) => {
                  setErrorLastName(false);
                  setUserData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }));
                }}
                required
              ></input>
            </div>
          </div>
          <div>
            {/*Email */}
            <div className="flex flex-col">
              <label>Email:</label>
              <input
                className={`${
                  errorEmail ? "border-red-500" : "border-[#d9d9d9]"
                } p-2 border-2 rounded`}
                type="text"
                placeholder="firstname@email.com"
                onChange={(e) => {
                  setErrorEmail(false);
                  setUserData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                }}
                required
              />
            </div>
          </div>
          <div>
            {/*Password */}
            <div className="flex flex-col">
              <label>Password:</label>
              <input
                className={`${
                  errorPassword ? "border-red-500" : " border-[#d9d9d9]"
                } border-2 p-2 rounded`}
                type="password"
                placeholder="*******"
                onChange={(e) => {
                  setErrorPassword(false);
                  setUserData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
                required
              />
            </div>
          </div>
          <div>
            {/*Confirm Password */}
            <div className="flex flex-col">
              <label>Confirm Password:</label>

              <input
                className={`${
                  errorConfirmPassword ? "border-red-500" : "border-[#d9d9d9]"
                } border-2 p-2 rounded`}
                type="password"
                placeholder="*******"
                onChange={(e) => {
                  setErrorConfirmPassword(false);
                  setConfirmPassword(e.target.value);
                }}
                required
              />
            </div>
          </div>

          {/**Date of Birth and Toggle On/Off */}
          <div className="flex gap-4 ">
            <div className="flex flex-col">
              <label>Date of Birth</label>
              <input
                className={`${
                  errorDateOfBirth ? "border-red-500" : "border-[#d9d9d9]"
                } border-2`}
                type="date"
                onChange={(e) => {
                  setErrorDateOfBirth(false);
                  setUserData((prev) => ({
                    ...prev,
                    birthday: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span>On/Off</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setUserData((prev) => ({
                        ...prev,
                        showInterest: e.target.checked,
                      }));
                    }}
                  />

                  <span className="slider round"></span>
                </label>
              </div>
              <p>You want your friends to see your interests</p>
            </div>
          </div>
          {/** Hobbies and interests **/}
          <div>
            <span>Hobbies and interests</span>
            <div>
              <textarea
                style={{ width: 550, height: 140 }}
                className={`${
                  errorHobbiesInfo ? "border-red-500" : "border-[#d9d9d9]"
                } border p-2`}
                onChange={(e) => {
                  setUserData((prev) => ({
                    ...prev,
                    hobbyInfo: e.target.value,
                  }));
                }}
              ></textarea>
            </div>
          </div>
          {/**Checkbox for Terms and Conditions */}
          <div>
            <div className="flex gap-1">
              <input type="checkbox" checked={didReadTerms} onChange={(e) => {
                setDidReadTerms(e.target.checked);
              }}/>
              <p>
                I have read and accept the terms and conditions for this page.
              </p>
            </div>
            <button
              onClick={() => {
                setShowTermsNConditions(true);
              }}
              className="text-blue-600 underline"
            >
              Read terms and conditions
            </button>
          </div>
          {/** Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 p-2 pl-16 pr-16 rounded-full text-white"
            >
              Create
            </button>
            <button className="bg-black p-2 pl-16 pr-16 rounded-full text-white">
              Cancel
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-8">
            {isLoading && <Image src={Loading} height={30} width={30} alt="" />}
            <p className={`${isError && "text-red-500"}`}>{responseMessage}</p>
          </div>
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
