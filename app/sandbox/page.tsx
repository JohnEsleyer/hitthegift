"use client";

import Avvvatars from "avvvatars-react";
import { Search } from "lucide-react";
import { ReactNode, useState } from "react";
import Image from "next/image";
import Friends from "/public/friends.png";
import { Overlay } from "@radix-ui/react-alert-dialog";
import TempSidebar from "./temp/tempSidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { updateCurrentOverlay } from "@/lib/features/overlays";
import AddProductOverlay from "../(home)/mylist/(components)/AddProductOverlay";
import AddEventOverlay from "../(home)/mylist/(components)/AddEventOverlay";

interface OverlayPageProps {
  children: ReactNode;
}

export function OverlayPage({ children }: OverlayPageProps) {
  const currentOverlay = useSelector(
    (state: RootState) => state.overlays.currentOverlay
  );
  const dispatch = useDispatch();

  return (
    <div className="flex h-screen w-screen">
      <div
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
          <TempSidebar onClick={() => dispatch(updateCurrentOverlay("none"))} />
        </div>
      )}

      {/**Add Product Overlay */}
      {currentOverlay == "addProduct" && (
        <div
          style={{ zIndex: 100, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          <AddProductOverlay
            setShowAddProductUI={() => {
              dispatch(updateCurrentOverlay("addProduct"));
            }}
          />
        </div>
      )}

      {/**Add Event Overlay*/}
      {currentOverlay == "addEvent" && (
        <div
          style={{ zIndex: 100, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          <AddEventOverlay />
        </div>
      )}
    </div>
  );
}

export default function Sandbox() {
  // const [currentPage, setCurrentpage] = useState('friends');
  const currentOverlay = useSelector(
    (state: RootState) => state.overlays.currentOverlay
  );
  const dispatch = useDispatch();

  return (
    <div>
      <OverlayPage>
        <div className="flex flex-col justify-center items-center w-screen h-screen bg-green-300">
          This is the body
          <p>Current: {currentOverlay}</p>
          <button
            onClick={() => {
              dispatch(updateCurrentOverlay("addEvent"));
            }}
            className="underline"
          >
            Show add event{" "}
          </button>
          <button
            onClick={() => {
              dispatch(updateCurrentOverlay("addProduct"));
            }}
            className="underline"
          >
            Show add product{" "}
          </button>
          <div
            className="flex justify-end items-center"
            style={{
              position: "absolute",
              top: 60,
              right: 0,
              bottom: 0,
              width: 90,
              zIndex: 999,
            }}
          >
            <div className=" text-white flex justify-end">
              <button
                className="bg-blue-500 p-2 border border-blue-500 rounded-2xl rounded-r-lg "
                onClick={() => {
                  dispatch(updateCurrentOverlay("friends"));
                }}
              >
                <Image alt="" width={30} src={Friends} />
              </button>
            </div>
          </div>
        </div>
      </OverlayPage>
    </div>
  );
}
