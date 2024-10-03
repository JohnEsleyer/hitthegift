"use client";

import { updateCurrentOverlay } from "@/lib/features/overlays";
import { RootState } from "@/lib/store";
import { ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddEventOverlay from "./AddEventOverlay";
import AddProductOverlay from "./AddProductOverlay";
import FriendsSidebar from "./FriendsSidebar";
import ProfileOverlay from "./ProfileOverlay";

interface OverlayPageProps {
  children: ReactNode;
}
export function OverlayPage({ children }: OverlayPageProps) {
  const currentOverlay = useSelector(
    (state: RootState) => state.overlays.currentOverlay
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateCurrentOverlay("none"));
  }, []);

  const handleCloseOverlay = () => {
    if (currentOverlay !== "none") {
      console.log("Closing overlay");
      dispatch(updateCurrentOverlay("none"));
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <div
        onClick={handleCloseOverlay}
        className={`flex h-full w-full ${
          currentOverlay !== "none" && "blurcontent"
        }`}
      >
        {children}
      </div>
      {currentOverlay == "friends" && (
        <div
          className="rounded-2xl p-2 bg-slate-100 border border-gray-300 border-2 rounded"
          style={{
            position: "absolute",
            top: 60,
            right: 0,
            bottom: 0,
            width: 300,
            zIndex: 999,
            transition: "transform 0.3s ease-in-out",
            transform:
              currentOverlay == "friends"
                ? "translateX(0)"
                : "translateX(100%)",
          }}
        >
          <FriendsSidebar
            onClick={() => dispatch(updateCurrentOverlay("none"))}
          />
        </div>
      )}

      {/**Add Product Overlay */}
      {currentOverlay == "addProduct" && (
        <div
          style={{ zIndex: 999, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          {" "}
          <div onClick={handleCloseOverlay} className="flex-1 h-screen"></div>
          <AddProductOverlay />
          <div onClick={handleCloseOverlay} className="flex-1 h-screen"></div>
        </div>
      )}

      {/**Add Event Overlay*/}
      {currentOverlay == "addEvent" && (
        <div
          style={{ zIndex: 999, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          <div onClick={handleCloseOverlay} className="flex-1 h-screen"></div>
          <AddEventOverlay />
          <div onClick={handleCloseOverlay} className="flex-1 h-screen"></div>
        </div>
      )}

      {/**Profile Overlay*/}
      {currentOverlay == "profile" && (
        <div
          style={{ zIndex: 999, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          <div onClick={handleCloseOverlay} className="flex-1 h-screen"></div>
          <ProfileOverlay />
          <div onClick={handleCloseOverlay} className="flex-1 h-screen"></div>
        </div>
      )}
    </div>
  );
}
