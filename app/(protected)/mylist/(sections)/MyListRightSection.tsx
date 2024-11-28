"use client";

import { useEffect, useState, useTransition } from "react";

import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import WishItem from "../../../../components/WishItem";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import bluearrowcircle from "/public/bluearrowcircle.svg";
import blackxcircle from "/public/blackxcircle.svg";
import Image from "next/image";
import { sendFriendRequest } from "@/app/actions/user/sendFriendRequest";
import loading from '/public/loading.svg';

export default function MyListRightSection() {
  const dispatch = useDispatch();

  // const [isProductsPending, startProductsTransition] = useTransition();
  const [isClientMounted, setIsClientMounted] = useState(false);
  const products = useSelector((state: RootState) => state.mylist.products);
  const [showShareInput, setShowShareInput] = useState(false);
  const [shareInput, setShareInput] = useState("");
  const { width, height } = useWindowSize();
  const [sendPending, startSendTransition] = useTransition();
  const userId = useSelector((state: RootState) => state.userData.id);
  const [isEmptyShareInput, setIsEmptyShareInput] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);


  const handleShareList = async () => {
    setIsEmptyShareInput(false);
    if (shareInput !== "") {
      startSendTransition(async () => {
        try {
          await sendFriendRequest(userId, shareInput);
        } catch (e) {
          console.log(e);
        }
        dispatch(updateCurrentPopup('sendWishlist'))
        setShareInput('');
      });
      
    }else{
      setIsEmptyShareInput(true);
    }
    
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div
        style={{ height: 75, marginTop: 20 }}
        className="ml-8 flex items-end pb-4 gap-2"
      >
        {/**Buttons*/}
        <button
          className="text-xs text-white rounded-full flex bg-[#047afe] text-white "
          style={{ padding: 4, paddingLeft: 30, paddingRight: 30 }}
          onClick={() => {
            dispatch(updateCurrentPopup("addProduct"));
          }}
        >
          Add Product
        </button>
        <button
          className="text-xs text-white rounded-full flex bg-[#047afe] text-white "
          style={{ padding: 4, paddingLeft: 30, paddingRight: 30 }}
          onClick={() => {
            setShowShareInput(true);
          }}
        >
          Share list
        </button>
        {showShareInput && <div className="flex">
          <input
            type="text"
            placeholder="name@email.com"
            className={`border ${isEmptyShareInput ? 'border-red-500' : 'border-gray-400'} rounded-full shadow-md border-b-2`}
            value={shareInput}
            style={{ width: 212, fontSize: 14, paddingLeft: 10 }}
            onChange={(e) => {
              setIsEmptyShareInput(false);
              setShareInput(e.target.value);
            }}
          />
          <div className="flex pl-2 gap-2 ">
          {sendPending ? <Image src={loading} alt="loading" width={20} height={20} /> :<button onClick={() => {handleShareList()}}>
          <Image src={bluearrowcircle} alt="bluearrowcircle" width={20} height={20}/> 
          </button>}
          <button onClick={() => setShowShareInput(false)}>
          <Image src={blackxcircle} alt="blackxcircle" width={20} height={20}/> 
          </button>
          </div>
        </div>}
      </div>

      <div className="w-full ml-8 mb-2 pl-2 flex-1 overflow-auto">
        {/**Body */}
        <div
          style={{ position: "relative", width: width - 420 }}
          className="h-full hide-scrollbar"
        >
          <div className=" pt-4">
            <div>
              {isClientMounted && (
                <div>
                  {products ? (
                    <div className="p-2 w-full flex flex-wrap gap-8 h-full">
                      {products.map((product) => (
                        <WishItem
                          key={product.id}
                          product={product}
                          owner={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{ height: 400 }}
                      className="text-gray-400 flex justify-center items-center "
                    >
                      You have no items
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
