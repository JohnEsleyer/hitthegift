"use client";

import { sendFriendRequest } from "@/app/actions/user/sendFriendRequest";
import { RootState } from "@/lib/store";
import { useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import loading from "/public/loading.svg";
import { updateCurrentPopup } from "@/lib/features/popups";

export default function AddFriendPopup() {
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
      style={{ height: showSentMessage ? 250 : 230, width: 450 }}
      className="flex flex-col gap-2 justify-center border-2 border-gray-300  items-center rounded-2xl p-16 bg-white"
    >
      <p>Enter your friend's email</p>
      <input
        type="text"
        style={{ width: 300, fontSize: 14, paddingLeft: 10 }}
        className="border border-gray-300 rounded-2xl "
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
  
      <div className="mt-6 pl-8  h-12 pr-8 w-full flex justify-center gap-8">
        <div  style={{fontSize: 14, width: 130}} className="w-24 flex justify-center">
          {isSending ? (
            <Image className="" src={loading} alt={""} width={30} height={30} />
          ) : (
            <button
              onClick={handleShareList}
             
              className="w-full bg-blue-600 text-white rounded-full "
            >
              OK
            </button>
          )}
        </div>
        <button
          onClick={closePopup}
          style={{fontSize: 14, width: 130}}
          className="bg-black text-white  rounded-full"
        >
          Cancel
        </button>
      </div>
      {showSentMessage && (
        <div className="h-12 flex flex-col justify-center" style={{fontSize: 10}}>
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
