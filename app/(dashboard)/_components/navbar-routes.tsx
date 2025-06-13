"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { SearchContainer } from "@/components/search-container";
import { cn } from "@/lib/utils";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  const isPlayerPage = pathname?.startsWith("/jobs");
  const isSearchPage = pathname?.startsWith("/search");

  return (
    <div className="flex items-center gap-x-4">
      {/* Search bar only on search page and md+ screens */}
      {isSearchPage && (
        <div className="hidden flex flex-1 px-2 pr-8 items-center">
          <SearchContainer />
        </div>
      )}

      {/* Right side buttons */}
      <div className="flex items-center gap-x-3 ml-auto">
        {(isAdminPage || isPlayerPage) ? (
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "text-purple-300 border-purple-600/40 hover:bg-purple-700/10 hover:text-purple-200 transition duration-200",
                "flex items-center gap-1"
              )}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Exit</span>
            </Button>
          </Link>
        ) : (
          <Link href="/admin/jobs">
            <Button
              variant="outline"
              size="sm"
              className="text-purple-300 border-purple-600/40 hover:bg-purple-700/10 hover:text-purple-200 transition duration-200"
            >
              Admin Mode
            </Button>
          </Link>
        )}

        {/* Clerk user avatar */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};