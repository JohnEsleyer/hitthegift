'use client'

import { useState } from "react";
import AddEventPopUp from "../(components)/AddEventPopUp";
import AddProductPopUp from "../(components)/AddProductPopUp";


export default function HomeRightSection(){
    
    const [showAddProductUI, setShowAddProductUI] = useState(false);
    
    const WishItem = () => {
        return (
            <div className="p-2 rounded border border-slate-300 w-32">
                <div className="h-40 bg-slate-300">
                    
                </div>
                <span className="text-xs flex justify-center mt-2">Ruben{"'s"} wishlist</span>
            </div>
        )
    }
    
    
    return (
        <div className="w-full h-full">
               {/*Terms and conditions */}
        {showAddProductUI && <div 
        style={{zIndex: 100, position: 'absolute'}}
        className=" flex justify-center items-center w-screen h-screen"
        >
            <AddProductPopUp setShowAddProductUI={setShowAddProductUI}/>
           
      </div>}
            {/**Buttons*/}
            <div className="mt-12 flex gap-2">
                <button 
                    className="bg-blue-500 text-white pl-2 pr-2 rounded-full"
                    onClick={() => {
                        setShowAddProductUI(true);
                    }}
                    >
                    Add Product
                </button>
                <button className="bg-blue-500 text-white pl-2 pr-2 rounded-full">Share list</button>
            </div>
            {/**Body */}
            <div className="mt-4 pt-4 flex flex-wrap gap-2 h-full">
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                    <WishItem/>
                </div>
        </div>
    );
}
