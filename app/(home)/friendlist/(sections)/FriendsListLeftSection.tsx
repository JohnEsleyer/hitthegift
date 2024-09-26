'use client'


import React from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";


export default function FriendsListLeftSection(){




    return (
        <div className="h-full">
            <div className="flex justify-center gap-2">
                <Link href="/mylist">My List</Link>
                <Link href="/friends-list">Friends List</Link>
            </div>
            <div>
            <div className="p-2 flex flex-col gap-4 ">
                
                <div className="border border-gray-400 rounded">
                    {/**Friend's profile */}
                    <div className="flex mb-4">
                        <div className="bg-slate-300 rounded-full w-12 h-12">
                        </div>
                       <div>
                       <p>Name</p>
                       <p>Email@gmail.com</p>
                       </div>
                    </div>
                    <span className=" text-2xl">Interests and hobbies</span>
                    <Textarea
                        key={"hobbiesInfo"}
                        className="h-32 mb-64 "
                        placeholder={
                            "Welcome to my wish list! These are the things I would love to have, and I would be so happy if you could gift me something from here."
                        }
                        value={''}
                        onChange={()=>{}}
                        />
                    <span>People with whom this list has been shared</span>
                    <div className="flex">
                        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                        <div className="h-12 w-12 rounded-full bg-gray-300"></div>

                    </div>
                </div>

            </div>
            </div>
        </div>
    );
}