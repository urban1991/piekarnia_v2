'use client';

import s from './FilterChips.module.css';

export function FilterChips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className={s.row} role="group" aria-label="Filtry">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={s.chip + (option === value ? ' ' + s.active : '')}
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
