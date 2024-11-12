"use client";

import { Spicy_Rice } from "next/font/google";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { Snowfall } from "../Snowfall"; 
import { SnowHills } from "../Snowhills";

const spicy = Spicy_Rice({
  weight: "400",
  subsets: ["latin"],
});

export default function About() {
  const { width } = useWindowSize();

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
              About HitMyGift
            </p>
            <div
              style={{
                width: width < 850 ? 400 : 600,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <p>
                HitMyGift was born from the desire to make gift-giving more
                personal and meaningful. We believe that the best gifts are the
                ones that truly resonate with the recipient, and that starts with
                knowing what they actually want.
              </p>
              <p>
                Our platform empowers users to create their own wishlists, filled
                with items they genuinely desire. By sharing these wishlists with
                friends and family, they eliminate the guesswork and ensure that
                every gift is a hit.
              </p>
              <p>
                We're passionate about making gift-giving a joy for both the
                giver and the receiver. Join us on our mission to eliminate
                unwanted gifts and spread happiness through thoughtful
                presenting.
              </p>
            </div>
          </div>
          <div className="absolute">
            <Snowfall />
          </div>
          {/* ... (rest of your image elements) ... */}
          <div
            className="absolute  w-screen"
            style={{ bottom: -10, left: 0, height: 100 }}
          >
            <SnowHills />
          </div>
        </div>

        {/* ... (footer) ... */}
      </div>
    </RenderClientOnly>
  );
}