"use client";


import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

import MyListLeftSection from "./(sections)/MyListLeftSection";
import MyListRightSection from "./(sections)/MyListRightSection";
import HomeTemplate from "@/components/HomeTemplate";


export default function MyListPage() {


  return (
    <HomeTemplate
      leftSide={<MyListLeftSection/>}
      rightSide={<MyListRightSection/>}
    />
  );
}
