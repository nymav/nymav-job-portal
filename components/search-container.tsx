"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import qs from "query-string";

export const SearchContainer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Always call hooks at the top
  const currentTitle = searchParams.get("title");
  const currentCategoryId = searchParams.get("categoryId");
  const currentShiftTiming = searchParams.get("shiftTiming");
  const currentWorkMode = searchParams.get("workMode");

  const [value, setValue] = useState(currentTitle || "");
  const [mounted, setMounted] = useState(false);
  const debounceValue = useDebounce(value);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debounceValue,
          categoryId: currentCategoryId,
          workMode: currentWorkMode,
          shiftTiming: currentShiftTiming,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [debounceValue, currentCategoryId, currentShiftTiming, currentWorkMode, mounted]);

  return (
    <div className="relative flex items-center w-full max-w-md backdrop-blur-md">
      <Search className="absolute left-3 h-4 w-4 text-purple-400/70" />
      <Input
        type="text"
        placeholder="Search for jobs using title..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border border-purple-700/40 bg-black/30 pl-9 pr-9 py-2 text-sm text-purple-200 placeholder:text-purple-500 focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-0 transition shadow-md"
        disabled={!mounted}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={() => setValue("")}
          className="absolute right-2 text-purple-400 hover:text-white hover:bg-purple-500/10 hover:scale-110 transition"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};