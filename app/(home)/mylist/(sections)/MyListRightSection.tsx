"use client";

import { useState } from "react";
import AddEventPopUp from "../(components)/AddEventOverlay";
import AddProductPopUp from "../(components)/AddProductOverlay";
import Image from "next/image";
import Friends from "/public/friends.png";
import { useDispatch } from "react-redux";
import { updateCurrentOverlay } from "@/lib/features/overlays";

export default function HomeRightSection() {

  const dispatch = useDispatch();

  const WishItem = () => {
    return (
      <div style={{width: 200}} className="p-4 rounded-xl border border-slate-300">
        <div style={{height: 150}} className=" w-full bg-slate-300"></div>
        <p className="flex justisfy-center mt-2">
            Product Name
        </p>
        <p className="font-bold">
            Price
        </p>
        <p className="text-xs mt-2 h-24">
            Description
        </p>
      </div>
    );
  };

  return (
    <div className="pl-8 w-full h-full">
    
      {/**Buttons*/}
      <div className="mt-12 flex gap-2">
        <button
          className="bg-blue-500 text-white pl-2 pr-2 rounded-full"
          onClick={() => {
            dispatch(updateCurrentOverlay('addProduct'));
          }}
        >
          Add Product
        </button>
        <button className="bg-blue-500 text-white pl-2 pr-2 rounded-full">
          Share list
        </button>
      </div>
      {/**Body */}
      <div style={{position: 'relative'}}>
      <div 
        style={{
            position: 'absolute',
            top: 0,
            maxWidth: 1000, 
        }} 
        className=" mt-4 pt-4 flex flex-wrap gap-8 h-full">
        <WishItem />
        <WishItem />
        <WishItem />
        <WishItem />
        <WishItem />
        <WishItem />
        <WishItem />
        <WishItem />
        <WishItem />
        <WishItem />
        <WishItem />
        <WishItem />
        <WishItem />
        <WishItem />
      </div>
      <div
        className="flex justify-end items-center"
        style={{
          position: "absolute",
          top: 270,
          right: 9,
          bottom: 0,
          width: 90,
          zIndex: 90,
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
    </div>
  );
}
