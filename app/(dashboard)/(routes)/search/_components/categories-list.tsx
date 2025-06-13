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
      className="flex items-center gap-x-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-transparent"
    >
      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          label={category.name}
          value={category.id.toString()} // ensure string
        />
      ))}
    </nav>
  );
};