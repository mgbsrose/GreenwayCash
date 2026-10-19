import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ROSI zählt für euch!',
    short_name: 'ROSI',
    description: 'Die Weihnachtsmarkt-Rechenhilfe',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f3e9',
    theme_color: '#173e35',
    icons: [{ src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
