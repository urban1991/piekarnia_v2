import type { ReactNode } from 'react';

export const metadata = { title: 'Studio — Piekarnia Bieżyński', robots: { index: false } };

/** Studio renders its own chrome; skip the site Footer from the root layout. */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return <div style={{ minHeight: '100vh' }}>{children}</div>;
}
