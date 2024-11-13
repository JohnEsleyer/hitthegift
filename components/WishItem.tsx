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

  // Wrapper component to enable/disable link functionality of WishItem
  function EnableAnchor({
    enable,
    children,
  }: {
    children: ReactNode;
    enable: boolean;
  }): ReactNode {
    if (enable) {
      
      // Extract the ASIN from the product URL
      const asin = extractASIN(product.productUrl);

      const affliateLink = `https://www.amazon.com/dp/${asin}/?tag=${process.env.NEXT_PUBLIC_AFFILIATE_ID}`;
    
      return (
        <a href={affliateLink} target={"_blank"}>
          {children}
        </a>
      );
    }
    return <div>{children}</div>;
  }

  function EnableEdit({
    enable,
    children,
  }: {
    enable: boolean;
    children: ReactNode;
  }) {
    if (enable) {
      return (
        <button
          onClick={() => {
            dispatch(updateCurrentPopup("editProduct"));
            dispatch(
              updateEditProductAll({
                id: product.id,
                userId: "",
                price: product.price,
                currency: product.currency,
                title: product.title,
                productUrl: product.productUrl,
                imageUrl: product.imageUrl,
                description: product.description,
              })
            );
          }}
        >
          {children}
        </button>
      );
    }
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <EnableEdit enable={owner || false}>
        <div
          style={{ width: 200 }}
          className={` p-4 rounded-xl border border-b-4 shadow-xl border-slate-300 bg-white ${
            !isSidebarOpen && "hover:scale-100"
          }`}
        >
          <div className="relative">
            {product.imageUrl == "" ? (
              <EmptyItem width={165} height={150} />
            ) : (
              <div
                style={{ height: 150 }}
                className="flex justify-center border rounded-2xl"
              >
                <img src={product.imageUrl} alt={product.imageUrl} />
              </div>
            )}
          </div>
          <p
            style={{fontSize:14}}
            className="line-clamp-3 h-16 mt-2"
          >
            {product.title}
          </p>
          <p className="font-bold">
            {currencySymbolMap[product.currency]}{product.price} {product.currency}
          </p>
          <p className="line-clamp-6 text-xs mt-2 h-24 ">{product.description}</p>
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
        {owner && (
          <EnableAnchor enable={!isSidebarOpen}>
            <div style={{ top: 130, right: 10 }} className="absolute flex">
              <div className="bg-amber-500 rounded-2xl p-2 shadow-md">
                <ShoppingCart size={20} />
              </div>
            </div>
          </EnableAnchor>
        )}
      </EnableEdit>
    </div>
  );
}
