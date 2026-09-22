import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Piekarnia Bieżyński',
    short_name: 'Bieżyński',
    description: 'Rodzinna piekarnia ze Świdnicy. Chleb na zakwasie, bułki i ciasta codziennie od świtu.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F1E8',
    theme_color: '#A6192E',
    icons: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  };
}
