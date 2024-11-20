"use client";

import { updateEditProductAll } from "@/lib/features/editProductsPopup";
import { updateCurrentPopup } from "@/lib/features/popups";
import { RootState } from "@/lib/store";
import { ShoppingCart } from "lucide-react";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EmptyItem } from "./EmptyItem";
import { currencySymbolMap } from "@/utils/currencySymbols";
import { ProductType } from "@/lib/types/products";
import { extractASIN } from "@/app/(protected)/mylist/(components)/(products-popups)/functions";
import Link from "next/link";
import Image from 'next/image';
import emptyItem from '/public/emptyItem.png';
import LimitText from "./ui/LimitText";

interface WishItemProps {
  product: ProductType;
  owner?: boolean;
  showBuyButton?: boolean;
}

export default function WishItem({
  product,
  owner,
  showBuyButton,
}: WishItemProps) {
  const dispatch = useDispatch();
  // Used to disable the click function of wish items when friends sidebar is showing
  const isSidebarOpen = useSelector(
    (state: RootState) => state.friendsSidebar.isSidebarOpen
  );

  function EnableEdit({
    enable,
    children,
  }: {
    enable: boolean;
    children: ReactNode;
  }) {
    if (enable) {
      // Extract the ASIN from the product URL
      const asin = extractASIN(product.productUrl);

      const affiliateLink = `https://www.amazon.com/dp/${asin}/?tag=${process.env.NEXT_PUBLIC_AFFILIATE_ID}`;

      return <Link href={affiliateLink}>{children}</Link>;
    }
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <EnableEdit enable={owner || false}>
        <div
          style={{ width: 167, height: 329, borderRadius: 5}}
          className={`p-2 border border-[#d9d9d9] bg-white ${
            !isSidebarOpen && "hover:scale-100"
          }`}
        >
          <div className="relative">
            {product.imageUrl == "" ? (
              // <EmptyItem width={165} height={150} />
              <Image className="bg-[#E3E3E3]" alt="" src={emptyItem} width={165} height={150}/>
            ) : (
              <div
                style={{ height: 150 }}
                className="flex justify-center border rounded-2xl"
              >
                <img src={product.imageUrl} alt={product.imageUrl} />
              </div>
            )}
          </div>
          <div style={{height: 40, paddingTop: 10}}>
          <LimitText text={product.title} fontSize={12} length={40}/>
          </div>
          <p className="font-bold text-xs">
            {currencySymbolMap[product.currency]}
            {product.price} {product.currency}
          </p>
          <div style={{height:60}}>
          <LimitText text={product.description} fontSize={12} length={100} /> 
          </div>
          <div className="flex justify-center items-center">
            {showBuyButton && (
              <a
                href={product.productUrl}
                target={"_blank"}
                className="bg-blue-600 text-white p-2 pl-6 pr-6 rounded-full mt-2"
              >
                Buy
              </a>
            )}
          </div>
        </div>
      </EnableEdit>
    </div>
  );
}
