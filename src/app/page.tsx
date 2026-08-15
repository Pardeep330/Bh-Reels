"use client";

import React from "react";
import { PublicNavbar } from "@/components/public/Navbar";
import { PublicFooter } from "@/components/public/Footer";
import HomePage from "./(public)/page";

export default function RootPage() {
  return (
    <div className="min-h-screen bg-[#08090C] text-gray-100 flex flex-col antialiased">
      <PublicNavbar />
      <main className="flex-1">
        <HomePage />
      </main>
      <PublicFooter />
    </div>
  );
}
