'use client'

import { updateCurrentOverlay } from "@/lib/features/overlays";
import { RootState } from "@/lib/store";
import { ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddEventOverlay from "./AddEventOverlay";
import AddProductOverlay from "./AddProductOverlay";
import FriendsSidebar from "./FriendsSidebar";


interface OverlayPageProps{
    children: ReactNode;
}
  
  
  export function OverlayPage({children}: OverlayPageProps){
    
    const currentOverlay = useSelector((state: RootState) => state.overlays.currentOverlay);
    const dispatch = useDispatch();
  
    return (
        <div className="flex h-screen w-screen">
            <div className={`flex h-full w-full ${currentOverlay !== 'none' && 'blurcontent'}`}>
              {children}
            </div>
        {currentOverlay == "friends" &&
        <div 
            className="rounded-2xl p-2 bg-slate-100 border border-gray-300 border-2 rounded"
            style={{
                position: 'absolute',
                top: 60,
                right: 0,
                bottom: 0,
                width: 300,
                zIndex: 999,
                transition: 'transform 0.3s ease-in-out',
                transform: currentOverlay == "friends" ? 'translateX(0)' : 'translateX(100%)',
        }}>
        <FriendsSidebar onClick={() => dispatch(updateCurrentOverlay('none'))}/>
        </div>}
        
        {/**Add Product Overlay */}
        {currentOverlay == "addProduct" && <div 
          style={{zIndex: 100, position: 'absolute'}}
          className=" flex justify-center items-center w-screen h-screen"
          >
              <AddProductOverlay setShowAddProductUI={() => {
                dispatch(updateCurrentOverlay('addProduct'));
              }}/>
             
        </div>}
        
         {/**Add Event Overlay*/}
        {currentOverlay == "addEvent"  && <div 
          style={{zIndex: 100, position: 'absolute'}}
          className=" flex justify-center items-center w-screen h-screen"
          >
            <AddEventOverlay />
        </div>}
           </div>
  
    );
  }
  