"use client";

import { Bookmark, Compass, Home, List, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarRoutesItem } from "./side-bar-route-item";
import Box from "@/components/box";
import { useEffect, useState } from "react";
import { SearchContainer } from "@/components/search-container";
import { DateFilter } from "./data-filter";

const adminRoutes = [
  { icon: List, label: "Jobs", href: "/admin/jobs" },
  { icon: List, label: "Companies", href: "/admin/companies" },
  { icon: Compass, label: "Analytics", href: "/admin/analytics" },
];

const guestRoutes = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Compass, label: "Search", href: "/search" },
  { icon: User, label: "Profile", href: "/user" },
  { icon: Bookmark, label: "Saved Jobs", href: "/savedJobs" },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isSearchPage = pathname?.startsWith("/search");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const routes = isAdminPage ? adminRoutes : guestRoutes;

  return (
    <div className="flex flex-col gap-1">
      {routes.map((route) => (
        <SidebarRoutesItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}

      {mounted && isSearchPage && (
        <Box className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex flex-col gap-4">
            <SearchContainer />
            <DateFilter />
          </div>
        </Box>
      )}
    </div>
  );
};