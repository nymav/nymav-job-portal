"use client";

import { cn } from "@/lib/utils";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string; // ✅ Add this
}

export const Editor = ({ value, onChange, className }: EditorProps) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full min-h-[150px] p-3 text-sm bg-black/30 border border-purple-700/40 text-purple-200 placeholder-purple-400 rounded-md backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition",
        className // ✅ Append passed className
      )}
      placeholder="Enter job description..."
    />
  );
};