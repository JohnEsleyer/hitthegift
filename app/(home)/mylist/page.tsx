"use client";

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { updateCurrentOverlay } from "@/lib/features/overlays";
import Avvvatars from "avvvatars-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { OverlayPage } from "../mylist/(components)/OverlayPage";

import Image from 'next/image';
import Loading from '/public/loading.svg';
import AuthMiddleware from "@/components/AuthMiddleware";
import MyListLeftSection from "./(sections)/MyListLeftSection";
import MyListRightSection from "./(sections)/MyListRightSection";
import HomeTemplate from "@/components/HomeTemplate";


export default function MyListPage() {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <HomeTemplate
      leftSide={<MyListLeftSection/>}
      rightSide={<MyListRightSection/>}
    />
  );
}
