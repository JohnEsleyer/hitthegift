'use client'

import findOrCreateConversation from "@/app/actions/chat/findOrCreateConversation";
import { updateFriendId } from "@/lib/features/insideFriend";
import { RootState } from "@/lib/store";
import { ProductType } from "@/lib/types/products";
import Avvvatars from "avvvatars-react";
import { useDispatch, useSelector } from "react-redux";

interface FriendsProducts {
    friendId: string;
    friendFirstName: string;
    friendImageURL: string;
    products: ProductType[];
}

interface FriendWishItemProps {
    friendProduct: FriendsProducts;
}

export default function FriendsWishItem({friendProduct} : FriendWishItemProps){
    const dispatch = useDispatch();


    const handleClick = () => {
        
        dispatch(updateFriendId(friendProduct.friendId));
        
    }

    return (
        <a href={'/insidefriend'} onClick={handleClick}>
        <div
            style={{width: 200}}
            className="p-4 rounded-xl border border-slate-300">
            <div style={{height: 150}} className=" bg-slate-300">
            </div>
            <span className="text-xs flex justify-center mt-2">{friendProduct.friendFirstName}{"'s"} wish list</span>
            <div className="flex justify-center ">
                <Avvvatars value={friendProduct.friendFirstName} />
            </div>

        </div></a>
    )
}