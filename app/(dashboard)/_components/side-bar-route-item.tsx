"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarRoutesItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarRoutesItem = ({ icon: Icon, label, href }: SidebarRoutesItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  return (
    <button
      onClick={() => router.push(href)}
      className={cn(
        "group flex items-center gap-x-3 text-sm font-medium px-4 py-3 rounded-lg transition-all w-full",
        "hover:bg-gray-800/60 hover:text-white",
        isActive
          ? "bg-gray-800/80 text-white border-l-4 border-white shadow-lg"
          : "text-gray-300"
      )}
    >
      <Icon
        className={cn("text-gray-400 group-hover:text-white transition-colors", isActive && "text-white")}
        size={20}
      />
      <span className="truncate">{label}</span>
    </button>
  );
};