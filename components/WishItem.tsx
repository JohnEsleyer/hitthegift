"use client";

import { updateEditProductAll } from "@/lib/features/editProductsPopup";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { Edit, Link, Pencil, ShoppingCart } from "lucide-react";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmptyItem } from "./EmptyItem";

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
    // Used to disable the click function of wish items when friends sidebar is showing 
    const isSidebarOpen = useSelector((state: RootState) => state.friendsSidebar.isSidebarOpen);

    // Wrapper component to enable/disable link functionality of WishItem
  function EnableAnchor({enable, children} : {children: ReactNode, enable: boolean}): ReactNode {
    if (enable){
      return (
      <a href={productUrl} target={"_blank"}>
        {children}
        </a>)
    }

    return (<div>{children}</div>)
  }

  return (
    <div className="relative">
   <EnableAnchor enable={!isSidebarOpen}>
    <div
      style={{ width: 200 }}
      className={` p-4 rounded-xl border ${!isSidebarOpen && 'hover:bg-gray-200'} border-slate-300`}
    >
      <div className="relative">
      {imageUrl == '' ? <EmptyItem width={165} height={150}/> : <div style={{height: 150}} className="flex justify-center border rounded-2xl"><img src={imageUrl} alt={imageUrl}/></div>}
      
      </div>
      <p style={{fontSize: 12}} className="line-clamp-3 h-16 flex justisfy-center mt-2">{title}</p>
      <p className="font-bold">{price} {currency}</p>
      <p className="line-clamp-6 text-xs mt-2 h-24 ">{description}</p>
      <div className="flex justify-center items-center">
      {showBuyButton && <a href={productUrl} target={"_blank"} className="bg-blue-500 text-white p-2 pl-4 pr-4 rounded-2xl mt-2">
        Buy
      </a>}
      </div>
    </div>
    </EnableAnchor>

    {owner  && <div style={{top:130, right: 10, }} className="absolute flex">
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
       
      </div>}
    </div>
  );
}
