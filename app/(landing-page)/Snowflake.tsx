'use client'

import { CSSProperties } from "react";


interface SnowflakeProps {
    left: string;
    leftIni: string;
    leftEnd: string;
    speed: string;
    size: string;
    delay: string;
  }
  
 export function Snowflake({
    left,
    leftIni,
    leftEnd,
    speed,
    size,
    delay,
  }: SnowflakeProps) {
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