"use client";

import React from "react";
import { MobileSideBar } from "./mobile-side-bar";
import { motion } from "framer-motion";
import { Logo } from "./logo";

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-black/90 backdrop-blur-xl  border-purple-700 shadow-lg px-6 py-3"
      role="navigation"
    >
      {/* Left: Mobile menu + Logo */}
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <MobileSideBar />
        </div>
        <Logo />
      </div>

      {/* Center: Funny display name */}
      <div className="absolute inset-x-0 flex justify-center pointer-events-none">
        <span className="text-purple-300 text-sm font-semibold tracking-wide">
          made by Uncle Sam&apos;s Nephew
        </span>
      </div>
    </motion.nav>
    
  );
};