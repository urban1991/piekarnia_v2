'use client';

import { useState } from 'react';
import { FilterChips } from '../../components/ui/FilterChips';

const options = ['Wszystkie', 'Na zakwasie', 'Żytnie', 'Pszenne', 'Z dodatkami'];

export function DesignSystemChips() {
  const [value, setValue] = useState(options[0]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <FilterChips options={options} value={value} onChange={setValue} />
      <span style={{ fontSize: 13, color: 'var(--color-ink-muted)' }}>
        aktywny = Ink fill · hover = Ink border
      </span>
    </div>
  );
}
