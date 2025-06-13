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

  // Defensive toString() for comparison
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
      variant="outline"
      className={cn(
        "whitespace-nowrap text-xs font-medium rounded-full px-3 py-1 transition-colors duration-200 border bg-black/10 backdrop-blur text-gray-300 hover:bg-purple-800/30 hover:text-white",
        isSelected && "bg-purple-800 text-white border-purple-500 shadow-md"
      )}
    >
      {label}
    </Button>
  );
};

export default CategoryListItem;