"use client";

import { Spicy_Rice } from "next/font/google";
import Link from "next/link";
import { CSSProperties } from "react";
import Image from "next/image";
import Gift from "/public/gift.png";

const spicy = Spicy_Rice({
  weight: "400",
  subsets: ["latin"],
});

import React from "react";

interface SnowflakeProps {
  left: string;
  leftIni: string;
  leftEnd: string;
  speed: string;
  size: string;
  delay: string;
}

const Snowflake: React.FC<SnowflakeProps> = ({
  left,
  leftIni,
  leftEnd,
  speed,
  size,
  delay,
}) => {
  return (
    <div
      className="snowflake"
      style={
        {
          "--left": left,
          "--left-ini": leftIni,
          "--left-end": leftEnd,
          "--speed": speed,
          "--size": size,
          "--delay": delay,
        } as CSSProperties
      }
    ></div>
  );
};

function Snowfall() {
  const generateSnowflakes = () => {
    const snowflakes: JSX.Element[] = [];
    for (let i = 0; i < 50; i++) {
      const random = (num: number) => Math.floor(Math.random() * num);
      const size = `${random(5) * 0.2}vw`; // Generate size here
      snowflakes.push(
        <Snowflake
          key={i}
          left={`${random(100)}vw`}
          leftIni={`${random(20) - 10}vw`}
          leftEnd={`${random(20) - 10}vw`}
          speed={`${5 + random(15)}s`}
          size={size} // Pass the generated size
          delay={`-${random(15)}s`}
        />
      );
    }
    return snowflakes;
  };

  return (
    <div>
      <style>{`
        html, body {
          padding: 0;
          margin: 0;
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          background: linear-gradient(#123, #111);
        }

        @keyframes snowfall {
          0% {
            transform: translate3d(var(--left-ini),   
 0, 0);
          }
          100% {
            transform: translate3d(var(--left-end), 105vh, 0);
          }
        }

        .snowflake {
          width: var(--size);
          height: var(--size);
          background: white;
          border-radius: 50%;
          position: absolute;
          top: -5vh;
          left: var(--left);
          animation: snowfall var(--speed) linear infinite;
          animation-delay: var(--delay);   

        }
      `}</style>
      {generateSnowflakes()}
    </div>
  );
}

function SnowHills() {
  return (
    <div>
      <style>
        {`
        body {
  background-color: #87CEEB;
}

.hills {
  position: relative;
  height: 150px;
  width: 500%;
}

.hill {
  position: absolute;
  bottom: 0;
  width: 200px;
  height: 100px;
  background-color: white;
  border-radius: 100% 100% 0 0 / 60% 60% 0 0; /* Adjust these values for different curves */
}

.hill:nth-child(1) {
  left: 0;
}

.hill:nth-child(2) {
  left: 100px;
  height: 120px;
}

.hill:nth-child(3) {
  left: 150px;
  height: 105px;
}

.hill:nth-child(4) {
  left: 200px;
  height: 80px;
}

.hill:nth-child(5) {
  left: 300px;
  height: 80px;
}
  .hill:nth-child(6) {
  left: 350px;
  height: 80px;
}
    .hill:nth-child(7) {
  left: 400px;
  height: 90px;
}
.hill:nth-child(8) {
  left: 500px;
  height: 70px;
}
.hill:nth-child(9) {
  left: 550px;
  height: 80px;
}
.hill:nth-child(10) {
  left: 750px;
  height:80px;
}
.hill:nth-child(11) {
  left: 850px;
  height:100px;
}
.hill:nth-child(12) {
  left: 900px;
  height:100px;
}
  .hill:nth-child(13) {
  left: 950px;
  height: 70px;
}

.hill:nth-child(14) {
  left: 1000px;
  height:80px;
}
.hill:nth-child(15) {
  left: 1050px;
  height:100px;
}
.hill:nth-child(16) {
  left: 1100px;
  height:100px;
}
  .hill:nth-child(17) {
  left: 1150x;
  height:100px;
}
  .hill:nth-child(18) {
  left: 1200px;
  height:100px;
}
  .hill:nth-child(19) {
  left: 1250px;
  height:80px;
}
    .hill:nth-child(20) {
  left: 1300px;
  height:80px;
}


        `}
      </style>
        <div className="hills">
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
          <div className="hill"></div>
        </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="overflow-auto h-screen w-screen hide-scrollbar bg-white">
      <div className="relative h-screen w-screen flex flex-col bg-gradient-to-b from-[#030c42] to-blue-500 text-white font-bold py-2 px-4 ">
        <div className="flex-1 flex flex-col justify-center items-center">
          <p
            style={{
              fontSize: 60,
            }}
            className={`${spicy.className} font-bold text-white`}
          >
            HitMyGift
          </p>

          <div className="flex justify-center gap-2">
            <Link href="/login" className="border rounded-full p-2 pl-4 pr-4 bg-white text-black">
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
            "https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/gift-red.png"
          }
          alt=""
          width={200}
          height={200}
        />
        <img
          className="absolute"
          style={{ transform: "rotate(-39deg)", bottom: -40, right: -40 }}
          src={
            "https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/gift-green.png"
          }
          alt=""
          width={200}
          height={200}
        />
        <img
          className="absolute"
          style={{ transform: "rotate(-10deg)", bottom: -20, right: 50 }}
          src={
            "https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/gift-yellow.png"
          }
          alt=""
          width={90}
          height={90}
        />
        <img
          className="absolute"
          style={{ transform: "rotate(-10deg)", bottom: -10, left: 50 }}
          src={
            "https://imageassets-hitmygift.fra1.cdn.digitaloceanspaces.com/gift-purple.png"
          }
          alt=""
          width={90}
          height={90}
        />
        <div className="absolute  w-screen" style={{bottom:-10, left:0, height: 100}}>
          <SnowHills/>
          
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
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Contact</a>
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
  );
}
