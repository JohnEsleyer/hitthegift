"use client";

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { updateCurrentOverlay } from "@/lib/features/overlays";
import Avvvatars from "avvvatars-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { OverlayPage } from "../mylist/(components)/OverlayPage";
import FriendsListLeftSection from "./(sections)/FriendsListLeftSection";
import FriendsListRightSection from "./(sections)/FriendsListRightSection";
import Image from "next/image";
import Loading from "/public/loading.svg";
import AuthMiddleware from "@/components/AuthMiddleware";
import Link from "next/link";
import HomeTemplate from "@/components/HomeTemplate";

export default function FriendsListPage() {
  return (
    <HomeTemplate
      leftSide={<FriendsListLeftSection/>}
      rightSide={<FriendsListRightSection/>}
      allowChat={true}
    />
  );
}
