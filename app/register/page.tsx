"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "/public/loading.svg";
import Image from "next/image";
import { UserData } from "@/lib/types/user";
import { useDispatch } from "react-redux";
import { updateCurrentPopup } from "@/lib/features/popups";
import { updateUserData } from "@/lib/features/userData";
import TermsAndConditions from "./TermsAndConditions";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import { navigateTo } from "../actions/navigateTo";
import Cookies from "js-cookie";
import { createEvent } from "../actions/events/createEvent";
import { useWindowSize } from "@/utils/hooks/useWindowSize";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isPasswordStrong, setIsPasswordStrong] = useState<boolean>(false);
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
  const { width, height } = useWindowSize();
  const handleSubmit = async (passwordStrong: boolean) => {
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

    if (!passwordStrong) {
      setResponseMessage("Password is not strong enough");
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
    console.log(`invalidInputs: ${invalidInputs}`);
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
            // dispatch(updateUserId(responseData.userId));
            // dispatch(updateUserFirstNameStore(userData.firstName));
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
            router.push("/verify-email");
          }, 3000);
          Cookies.set("rememberMe", "false");
        } else {
          setIsLoading(false);
        }

        // Automatically create temporary events for the user
        const responseData2 = await createEvent({
          userId: responseData.userId,
          data: {
            id: "",
            userId: responseData.userId,
            date: userData.birthday,
            eventTitle: "My birthday",
            invitedFriends: [],
          },
        });
        if (responseData2) {
          console.log(`Register - Create Event: ${responseData2.status}`);
        }
      } catch (e) {
        console.log(`Failed to register user: ${e}`);
        setIsLoading(false);
      }
    };
    registerUser();
  };

  return (
    <div>
      {/*Terms and conditions */}
      {showTermsNConditions && (
        <div
          style={{ zIndex: 100, position: "absolute" }}
          className={`flex justify-center items-center w-screen h-screen`}
        >
          <div
            style={{ width: 500, height: 600 }}
            className="p-4 bg-white rounded-2xl border-2 border-black"
          >
            <div style={{ height: 500 }} className="overflow-auto ">
              <div className="container mx-auto p-2">
                <TermsAndConditions />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setShowTermsNConditions(false);
                  }}
                  className="flex justify-center bg-blue-600 p-2 text-white font-bold rounded mt-4"
                >
                  Read
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        style={{ zIndex: 1, position: "relative" }}
        className={`${
          showTermsNConditions && "blurcontent"
        } bg-[#31241e] bg-[url("https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/background.webp")] bg-cover bg-center h-screen w-screen overflow-auto`}
      >
        <div className={`flex flex-col items-center justify-center w-screen  `}>
          <div
            className="h-screen flex justify-center items-center"
          >
            <div
              style={{ width: 466, height: 570, marginTop: 20 }}
              className="overflow-auto hide-scrollbar text-xs gap-2 p-4 flex flex-col border bg-white rounded-2xl"
            >
              <div className="flex gap-2">
                {/*Name */}
                <div className="flex-1 flex flex-col">
                  <label>First Name:</label>
                  <input
                    style={{ height: 30 }}
                    className={`${
                      errorFirstName ? "border-red-500" : "border-gray-300"
                    } mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
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
                    style={{ height: 30 }}
                    className={`${
                      errorLastName ? "border-red-500" : "border-gray-300"
                    } mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
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
                    style={{ height: 30 }}
                    className={`${
                      errorEmail ? "border-red-500" : "border-gray-300"
                    }mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
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
                    style={{ height: 30 }}
                    className={`${
                      errorPassword ? "border-red-500" : " border-gray-300"
                    } mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
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
                {/**Password strength meter */}
                <div>
                  <PasswordStrengthMeter
                    password={userData.password}
                    onPasswordStrengthChange={(isStrong, pass) => {
                      setIsPasswordStrong(isStrong);
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    Password should be at least 8 characters with lowercase,
                    uppercase, numbers, and special characters.
                  </p>
                </div>
              </div>
              <div>
                {/*Confirm Password */}
                <div className="flex flex-col">
                  <label>Confirm Password:</label>

                  <input
                    style={{ height: 30 }}
                    className={`${
                      errorConfirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
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
                      errorDateOfBirth ? "border-red-500" : "border-gray-300"
                    } mt-1 block w-full px-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                    type="date"
                    onChange={(e) => {
                      setErrorDateOfBirth(false);
                      setUserData((prev) => ({
                        ...prev,
                        birthday: e.target.value,
                      }));
                      console.log(`birthday: ${new Date(e.target.value).toString()}`);
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
                    style={{ width: 430, height: 105 }}
                    className={`${
                      errorHobbiesInfo ? "border-red-500" : "border-gray-300"
                    } mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
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
                  <input
                    type="checkbox"
                    checked={didReadTerms}
                    onChange={(e) => {
                      setDidReadTerms(e.target.checked);
                    }}
                  />
                  <p>
                    I have read and accept the terms and conditions for this
                    page.
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
                {isLoading ? (
                  <div
                    style={{ width: 135 }}
                    className="flex justify-center items-center"
                  >
                    <Image src={Loading} height={25} width={25} alt="" />
                  </div>
                ) : (
                  <button
                    style={{ height: 25, width: 135 }}
                    onClick={() => {
                      handleSubmit(isPasswordStrong);
                    }}
                    className="bg-blue-600  flex justify-center items-center pl-12 pr-12 rounded-full text-white"
                  >
                    Create
                  </button>
                )}
                <button
                  onClick={() => {
                    navigateTo("/login");
                  }}
                  style={{ height: 25 }}
                  className="bg-black pl-12 pr-12 rounded-full text-white"
                >
                  Cancel
                </button>
              </div>
              <div className="flex flex-col items-center justify-center h-8">
                <p className={`${isError && "text-red-500"}`}>
                  {responseMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
