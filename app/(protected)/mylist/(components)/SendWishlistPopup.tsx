"use client";

import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPopup } from "@/lib/features/popups";

export default function SendWishlistPopup() {
  const invitedEmail = useSelector((state: RootState) => state.popups.invitedEmail);

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
      <div className="h-12 flex flex-col justify-center" style={{fontSize: 14}}>
          <p className="text-center text-green-600">Friend Request is sent to {invitedEmail}</p>
          <p className="text-center text-xs text-gray-500">
            If the email doesn't have an account, they'll receive an invitation
            from their email
          </p>
        </div>
      <div className="mt-6 pl-8  h-12 pr-8 w-full flex justify-center gap-8">
     
        <button
          onClick={closePopup}
          style={{fontSize: 14, width: 60, height: 30}}
          className="bg-[#027afe] text-white  rounded-full"
        >
          Ok
        </button>
      </div>
 
    </div>
  );
}
