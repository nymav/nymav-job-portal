"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ListItemProps {
  category: any;
  onSelect: (category: any) => void;
  isChecked: boolean;
}

export const ListItem = ({ category, onSelect, isChecked }: ListItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center px-3 py-1 cursor-pointer rounded-md transition-colors select-none",
        "text-purple-300 hover:bg-purple-700/30 hover:text-purple-100",
        "bg-transparent",
      )}
      onClick={() => onSelect(category)}
    >
      <Check
        className={cn(
          "ml-auto h-4 w-4 text-purple-400",
          isChecked ? "opacity-100" : "opacity-0"
        )}
      />
      <p className="w-full truncate text-sm whitespace-nowrap">{category.label}</p>
    </div>
  );
};