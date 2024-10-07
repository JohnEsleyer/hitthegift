"use client";

import { startTransition, useEffect, useState, useTransition } from "react";
import AddEventPopUp from "../(components)/AddEventOverlay";
import AddProductPopUp from "../(components)/AddProductOverlay";
import Image from "next/image";
import Friends from "/public/friends.png";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentOverlay } from "@/lib/features/overlays";
import { RootState } from "@/lib/store";
import { ProductType } from "@/lib/types/products";
import { getUserProducts } from "@/app/actions/products/getUserProducts";
import WishItem from "../(components)/WishItem";
import Avvvatars from "avvvatars-react";
import { useRouter } from "next/navigation";

export default function HomeRightSection() {
  const dispatch = useDispatch();

  const [isProductsPending, startProductsTransition] = useTransition();
  const userId = useSelector((state: RootState) => state.userData.id);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const router = useRouter();


  useEffect(() => {
    startTransition(async () => {
      const results = await getUserProducts(userId);
      console.log(`status: ${results.message}`);
      if (results) {
        setProducts(results.data || []);
      }
    });
  }, []);

  return (
    <div className="pl-8 w-full h-full">
 
      <div className="mt-12 flex justify-between items-center">
             {/**Buttons*/}
        <div className=" flex gap-2 items-center ">
          <button
            className="bg-blue-500 text-white pl-2 pr-2 rounded-full"
            onClick={() => {
              dispatch(updateCurrentOverlay("addProduct"));
            }}
          >
            Add Product
          </button>
          <button className="bg-blue-500 text-white pl-2 pr-2 rounded-full">
            Share list
          </button>
        </div>
        {/*Button to open up profile section */}
        <div className="p-2 pr-8">
          <button 
            className="relative"
            onClick={() => {
            
            setShowProfileOptions((prev) => !prev);
          }}>
          <Avvvatars value={`profile`}/>
          </button>  
          {showProfileOptions && <ul style={{zIndex: 100, right: 10}} className="flex flex-col gap-2 p-4 absolute bg-white shadow-md">
            <button onClick={() => {
              setShowProfileOptions(false);
              dispatch(updateCurrentOverlay('profile'));
            }}>
              My Profile
            </button>
            <button onClick={() => {
            
              document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              router.push('/login');
            }}>
              Log out
            </button>
          </ul>}
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
          className=" mt-4 pt-4 "
        >
          {isProductsPending ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-wrap gap-8 h-full">
              {products.map((product) => (
                <WishItem
                 key={product.id}
                  productName={product.title}
                  description={product.description}
                  price={"$10.00"}
                />
              ))}
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
