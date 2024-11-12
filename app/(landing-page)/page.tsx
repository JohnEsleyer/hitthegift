"use client";

import { Spicy_Rice } from "next/font/google";
import Link from "next/link";
import { CSSProperties } from "react";
import React from "react";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { Snowfall } from "./Snowfall";
import {SnowHills} from './Snowhills'; 

const spicy = Spicy_Rice({
  weight: "400",
  subsets: ["latin"],
});



export default function LandingPage() {
  const { width, height } = useWindowSize();

  return (
    <RenderClientOnly loading={<div></div>}>
    <div className="overflow-auto h-screen w-screen hide-scrollbar overflow-x-hidden">
      <div className="relative h-screen w-screen flex flex-col bg-gradient-to-b from-[#030c42] to-blue-500 text-white py-2 px-4 ">
        <div className="flex justify-center">
          <p
            style={{
              fontSize: 40,
            }}
            className={`${spicy.className} font-bold`}
          >
            <span className="text-[#eb4034]">Hit</span>
            <span className="text-white">My</span>
            <span className="text-[#0cb00c]">Gift</span>
          </p>
        </div>
        <div className="flex-1 flex flex-col justify-start pt-24 items-center text-center w-screen">
          <p
            style={{
              fontSize: width < 850 ? 40 : 60,
              width: width < 850 ? 400 : 850,
            }}
            className=" font-bold"
          >
            Tired of Giving Gifts that{" "}
            <span className=" text-transparent bg-clip-text bg-gradient-to-l from-red-500 via-[#E5C573] to-[#FEFFF4]">
              Miss the Mark?
            </span>
          </p>
          <div style={{ width: width < 850 ? 400 : 600, marginTop: 10, marginBottom: 10 }}>
            <p>
              <span className="text-amber-500">HitMyGift</span> takes the
              guesswork out of giving gifts.
            </p>
            <p>
              Create your own wishlist filled with things you actually want and
              share it with friends and family. No more awkward "thanks, I love
              it..." moments. Just pure gifting joy!
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <Link
              href="/login"
              className="border rounded-full p-2 pl-4 pr-4 bg-white text-black"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full p-2 pl-4 pr-4 bg-black"
            >
              Create new account
            </Link>
          </div>
        </div>
        <div className="absolute">
          <Snowfall />
        </div>
        <img
          className="absolute"
          style={{ transform: "rotate(39deg)", bottom: -40, left: -40 }}
          src={
            "https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/gift-red.webp"
          }
          alt=""
          width={200}
          height={200}
        />
        <img
          className="absolute"
          style={{ transform: "rotate(-39deg)", bottom: -40, right: -40 }}
          src={
            "https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/gift-green.webp"
          }
          alt=""
          width={200}
          height={200}
        />
        <img
          className="absolute"
          style={{ transform: "rotate(-10deg)", bottom: -20, right: 50 }}
          src={
            "https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/gift-yellow.webp"
          }
          alt=""
          width={90}
          height={90}
        />
        <img
          className="absolute"
          style={{ transform: "rotate(-10deg)", bottom: -10, left: 50 }}
          src={
            "https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/gift-purple.webp"
          }
          alt=""
          width={90}
          height={90}
        />
        <div
          className="absolute  w-screen"
          style={{ bottom: -10, left: 0, height: 100 }}
        >
          <SnowHills />
        </div>
      </div>

      <div
        className="bg-white flex flex-col justify-between"
        style={{ height: 300 }}
      >
        <div className="container mx-auto">
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul>
                <li className="underline">
                  <a href="/about">About</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>

              <p>Email: info@hitmygift.com</p>
            </div>
          </div>
          <div className="border-t border-black flex items-center mt-4 pt-1 justify-center  text-center text-black">
            <p>&copy; 2023 HitMyGift. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
    </RenderClientOnly>
  );
}
