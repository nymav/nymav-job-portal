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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl px-6 py-3"
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
        <span className="text-gray-400 text-sm font-medium tracking-wide select-none">
          made by Uncle Sam&apos;s Nephew
        </span>
      </div>
    </motion.nav>
  );
};