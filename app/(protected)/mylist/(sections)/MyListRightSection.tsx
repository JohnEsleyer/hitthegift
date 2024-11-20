"use client";

import { useEffect, useState, useTransition } from "react";

import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { getUserProducts } from "@/app/actions/products/getUserProducts";
import WishItem from "../../../../components/WishItem";
import WishItemSkeleton from "@/components/skeletons/WishItemSkeleton";
import { Gift, UserPlus } from "lucide-react";

import { updateMyListProducts } from "@/lib/features/mylist";
import { useWindowSize } from "@/utils/hooks/useWindowSize";

export default function MyListRightSection() {
  const dispatch = useDispatch();

  // const [isProductsPending, startProductsTransition] = useTransition();
  const [isClientMounted, setIsClientMounted] = useState(false);
  const userId = useSelector((state: RootState) => state.userData.id);
  const products = useSelector((state: RootState) => state.mylist.products);

  const {width, height} = useWindowSize();

  useEffect(() => {
    setIsClientMounted(true);

  }, []);

 
  return (
    <div className="w-full h-screen flex flex-col">
      <div style={{height:75, marginTop: 40}} className="ml-8 flex items-end pb-4 gap-2">
        {/**Buttons*/}
        <button
            className="text-xs text-white rounded-full flex bg-[#047afe] text-white "
            style={{padding: 4, paddingLeft: 30, paddingRight: 30}}
            onClick={() => {
              dispatch(updateCurrentPopup("addProduct"));
            }}
          >
            Add Product
          </button>
          <button
            className="text-xs text-white rounded-full flex bg-[#047afe] text-white "
            style={{padding: 4, paddingLeft: 30, paddingRight: 30}}
            onClick={() => {
              dispatch(updateCurrentPopup('shareWishlist'));
            }}
          >
            Share list
          </button>
      </div>
      <div className="w-full ml-8 mb-2 pl-2 flex-1 overflow-auto">
            {/**Body */}
      <div style={{ position: "relative", width: width - 420}} className="h-full hide-scrollbar">
        <div
          className=" pt-4"
        >

            <div>
              {
                isClientMounted && <div>
                  {products.length > 0 ? (
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
                    <div style={{height: 400}} className="text-gray-400 flex justify-center items-center ">
                      You have no items
                    </div>
                  )}
                </div>
              }
            </div>
        </div>
      </div>
      </div>
    </div>
  );
}
