'use client';

import type { ComponentType } from 'react';
import {
  Apple,
  Beer,
  Coffee,
  CupSoda,
  Droplets,
  GlassWater,
  IceCreamBowl,
  Plus,
  Undo2,
  Wine,
} from 'lucide-react';
import { LongPress } from '@/components/LongPress';
import { euro, type Item } from '@/lib/calculator';

type LayoutName =
  | 'tabletLandscape'
  | 'tabletPortrait'
  | 'mobileLandscape'
  | 'mobilePortrait';

type ProductTileProps = {
  item: Item;
  count: number;
  layout: LayoutName;
  longPressMs: number;
  onChange: (id: string, delta: number) => void;
};

const icons: Record<string, ComponentType<{ size?: number }>> = {
  apple: Apple,
  beer: Beer,
  coffee: Coffee,
  'cup-soda': CupSoda,
  droplets: Droplets,
  'glass-water': GlassWater,
  'ice-cream-bowl': IceCreamBowl,
  plus: Plus,
  'undo-2': Undo2,
  wine: Wine,
};

/** A single configurable tile in the responsive 12-column product grid. */
export function ProductTile({
  item,
  count,
  layout,
  longPressMs,
  onChange,
}: ProductTileProps) {
  const Icon = icons[item.icon] ?? GlassWater;
  const [x, y, width, height] = item.layout[layout] ?? [1, 1, 6, 2];

  return (
    <LongPress
      className={`product-tile color-${item.color}`}
      style={{
        gridColumn: `${x} / span ${width}`,
        gridRow: `${y} / span ${height}`,
      }}
      onTap={() => onChange(item.id, 1)}
      onHold={() => onChange(item.id, -1)}
      delay={longPressMs}
      title="Tippen: +1 · Halten: −1"
    >
      <Icon size={27} />
      <span className="product-name">{item.title}</span>
      <span className="price">{euro(item.priceCents)}</span>
      <span className="qty">{count}</span>
    </LongPress>
  );
}
