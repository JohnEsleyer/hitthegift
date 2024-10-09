"use client";

import getAllFriends from "@/app/actions/user/getAllFriends";
import { RootState } from "@/lib/store";
import { Friend } from "@/lib/types/friend";
import Avvvatars from "avvvatars-react";
import { Search, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";



interface FriendsSidebarProps {
  onClick: () => void;
}

export default function FriendsSidebar({ onClick }: FriendsSidebarProps) {
  const [isPending, startTransition] = useTransition();
  const userId = useSelector((state: RootState) => state.userData.id);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    startTransition(async () => {
      console.log(`id sent to server: ${userId}`);
      const results = await getAllFriends(userId);
      console.log(`status: ${results?.status}`);
      if (results) {
        setFriends(results.friends || []);
      }
    });
  }, []);

  return (
    <div>

      <div className="flex items-center rounded-xl p-2 bg-white w-fulls">
        <input type="text" style={{ width: 230 }} placeholder="Search friend" />
        <Search style={{ width: 26, height: 20, strokeWidth: 3 }} />
      </div>
      {/**Friends Section */}
      {isPending ? <div>Loading...</div> :
      <div>
        
        {friends.map((friend) => (
        <div key={friend.id} className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2  flex justify-between ">
          <div className="flex items-center gap-2 "><div className="flex justify-center items-center w-12 h-12 bg-blue-400 rounded-full">
            <Avvvatars size={48} value={friend.firstName}  />
          </div>
          <span>{friend.firstName}</span>
          </div> 
          <button className="flex items-center hover:text-red-600" onClick={() => {

          }}>
            <X/>
          </button>
        </div>    
        ))}
      </div>}
    </div>
  );
}
