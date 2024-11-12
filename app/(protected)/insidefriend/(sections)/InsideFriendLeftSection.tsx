'use client'


import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import getUserInfo from "@/app/actions/user/getUserInfo";
import Avvvatars from "avvvatars-react";
import getAllFriends from "@/app/actions/user/getAllFriends";
import { Friend } from "@/lib/types/friend";
import { updateFriendName } from "@/lib/features/insideFriend";
import { HomeLeftTemplate } from "@/components/HomeLeftTemplate";
import FriendProfileSkeleton from "@/components/skeletons/FriendProfileSkeleton";
import { getProfilePicture } from "@/app/actions/s3/getProfilePicture";
import UserProfileImage from "@/components/UserProfileImage";
import { useWindowSize } from "@/utils/hooks/useWindowSize";

// Selected friend page
export default function InsideFriendLeftSection(){
    const dispatch = useDispatch();

    const friendId = useSelector((state: RootState) => state.insideFriend.friendId);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [hobbiesInfo, setHobbiesInfo] = useState('');
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isFriendsPending, startFriendsTransition] = useTransition();
    const [isPendingUserInfo, startUserInfoTransition] = useTransition();
    const [friendNotFound, setFriendNotFound] = useState(false);
    const {width, height} = useWindowSize();
    
    useEffect(()=>{
        if (!friendId){
            setFriendNotFound(true);
        }

        startUserInfoTransition(async() => {
            const result = await getUserInfo(friendId);
            if (result){
                const fullName = `${result.firstName} ${result.lastName}`;
                setName(fullName);
                setEmail(result.email || '');
                setHobbiesInfo(result.hobbyInfo || '');
                dispatch(updateFriendName(`${result.firstName} ${result.lastName}`));
            }
        });

        startFriendsTransition(async() => {
            const results = await getAllFriends(friendId);
            if (results) {
              setFriends(results.friends || []);
            }
        });

        // Fetch friend's profile image 
        const fetchFriendProfilePicture = async () => {
            const response = await getProfilePicture(friendId);
            if (response.success){
                setProfileImageUrl(response.data || '');
            }
        }
        
        fetchFriendProfilePicture();
    },[]);


    return (
        <HomeLeftTemplate highlight={'friendslist'}>
            <div className="p-2 flex flex-col gap-4 bg-white rounded-2xl shadow-xl m-2 ">
                {isPendingUserInfo ? <FriendProfileSkeleton/> : <div >
                    {/**Friend's profile */}
                    <div className="flex  p-2">
                        <div className="flex items-center">
                            {profileImageUrl == '' ? <Avvvatars size={45} value={name}/> : <div>
                                <img src={profileImageUrl} className="rounded-full " alt="" width={60} height={60}/>
                                </div> }
                        </div>
                       <div className="p-2">
                       <p>{name}</p>
                       <p className="text-xs text-gray-400">{email}</p>
                       </div>
                    </div>
                    <span className="text-xl font-bold">Interests and hobbies</span>
                    <div style={{height: 120, width: 275}} className="shadow-md border border-gray-300 overflow-auto rounded-2xl p-2 pr-4">
                        <p style={{fontSize: 13}} className="break-words">{hobbiesInfo}</p>
                    </div>
                    <div style={{height: 100}}></div>
                    <span>People with whom this list has been shared</span>
                    {isFriendsPending ? <div>Loading...</div> :  <div className="flex">
                        {friends.map((friend) => (
                            <UserProfileImage
                                key={friend.id}
                                userId={friend.id}
                                userName={friend.firstName}
                                alt=""
                                width={30}
                                height={30}
                            />
                        ))}
                    </div> }
                </div>}
            </div>
        </HomeLeftTemplate>
    );
}