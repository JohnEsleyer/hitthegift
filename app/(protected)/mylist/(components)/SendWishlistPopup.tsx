"use client";

import { sendFriendRequest } from "@/app/actions/user/sendFriendRequest";
import { RootState } from "@/lib/store";
import { useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import loading from "/public/loading.svg";
import { updateCurrentPopup } from "@/lib/features/popups";

export default function SendWishlistPopup() {


  const dispatch = useDispatch();

  const closePopup = () => {
    dispatch(updateCurrentPopup("none"));
  };

  return (
    <div
      style={{ height:  230, width: 450 }}
      className="flex flex-col gap-2 justify-center border-2 border-gray-300  items-center rounded-2xl p-16 bg-white"
    >
      <p>List sent and friend added successfully</p>
     
      <div className="mt-6 pl-8  h-12 pr-8 w-full flex justify-center gap-8">
     
        <button
          onClick={closePopup}
          style={{fontSize: 14, width: 60}}
          className="bg-[#027afe] text-white  rounded-full"
        >
          Ok
        </button>
      </div>
 
    </div>
  );
}
