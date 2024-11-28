"use client";

import WishItem from "@/components/WishItem";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import '@/styles/utilities.css';

export default function InsideFriendRightSection() {

  const friendData = useSelector((state: RootState) => state.insideFriend.friendData);
  const products = useSelector((state: RootState) => state.insideFriend.products);
  const {width, height} = useWindowSize();

  return (
    <div className="w-full">
      <div style={{ marginLeft: 30,marginTop: 74, height: height-80, width: width-400}}  className=" hide-scrollbar overflow-auto p-2 mb-4">
          <div>
          {products.length > 0 ? <div className="pl-2 pt-2 flex flex-wrap gap-2">
            {products.map((product) => (
              <WishItem
                key={product.id}
                product={product}
                showBuyButton={true}
                
              />
            ))}
          </div> : <div style={{height: 400}} className="w-full flex justify-center items-center text-gray-400">
              {friendData?.firstName} has no wish items
            </div>}
          </div>
      </div>
    </div>
  );
}
