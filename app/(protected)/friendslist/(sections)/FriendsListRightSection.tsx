"use client";

import { RootState } from "@/lib/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FriendsWishItem from "../(components)/FriendsWishItem";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import { FriendWithProducts } from "@/lib/types/friend";
import Image from "next/image";
import searchIcon from "/public/searchIcon.svg";

export default function FriendsListRightSection() {
  const friendsProducts = useSelector(
    (state: RootState) => state.friendsListPage.friendsWithProducts
  );
  const { width, height } = useWindowSize();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<
    FriendWithProducts[]
  >([]);

  useEffect(() => {
    setFilteredProducts((prev) =>
      friendsProducts.filter((friend) =>
        friend.friendFirstName
          .toLocaleLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div className="ml-8 h-screen">
      {/**Search bar */}
      <div style={{ position: "relative", width: 250 }}>
        <input
          style={{
            height: 40,
            marginTop: 20,
            marginBottom: 15,
            paddingRight: 60, // Add padding to accommodate the icon
          }}
          className="p-4 w-full rounded-xl border border-gray-300"
          placeholder={`Friend's name`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 10,
            paddingTop: 2,
            transform: "translateY(-50%)",
          }}
        >
          <Image src={searchIcon} alt="searchIcon" width={40} height={40} />
        </div>
      </div>
      <div
        style={{ height: height - 75, width: width - 400 }}
        className="hide-scrollbar pt-4 flex flex-wrap gap-2 overflow-auto  p-2"
      >
        <div className="pl-2 w-full h-full">
          {filteredProducts.length > 0 ? (
            <div className="flex flex-wrap gap-6 justify-start">
              {filteredProducts.map((product, friendIndex) => (
                <FriendsWishItem
                  key={product.friendId}
                  friendProduct={product}
                />
              ))}
            </div>
          ) : (
            <div
              style={{ height: 400 }}
              className="text-gray-400 flex justify-center items-center "
            >
              <p>No friends products to show</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
