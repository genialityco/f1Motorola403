"use client";

import type { CSSProperties } from 'react';

import type { Category } from '../../types/game';

import { MediaAsset } from '../layout/MediaAsset';

type CategoryCardProps = {
  category: Category;
  selected: boolean;
  onSelect: (categoryId: string) => void;
};

export function CategoryCard({ category, selected, onSelect }: CategoryCardProps) {
  const style = { '--category-color': category.color } as CSSProperties;

  return (
    <button
      type="button"
      className={`category-card ${selected ? 'category-card--selected' : ''}`}
      style={style}
      aria-pressed={selected}
      // En táctil seleccionamos en el "down" (el click por toque no se dispara de forma
      // fiable dentro del contenedor con scroll). Con ratón/teclado se usa el click.
      onPointerDown={(event) => {
        if (event.pointerType !== 'mouse') {
          onSelect(category.id);
        }
      }}
      onClick={() => onSelect(category.id)}
    >
      <span className="category-card__media" aria-hidden="true">
        <MediaAsset
          src={selected ? category.selectionImage : category.unselectedImage}
          alt={selected ? category.selectionImageAlt : category.unselectedImageAlt}
          sizes="(max-width: 720px) 100vw, 50vw"
          objectFit="cover"
        />
      </span>

      <span className="category-card__name">{category.name}</span>
    </button>
  );
}
