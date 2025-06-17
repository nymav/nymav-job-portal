"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryListItemProps {
  label: string;
  value: string;
}

const CategoryListItem = ({ label, value }: CategoryListItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value.toString();

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle ?? undefined,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <Button
      type="button"
      onClick={onClick}
      variant="ghost"
      className={cn(
        "whitespace-nowrap text-sm font-medium rounded-xl px-6 py-3 transition-all duration-300",
        "bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 text-gray-300",
        "hover:bg-gray-800/70 hover:border-gray-600/60 hover:text-white hover:scale-105",
        "shadow-sm hover:shadow-lg",
        isSelected && "bg-white text-black border-gray-400 shadow-lg scale-105"
      )}
    >
      {label}
    </Button>
  );
};

export default CategoryListItem;