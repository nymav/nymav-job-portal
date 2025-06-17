"use client";

import { Category } from "@/lib/generated/prisma";
import CategoryListItem from "./category-list-item";

interface CategoriesListProps {
  categories: Category[];
}

export const CategoriesList = ({ categories }: CategoriesListProps) => {
  return (
    <nav
      aria-label="Job Categories"
      className="flex items-center gap-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent px-2"
    >
      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          label={category.name}
          value={category.id.toString()}
        />
      ))}
    </nav>
  );
};