"use client";

import { updateEditProductAll } from "@/lib/features/editProductsPopup";
import { updateCurrentPopup } from "@/lib/features/popups";
import { Edit, Link, Pencil, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";

interface WishItemProps {
  id: string;
  title: string;
  price: string;
  description: string;
  currency: string;
  productUrl: string;
  imageUrl: string;
  showBuyButton?: boolean;
  owner?: boolean;
}

export default function WishItem({
  id,
  title,
  price,
  description,
  currency,
  productUrl,
  imageUrl,
  showBuyButton,
  owner,
}: WishItemProps) {

  const dispatch = useDispatch();

  return (
    <div
      style={{ width: 200 }}
      className={` p-4 rounded-xl border border-slate-300`}
    >
      <div className="relative">
      {imageUrl == '' ? <div style={{ height: 150 }} className=" w-full bg-slate-300">
        </div> : <div style={{height: 150}} className="flex justify-center border rounded-2xl"><img src={imageUrl} /></div>}
      {owner  && <div style={{bottom:-3, right: -9}} className="absolute flex">
        <button onClick={() => {
          dispatch(updateCurrentPopup('editProduct'))
          dispatch(updateEditProductAll({
            id: id,
            userId: '',
            price: price,
            currency: currency,
            title: title,
            productUrl: productUrl,
            imageUrl: imageUrl,
            description: description,
          }))
        }} className="hover:bg-gray-200 bg-white rounded-2xl p-2 border shadow-md"><Edit size={20}/></button>
        <a href={productUrl} target={"_blank"}  className="hover:bg-gray-200  bg-white rounded-2xl shadow-md border p-2">
      <Link size={20}/>
      </a>
      </div>}
      </div>
      <p style={{fontSize: 12}} className="line-clamp-3 h-16 flex justisfy-center mt-2">{title}</p>
      <p className="font-bold">${price}</p>
      <p className="line-clamp-6 text-xs mt-2 h-24 ">{description}</p>
      <div className="flex justify-center items-center">
      {showBuyButton && <a href={productUrl} target={"_blank"} className="bg-blue-500 text-white p-2 pl-4 pr-4 rounded-2xl mt-2">
        Buy
      </a>}
      </div>
    </div>
  );
}
