import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  allowedDevOrigins: ['eidolon3000.greenway.home.arpa'],
};

export default config;
