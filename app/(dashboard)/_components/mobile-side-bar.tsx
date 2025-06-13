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
      <SheetTrigger className="md:hidden p-2 rounded-md hover:bg-purple-800/10 text-purple-300 transition flex items-center justify-center">
        <Menu size={22} />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 bg-black/40 backdrop-blur-xl p-0  border-purple-700 shadow-2xl"
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