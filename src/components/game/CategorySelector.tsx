"use client";

import type { Category } from '../../types/game';

import { CategoryCard } from './CategoryCard';

type CategorySelectorProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  onChange: (categoryId: string) => void;
};

export function CategorySelector({ categories, selectedCategoryId, onChange }: CategorySelectorProps) {
  return (
    <div className="category-selector" role="group" aria-label="Selecciona una categoría">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} selected={category.id === selectedCategoryId} onSelect={onChange} />
      ))}
    </div>
  );
}
