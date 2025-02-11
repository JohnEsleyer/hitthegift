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
import { formatPriceWithCurrency, getCurrencySymbol } from "@/utils/getCurrencySymbol";
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
  const isSidebarOpen = useSelector(
    (state: RootState) => state.friendsSidebar.isSidebarOpen
  );
  const dispatch = useDispatch();

  function getProductPrice(product: ProductType) {
    if (product.productUrl !== null && isAmazonUrl(product.productUrl)) {
      return formatPriceWithCurrency(
        getAmazonDomain(product.productUrl) || "",
        product.price
      );
    }
    return `${getCurrencySymbol(product.currency)}${product.price}`;
  }

  function AffiliateLink({ children }: { children: ReactNode }) {
    if (!isSidebarOpen) {
      if (isAmazonUrl(product.productUrl)) {
        const asin = extractASIN(product.productUrl);
        // const affiliateLink = `https://www.amazon.com/dp/${asin}/?tag=${process.env.NEXT_PUBLIC_AFFILIATE_ID}`;

        return (
          <Link href={product.productUrl} target="_blank">
            {children}
          </Link>
        );
      } else {
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
      {owner ? (
        <AffiliateLink>
          <div
            style={{ width: 167, height: 329, borderRadius: 5 }}
            className={`p-2 border border-[#d9d9d9] bg-white ${
              !isSidebarOpen && "hover:scale-100"
            }`}
          >
            {/* Product Image */}
            <div className="relative">
              {product.imageUrl === "" ? (
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

            {/* Product Title */}
            <div style={{ height: 50, paddingTop: 10 }}>
              <LimitText text={product.title} fontSize={12} length={40} />
            </div>

            {/* Product Price */}
            <p style={{ height: 25 }} className="font-bold text-xs">
              {getProductPrice(product)}
            </p>

            {/* Product Description */}
            <div style={{ height: 60 }}>
              <LimitText
                text={product.description}
                fontSize={12}
                length={100}
                color={"text-gray-600"}
              />
            </div>

            {/* Buy Button */}
            {showBuyButton && (
              <div className="flex justify-center items-center">
                <a
                  href={product.productUrl}
                  target="_blank"
                  style={{ width: 125 }}
                  className="bg-blue-600 text-white p-2 pl-6 pr-6 rounded-full mt-2 text-xs flex justify-center"
                >
                  Buy
                </a>
              </div>
            )}
          </div>
        </AffiliateLink>
      ) : (
        <div
          style={{ width: 167, height: 345, borderRadius: 5 }}
          className={`p-2 border border-[#d9d9d9] bg-white ${
            !isSidebarOpen && "hover:scale-100"
          }`}
        >
          {/* Product Image */}
          <div className="relative">
            {product.imageUrl === "" ? (
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

          {/* Product Title */}
          <div style={{ height: 50, paddingTop: 10 }}>
            <LimitText text={product.title} fontSize={12} length={40} />
          </div>

          {/* Product Price */}
          <p style={{ height: 25 }} className="font-bold text-xs">
            {getProductPrice(product)}
          </p>

          {/* Product Description */}
          <div style={{ height: 60 }}>
            <LimitText
              text={product.description}
              fontSize={12}
              length={100}
              color={"text-gray-600"}
            />
          </div>

          {/* Buy Button with Affiliate Link */}
          <AffiliateLink>
            <div className="flex justify-center items-center">
              {showBuyButton && (
                <a
                  href={product.productUrl}
                  target="_blank"
                  style={{ width: 125 }}
                  className="bg-blue-600 text-white p-2 pl-6 pr-6 rounded-full mt-2 text-xs flex justify-center"
                >
                  Buy
                </a>
              )}
            </div>
          </AffiliateLink>
        </div>
      )}

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
