"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

export const MobileSideBar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden p-2 rounded-lg hover:bg-gray-800/60 text-white transition-colors flex items-center justify-center">
        <Menu size={22} />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 bg-black/95 backdrop-blur-xl p-0 border-gray-800/50 shadow-2xl"
      >
        {/* Radix A11y Header */}
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>

        {/* Sidebar content inside mobile drawer */}
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};