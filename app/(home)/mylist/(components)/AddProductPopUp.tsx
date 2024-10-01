'use client'
import { Calendar } from "@/components/ui/calendar";
import { Dispatch, SetStateAction, useState } from "react";

interface AddProductProps{
    setShowAddProductUI: Dispatch<SetStateAction<boolean>>;
}


export default function AddEventPopUp({
    setShowAddProductUI, 
}: AddProductProps){
  

    return (
        <div style={{width: 500, height: 630}} className=" p-4 bg-gray-100 rounded-2xl border-2 border-black">

         {/*Image of the Product */}
         <div className="flex justify-center ">
         <div className=" w-32 h-44 bg-gray-300">
            </div>
        </div>
        
        {/*Title input */}
        <div className="mt-4 flex justify-center "> 
        <div>
            <p>Title</p>
            <input
                className="rounded-full p-2 pl-4" 
                placeholder={"Product name"}
            />
        </div>
        </div>
        {/*Link input */} 
        <div className="mt-4 flex justify-center ">
        <div>
            <p>Link</p>
            <input
                className="rounded-full p-2 pl-4" 
                placeholder={"Product name"}
            />
        </div>
        </div>

        {/** Auto picture and description */}
        <div className="mt-4 flex justify-center">
        <div className="flex justify-between">
            <div className="flex flex-col">
            <p>Picture and description auto</p>
            <p className="text-gray-500">Fill description and image automatically</p>
            </div>
            <label className="switch">
              <input type="checkbox" onChange={(e) => {
               
              }}/>
              
              <span className="slider round"></span>
              </label>
        </div>
        </div>

        {/* Description  */}
        <div className="mt-4 pb-8 flex justify-center">
        <div style={{width: 250}}>
            <p>Description</p>
            <textarea
                className="w-full h-full"
            />
        </div>
        </div>

        {/*Buttons */}
        <div className="mt-4  flex justify-center gap-8">
          <button className="bg-blue-500 rounded-2xl pl-12 pr-12  text-white">Add product</button>
          <button 
            className="bg-black rounded-2xl pl-12 pr-12  text-white"
            onClick={() => {
              setShowAddProductUI(false);
            }}
            >
            Cancel
          </button>
        </div>

     </div>
    )
}