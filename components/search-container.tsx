"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchContainer = () => {
  const params = useSearchParams();
  return <SearchInput key={params.get("title") || ""} />;
};

const SearchInput = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentTitle = searchParams.get("title") || "";
  const [value, setValue] = useState(currentTitle);
  const editing = useRef(false);
  const debounceValue = useDebounce(value);

  useEffect(() => {
    if (!editing.current || debounceValue === currentTitle) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debounceValue.trim()) params.set("title", debounceValue.trim());
    else params.delete("title");
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
  }, [debounceValue, currentTitle, pathname, router, searchParams]);

  return (
    <div className="relative flex items-center w-full max-w-md">
      <Search aria-hidden="true" className="absolute left-3 h-4 w-4 text-gray-400" />
      <Input type="search" aria-label="Search jobs by title" placeholder="Search job titles" value={value}
        onChange={(e) => { editing.current = true; setValue(e.target.value); }}
        className="w-full rounded-lg border-gray-700 bg-gray-950 pl-9 pr-9 text-gray-100 placeholder:text-gray-400" />
      {value && <Button variant="ghost" size="icon" type="button" aria-label="Clear job search"
        onClick={() => { editing.current = true; setValue(""); }} className="absolute right-1 text-gray-400">
        <X aria-hidden="true" className="w-4 h-4" />
      </Button>}
    </div>
  );
};
