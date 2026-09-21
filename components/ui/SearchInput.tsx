'use client';

import s from './SearchInput.module.css';

export function SearchInput({
  value,
  onChange,
  placeholder = 'Szukaj wypieku…',
  label = 'Szukaj produktu',
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  label?: string;
}) {
  return (
    <label className={s.wrap}>
      <span className={s.srOnly}>{label}</span>
      <svg className={s.icon} viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M13 13l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className={s.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      {value ? (
        <button type="button" className={s.clear} aria-label="Wyczyść" onClick={() => onChange('')}>
          ×
        </button>
      ) : null}
    </label>
  );
}
