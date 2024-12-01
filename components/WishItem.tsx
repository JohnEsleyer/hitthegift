"use client";

import { RootState } from "@/lib/store";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductType } from "@/lib/types/products";
import { extractASIN } from "@/app/(protected)/mylist/(components)/(products-popups)/functions";
import Link from "next/link";
import Image from "next/image";
import emptyItem from "/public/emptyItem.png";
import LimitText from "./ui/LimitText";
import { Edit } from "lucide-react";
import { updateCurrentPopup } from "@/lib/features/popups";
import { updateEditProductAll } from "@/lib/features/editProductsPopup";
import { isAmazonUrl } from "@/utils/isAmazonUrl";
import { formatPriceWithCurrency } from "@/utils/getCurrencySymbol";
import { getAmazonDomain } from "@/utils/getAmazonDomain";

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
  // Used to disable the click function of wish items when friends sidebar is showing
  const isSidebarOpen = useSelector(
    (state: RootState) => state.friendsSidebar.isSidebarOpen
  );
  const dispatch = useDispatch();

  function getProductPrice(product: ProductType){
    if (product.productUrl !== null){
      return formatPriceWithCurrency(getAmazonDomain(product.productUrl) || '' , product.price) 
    }
    return '';
  }

  function AffiliateLink({ children }: { children: ReactNode }) {
    // Only enable link if sidebar is not open
    if (!isSidebarOpen) {
      
      if (isAmazonUrl(product.productUrl)){
         // Extract the ASIN from the product URL
      const asin = extractASIN(product.productUrl);
      const affiliateLink = `https://www.amazon.com/dp/${asin}/?tag=${process.env.NEXT_PUBLIC_AFFILIATE_ID}`;

      return (
        <Link href={affiliateLink} target="_blank">
          {children}
        </Link>
      );
      }else{
        
      return (
        <Link href={product.productUrl} target="_blank">
          {children}
        </Link>
      );
      }
     
    }
    return <div>{children}</div>;
  }

  return (
    <div className="relative">
      <AffiliateLink>
        <div
          style={{ width: 167, height: owner ? 329 : 345, borderRadius: 5 }}
          className={`p-2 border border-[#d9d9d9] bg-white ${
            !isSidebarOpen && "hover:scale-100"
          }`}
        >
          <div className="relative">
            {product.imageUrl == "" ? (
              // <EmptyItem width={165} height={150} />
              <Image
                className="bg-[#E3E3E3]"
                alt=""
                src={emptyItem}
                width={165}
                height={150}
              />
            ) : (
              <div
                style={{ height: 150 }}
                className="flex justify-center border rounded-2xl"
              >
                <img src={product.imageUrl} alt={product.imageUrl} />
              </div>
            )}
          </div>
          <div style={{ height: 50, paddingTop: 10 }}>
            <LimitText text={product.title} fontSize={12} length={40} />
          </div>
          <p style={{height: 25}} className="font-bold text-xs">
            {getProductPrice(product)}
          </p>
          <div style={{ height: 60 }}>
            <LimitText
              text={product.description}
              fontSize={12}
              length={100}
              color={"text-gray-600"}
            />
          </div>
          <div className="flex justify-center items-center">
            {showBuyButton && (
              <a
                href={product.productUrl}
                target={"_blank"}
                style={{ width: 125 }}
                className="bg-blue-600 text-white p-2 pl-6 pr-6 rounded-full mt-2 text-xs flex justify-center"
              >
                Buy
              </a>
            )}
          </div>
        </div>
      </AffiliateLink>
      {owner && (
          <div style={{ top: 130, right: 10 }} className="absolute flex">
            <button
              className="bg-white hover:bg-gray-300 rounded-2xl p-2 shadow-md"
              onClick={() => {
                dispatch(updateCurrentPopup("editProduct"));
                dispatch(updateEditProductAll(product));
              }}
            >
              <Edit size={20} />
            </button>
          </div>
        )}
    </div>
  );
}
