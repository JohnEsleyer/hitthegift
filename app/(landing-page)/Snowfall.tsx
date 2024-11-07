'use client'

import { Snowflake } from "./Snowflake";



export function Snowfall() {
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
  