import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Libre_Caslon_Text, Source_Sans_3 } from 'next/font/google';
import '../styles/globals.css';

const serif = Libre_Caslon_Text({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif-next',
  display: 'swap',
});

const sans = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-sans-next',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Piekarnia Bieżyński — rodzinna piekarnia ze Świdnicy',
  description:
    'Chleb na zakwasie, bułki i ciasta wypiekane codziennie od świtu. Cztery sklepy firmowe w Świdnicy, Jaworzynie Śląskiej i Bielawie.',
};

export const viewport: Viewport = {
  themeColor: '#A6192E',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" className={serif.variable + ' ' + sans.variable}>
      <body>{children}</body>
    </html>
  );
}
