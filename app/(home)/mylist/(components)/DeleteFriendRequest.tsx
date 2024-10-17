"use client";

import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "/public/loading.svg";
import Image from "next/image";
import deleteFriend from "@/app/actions/user/deleteFriend";
import deleteFriendRequest from "@/app/actions/user/deleteFriendRequest";

export default function DeleteFriendRequestPopup() {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const friendRequestId = useSelector(
    (state: RootState) => state.friendsSidebar.toDeleteFriendRequest
  );
  const userId = useSelector((state: RootState) => state.userData.id);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeleteFriendRequest = async () => {
    startTransition(async () => {
      try {
        const res = await deleteFriendRequest(friendRequestId);
        if (res){
            console.log(res.status || '');

            dispatch(updateCurrentPopup("friends"));
        }
 
      } catch (e) {
        console.log(e);
        setErrorMessage("Failed to delete friend");
      }
    });
  };

  return (
    <div
      style={{ height: 230 }}
      className="flex flex-col justify-center border border-gray items-center rounded-2xl p-16 bg-white "
    >
      <p className="mt-4">Are you sure you want to delete this friend request?</p>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleDeleteFriendRequest}
          className="text-white bg-blue-500 rounded-2xl p-2 pl-4 pr-4"
        >
          Yes
        </button>
        <button
          onClick={() => {
            dispatch(updateCurrentPopup("friends"));
          }}
          className="text-white bg-black rounded-2xl p-2 pl-4 pr-4"
        >
          No
        </button>
      </div>
      <div
        style={{ height: 40 }}
        className="h-4 mt-2 w-full flex flex-col justify-center items-center"
      >
        <Image
          className={`${!isPending && "invisible"} mt-4`}
          src={Loading}
          alt=""
          width={30}
          height={30}
        />
        <p className={`${!isPending && "invisible"} text-red-600`}>
          {errorMessage}
        </p>
      </div>
    </div>
  );
}
