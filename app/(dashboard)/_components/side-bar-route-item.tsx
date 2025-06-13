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
        "group flex items-center gap-x-3 text-sm font-medium px-4 py-3 rounded-md transition-all",
        "hover:bg-purple-800/20 hover:text-purple-100",
        isActive
          ? "bg-purple-800/30 text-purple-300 border-l-4 border-purple-500"
          : "text-purple-400"
      )}
    >
      <Icon
        className={cn("text-purple-400 group-hover:text-purple-300", isActive && "text-purple-300")}
        size={20}
      />
      <span className="truncate">{label}</span>
    </button>
  );
};