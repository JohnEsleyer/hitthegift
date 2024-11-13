"use client";

import { sendFriendRequest } from "@/app/actions/user/sendFriendRequest";
import { RootState } from "@/lib/store";
import { useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import loading from "/public/loading.svg";
import { updateCurrentPopup } from "@/lib/features/popups";

export default function SendWishlistPopup() {
  const [friendEmail, setFriendEmail] = useState("");
  const [isSending, startSendTransition] = useTransition();
  const [showSentMessage, setShowSentMessage] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const userId = useSelector((state: RootState) => state.userData.id);
  const dispatch = useDispatch();

  const handleShareList = async () => {
    if (friendEmail !== "") {
      setShowSentMessage(true);
      setSentEmail(friendEmail);
      setFriendEmail("");
      startSendTransition(async () => {
        try {
          await sendFriendRequest(userId, friendEmail);
        } catch (e) {
          console.log(e);
        }
      });
    }
  };

  const closePopup = () => {
    dispatch(updateCurrentPopup("none"));
  };

  return (
    <div
      style={{ height: 230 }}
      className="flex flex-col gap-2 justify-center border-2 border-gray-300  items-center rounded-2xl p-16 bg-white"
    >
      <p>Enter your friend's email</p>
      <input
        type="text"
        style={{ width: 400 }}
        className="border border-black rounded-2xl p-2"
        placeholder="friendname@email.com"
        value={friendEmail}
        onChange={(e) => {
          setShowSentMessage(false);
          setFriendEmail(e.target.value);
        }}
      />

      <p className="text-xs text-gray-500">
        Your wishlist will be shared automatically with your new friend.
      </p>
  
      <div className="mt-6 pl-8  h-12 pr-8 w-full flex justify-between">
        <div className="w-24 flex justify-center">
          {false ? (
            <Image className="" src={loading} alt={""} width={30} height={30} />
          ) : (
            <button
              onClick={handleShareList}
              className="bg-blue-600 text-white rounded-full p-2 pl-12 pr-12"
            >
              OK
            </button>
          )}
        </div>
        <button
          onClick={closePopup}
          className="bg-black text-white p-2 pl-12 pr-12 rounded-full"
        >
          Cancel
        </button>
      </div>
      {showSentMessage && (
        <div className="h-12 flex flex-col justify-center">
          <p className="text-center text-green-600">Friend Request is sent to {sentEmail}</p>
          <p className="text-center text-xs text-gray-500">
            If the email doesn't have an account, they'll receive an invitation
            from their email
          </p>
        </div>
      )}
    </div>
  );
}
