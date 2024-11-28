"use client";

import React, { useEffect } from "react";

import { navigateTo } from "../actions/navigateTo";


export default function LandingPage() {

  useEffect(() => {
    navigateTo('/mylist');
  }, []);

  return (
    <div>
    </div>
  );
}
