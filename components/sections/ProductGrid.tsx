'use client';

import { useMemo, useState } from 'react';
import { FilterChips } from '../ui/FilterChips';
import { SearchInput } from '../ui/SearchInput';
import { Grid } from '../ui/Grid';
import { ProductCard } from '../cards/ProductCard';
import { ALL_TAGS, filterProducts } from '../../lib/productSearch';
import type { Product } from '../../lib/types';
import s from './ProductGrid.module.css';

export function ProductGrid({
  products,
  filters,
  highlightId,
  highlightLabel,
  backdrop,
  searchable = true,
}: {
  products: Product[];
  filters?: string[];
  highlightId?: string;
  highlightLabel?: string;
  backdrop?: string;
  searchable?: boolean;
}) {
  const [active, setActive] = useState(ALL_TAGS);
  const [query, setQuery] = useState('');

  const visible = useMemo(() => filterProducts(products, active, query), [active, query, products]);

  const hasFilters = !!filters && filters.length > 1;

  return (
    <div className={s.wrap}>
      {hasFilters || searchable ? (
        <div className={s.toolbar}>
          {hasFilters ? <FilterChips options={filters!} value={active} onChange={setActive} /> : <span />}
          {searchable ? <SearchInput value={query} onChange={setQuery} /> : null}
        </div>
      ) : null}

      {visible.length ? (
        <Grid cols={3}>
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              badge={product.id === highlightId ? highlightLabel : undefined}
              backdrop={backdrop}
            />
          ))}
        </Grid>
      ) : (
        <div className={s.empty}>
          <p className={s.emptyTitle}>Nic nie znaleźliśmy dla „{query}”.</p>
          <p className={s.emptyText}>Spróbuj innej nazwy albo wyczyść filtry.</p>
          <button
            type="button"
            className={s.emptyReset}
            onClick={() => {
              setQuery('');
              setActive(ALL_TAGS);
            }}
          >
            Pokaż wszystkie
          </button>
        </div>
      )}
      {searchable && visible.length ? (
        <p className={s.count} aria-live="polite">
          {visible.length === products.length
            ? `${products.length} produktów`
            : `${visible.length} z ${products.length} produktów`}
        </p>
      ) : null}
    </div>
  );
}
