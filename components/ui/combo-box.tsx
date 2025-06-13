"use client";

import * as React from "react";
import { ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ListItem } from "./list-item";

interface Option {
  label: string;
  value: string;
}

interface ComboboxProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  heading: string;
  className?: string; // Optional className for outermost div if needed
}

export const Combobox = ({
  options,
  value,
  onChange,
  heading,
  className,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filtered, setFiltered] = React.useState<Option[]>(options);

  React.useEffect(() => {
    if (searchTerm === "") {
      setFiltered(options);
    } else {
      setFiltered(
        options.filter((item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, options]);

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-black/30 border border-purple-600 text-purple-300 hover:bg-purple-600/10",
            className
          )}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:min-w-96 bg-black/40 border border-purple-700 text-purple-200 shadow-lg backdrop-blur-sm">
        <Command>
          <div className="w-full px-2 py-2 flex items-center border border-purple-600/30 rounded-md bg-black/20">
            <Search className="mr-2 h-4 w-4 min-w-4 text-purple-400" />
            <input
              type="text"
              placeholder={`Search ${heading.toLowerCase()}`}
              onChange={handleSearchTerm}
              value={searchTerm}
              className="flex-1 w-full bg-transparent text-sm text-purple-300 placeholder:text-purple-500 outline-none"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <CommandList>
            <CommandGroup heading={heading}>
              {filtered.length > 0 ? (
                filtered.map((option) => (
                  <ListItem
                    key={option.value}
                    category={option}
                    onSelect={() => {
                      onChange(option.value === value ? "" : option.value);
                      setOpen(false);
                    }}
                    isChecked={option.value === value}
                  />
                ))
              ) : (
                <CommandEmpty className="text-purple-400">
                  No {heading.toLowerCase()} found
                </CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};