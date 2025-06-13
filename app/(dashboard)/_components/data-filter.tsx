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
        <SelectTrigger className="w-full md:w-48 text-sm border border-purple-700 bg-black/40 text-purple-300 hover:border-purple-400 transition rounded-md shadow-sm backdrop-blur-lg">
          <SelectValue placeholder="📅 Filter By Date" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-black/90 border border-purple-700 text-purple-300 backdrop-blur-lg shadow-md">
          {data.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="text-sm px-3 py-2 hover:bg-purple-800/20 focus:bg-purple-800/30 cursor-pointer transition rounded-sm"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};