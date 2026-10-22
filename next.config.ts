import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  // Emit /impressum/index.html so static web servers resolve /impressum/.
  trailingSlash: true,
  images: { unoptimized: true },
  allowedDevOrigins: ['eidolon3000.greenway.home.arpa', 'eidolon3001.greenway.home.arpa'],
};

export default config;
