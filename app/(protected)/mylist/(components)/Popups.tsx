"use client";

import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddEventPopup from "./(events-popups)/AddEventPopup";
import AddProductPopup from "./(products-popups)/AddProductPopup";
import FriendsSidebar from "./FriendsSidebar";
import ProfilePopup from "./ProfilePopup";
import EditProductPopup from "./(products-popups)/EditProductPopup";
import EditEventPopup from "./(events-popups)/EditEventPopUp";
import DeleteFriendPopup from "./DeleteFriendPopup";
import DeleteFriendRequestPopup from "./DeleteFriendRequest";
import { updateIsSidebarOpen } from "@/lib/features/friendsSidebar";
import ShareWishlistPopup from "./ShareWishlistPopup";

interface PopupPageProps {
  children: ReactNode;
}
export function Popups({ children }: PopupPageProps) {
  const currentPopup = useSelector(
    (state: RootState) => state.popups.currentPopup
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateCurrentPopup("none"));
  }, []);

  const handleClosePopup = () => {
    if (currentPopup !== "none") {
      console.log("Closing Popup");
      dispatch(updateCurrentPopup("none"));
      dispatch(updateIsSidebarOpen(false));
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div
        onClick={handleClosePopup}
        className={`flex h-full w-full ${
          currentPopup !== "none" && "blurcontent"
        }`}
      >
        {children}
      </div>
      {currentPopup == "friends" && (
        <div
          className="rounded-2xl p-2 bg-slate-100 border border-black border-2 rounded"
          style={{
            position: "absolute",
            top: 60,
            right: 0,
            bottom: 0,
            width: 300,
            zIndex: 999,
            transition: "transform 0.3s ease-in-out",
            transform:
              currentPopup == "friends"
                ? "translateX(0)"
                : "translateX(100%)",
          }}
        >
          <FriendsSidebar
            onClick={() => dispatch(updateCurrentPopup("none"))}
          />
        </div>
      )}

      {/**Add Product  */}
      {currentPopup == "addProduct" && (
        <div
          style={{ zIndex: 999, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          {" "}
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
          <AddProductPopup />
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
        </div>
      )}
      {/**Edit Product  */}
      {currentPopup == "editProduct" && (
        <div
          style={{ zIndex: 999, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          {" "}
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
          <EditProductPopup/>
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
        </div>
      )}


      {/**Add Event Popup*/}
      {currentPopup == "addEvent" && (
        <div
          style={{ zIndex: 999, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
          <AddEventPopup />
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
        </div>
      )}


      {/**Edit Event Popup*/}
      {currentPopup == "editEvent" && (
        <div
          style={{ zIndex: 999, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
          <EditEventPopup />
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
        </div>
      )}


      {/**Profile Popup*/}
      {currentPopup == "profile" && (
        <div
          style={{ zIndex: 999, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
          <ProfilePopup />
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
        </div>
      )}

       {/**Delete Friend Popup*/}
       {currentPopup == "deleteFriend" && (
        <div
          style={{ zIndex: 999, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
          <DeleteFriendPopup/>
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
        </div>
      )}

       {/**Delete FriendRequest Popup*/}
       {currentPopup == "deleteFriendRequest" && (
        <div
          style={{ zIndex: 999, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
          <DeleteFriendRequestPopup/>
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
        </div>
      )}

      {/**Send Wishlist and Add Friend Popup */}
      {currentPopup == "shareWishlist" && (
        <div
          style={{ zIndex: 999, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
          <ShareWishlistPopup/>
          <div onClick={handleClosePopup} className="flex-1 h-screen"></div>
        </div>
      )}
    </div>
  );
}
