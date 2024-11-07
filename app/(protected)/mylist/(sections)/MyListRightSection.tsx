"use client";

import { startTransition, useEffect, useState, useTransition } from "react";

import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { getUserProducts } from "@/app/actions/products/getUserProducts";
import WishItem from "../../../../components/WishItem";
import WishItemSkeleton from "@/components/skeletons/WishItemSkeleton";
import { CircleX, Gift, Send, UserPlus } from "lucide-react";
import addFriend from "@/app/actions/user/addFriend";
import { updateMyListProducts } from "@/lib/features/mylist";
import { sendFriendRequest } from "@/app/actions/user/sendFriendRequest";
import { useWindowSize } from "@/utils/hooks/useWindowSize";


export default function MyListRightSection() {
  const dispatch = useDispatch();

  const [isProductsPending, startProductsTransition] = useTransition();
  const [isClientMounted, setIsClientMounted] = useState(false);
  const userId = useSelector((state: RootState) => state.userData.id);
  const products = useSelector((state: RootState) => state.mylist.products);

  const {width, height} = useWindowSize();

  useEffect(() => {
    setIsClientMounted(true);
    startProductsTransition(async () => {
      const results = await getUserProducts(userId);
      console.log(`status: ${results.message}`);
      if (results) {
        // setProducts(results.data || []);
        dispatch(updateMyListProducts(results.data || []));
      }
    });
  }, []);

 
  return (
    <div className="w-full h-screen flex flex-col">
    
      <div style={{height:75}} className="ml-8 flex items-end pb-4 gap-2 ">
        {/**Buttons*/}
        <button
            className="text-white p-2 rounded-full flex bg-black text-white font-bold py-2 px-4 hover:from-blue-500 hover:to-purple-500 transition duration-300"
            onClick={() => {
              dispatch(updateCurrentPopup("addProduct"));
            }}
          >
            <Gift/>
            Add Product
          </button>
          <button
            className="text-white p-2 rounded-full flex  bg-black text-white font-bold py-2 px-4 hover:from-blue-500 hover:to-purple-500 transition duration-300"
            onClick={() => {
              dispatch(updateCurrentPopup('shareWishlist'));
            }}
          >
            <UserPlus />
            Share list
          </button>
      </div>
      <div className="w-full ml-8 mb-2 pl-2 flex-1 overflow-auto rounded-2xl border-2 border-black bg-[#dbe4e7]">
            {/**Body */}
      <div style={{ position: "relative", width: width - 420}} className="h-full hide-scrollbar">
        <div
          className=" pt-4"
        >
          {isProductsPending ? (
            <div className="pl-4 flex flex-wrap gap-8">
              <WishItemSkeleton />
              <WishItemSkeleton />
              <WishItemSkeleton />
              <WishItemSkeleton />
              <WishItemSkeleton />
              <WishItemSkeleton />
            </div>
          ) : (
            <div>
              {
                isClientMounted && <div>
                  {products.length > 0 ? (
                    <div className="p-2 w-full flex flex-wrap gap-8 h-full">
                      {products.map((product) => (
                        <WishItem
                          key={product.id}
                          id={product.id}
                          title={product.title}
                          imageUrl={product.imageUrl}
                          description={product.description}
                          price={product.price}
                          currency={product.currency}
                          productUrl={product.productUrl}
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
          )}
        </div>
      </div>
      </div>
    </div>
  );
}


