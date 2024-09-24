'use client'

import { useState } from "react";

export default function HomeLeftSection(){

    const [displayFriendsList, setDisplayFriendsList] = useState(false);


    const MyList = () =>{
        return (
            <div className="p-2 flex flex-col">
                {/** My hobbies and interests */}
                <div>
                    <span>My hobbies and interest</span>
                    <div className="p-2 ml-2 w-52 h-64 border rounded border-black">
                        Welcome to my wishlist! These are the... 
                    </div>
                </div>
                {/**My events section */}
                <div className="mt-4">
                    <div className="flex justify-between">
                        <span>My Events</span>
                        <button className="pl-2 pr-2 bg-blue-600 text-white rounded-full">
                            Add event
                        </button>
                    </div>
                    <div>
                        <div className="flex flex-col gap-4 items-between justify-between">
                            <div className="">
                                <span style={{fontSize: 20}} className="bg-gray-200  font-bold p-2 rounded-full">20</span>
                                <span>Event Name</span>
                            </div>
                            <div>
                                <span style={{fontSize: 20}} className="bg-gray-200  font-bold p-2 rounded-full">20</span>
                                <span>Event Name</span>
                            </div>
                            <div>
                                <span style={{fontSize: 20}} className="bg-gray-200  font-bold p-2 rounded-full">20</span>
                                <span>Event Name</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/**Calendar Section */}
                <div className="flex items-center justify-center mt-2 w-full h-40 border border-black">
                    Calendar Section
                </div>
                <div>

                </div>
                <div>

                </div>
            </div>
        );
    }

    const FriendsList = () => {
        return (
            <div>
                kokdowed
            </div>
        )
    }

    return (
        <div className="h-full">
            {displayFriendsList ? <FriendsList/> : <MyList/>}
        </div>
    );
}