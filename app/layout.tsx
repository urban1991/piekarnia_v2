import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Libre_Caslon_Text, Source_Sans_3 } from 'next/font/google';
import { getSiteSettings } from '../lib/data';
import { SITE_NAME, siteUrl } from '../lib/site';
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: 'Piekarnia Bieżyński — rodzinna piekarnia ze Świdnicy',
    description:
      'Chleb na zakwasie, bułki i ciasta wypiekane codziennie od świtu. Sklepy firmowe w Świdnicy, Jaworzynie Śląskiej i Bielawie.',
    // og:title and og:description come from each page's own title and description
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      siteName: SITE_NAME,
      images: settings.ogImage ? [{ url: settings.ogImage, width: 1200, height: 630, alt: SITE_NAME }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  };
}

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
