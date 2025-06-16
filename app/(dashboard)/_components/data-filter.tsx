"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const DateFilter = () => {
  const data = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "thisWeek", label: "This Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "lastMonth", label: "Last Month" },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const onChange = (value: string) => {
    const currentQuery = Object.fromEntries(searchParams.entries());
    const updatedQuery = {
      ...currentQuery,
      createdAtFilter: value,
    };
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: updatedQuery,
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full md:w-48 text-sm border border-gray-600/40 bg-black/90 text-white hover:border-gray-500 hover:bg-gray-900/90 transition-all rounded-lg shadow-lg backdrop-blur-sm">
          <SelectValue placeholder="📅 Filter By Date" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-black/95 border border-gray-700/50 text-white backdrop-blur-lg shadow-2xl">
          {data.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="text-sm px-3 py-2 hover:bg-gray-800/60 focus:bg-gray-800/80 cursor-pointer transition-colors rounded-md"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};