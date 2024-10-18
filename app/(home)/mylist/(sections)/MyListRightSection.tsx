"use client";

import { startTransition, useEffect, useState, useTransition } from "react";

import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { getUserProducts } from "@/app/actions/products/getUserProducts";
import WishItem from "../../../../components/WishItem";
import WishItemSkeleton from "@/components/skeletons/WishItemSkeleton";
import { CircleX, Send } from "lucide-react";
import addFriend from "@/app/actions/user/addFriend";
import { updateMyListProducts } from "@/lib/features/mylist";
import { sendFriendRequest } from "@/app/actions/user/sendFriendRequest";

export default function MyListRightSection() {
  const dispatch = useDispatch();

  const [isProductsPending, startProductsTransition] = useTransition();

  const [showShareInput, setShowShareInput] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [isSending, startSendTransition] = useTransition();
  const [isClientMounted, setIsClientMounted] = useState(false);

  const userId = useSelector((state: RootState) => state.userData.id);
  const products = useSelector((state: RootState) => state.mylist.products);



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

  const handleShareList = async () => {
    setFriendEmail("");
    startSendTransition(async () => {
      try {
        await sendFriendRequest(userId, friendEmail);
      } catch (e) {
        console.log(e);
      }
    });
  };

  return (
    <div className="pl-8 w-full h-full">
      <div className="mt-12 flex justify-between items-center">
        {/**Buttons*/}
        <div className="h-4 flex gap-2 items-center ">
          <button
            className="bg-blue-500 text-white pl-2 pr-2 rounded-full"
            onClick={() => {
              dispatch(updateCurrentPopup("addProduct"));
            }}
          >
            Add Product
          </button>
          <button
            className="bg-blue-500 text-white pl-2 pr-2 rounded-full"
            onClick={() => {
              setShowShareInput(true);
            }}
          >
            Share list
          </button>
          {showShareInput && (
            <div className="flex">
              <input
                style={{ width: 160 }}
                className="rounded border p-2 text-xs"
                placeholder="friendname@email.com"
                value={friendEmail}
                onChange={(e) => {
                  setFriendEmail(e.target.value);
                }}
              ></input>
              {isSending ? (
                <div className="text-xs flex items-center justify-center p-2">
                  Sent
                </div>
              ) : (
                <button onClick={handleShareList} className="p-1">
                  <Send color={"#0088d6"} />
                </button>
              )}
              <button
                onClick={() => {
                  setShowShareInput(false);
                }}
                className="p-1"
              >
                <CircleX />
              </button>
            </div>
          )}
        </div>
      </div>
      {/**Body */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            maxWidth: 1000,
          }}
          className=" mt-4 pt-4"
        >
          {isProductsPending ? (
            <div className="flex flex-wrap gap-8 h-full">
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
                    <div className="flex flex-wrap gap-8 h-full">
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
                    <div className="text-gray-400 flex justify-center items-center ">
                      You have no products
                    </div>
                  )}
                </div>
              }
            </div>
          )}
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
        ></div>
      </div>
    </div>
  );
}
