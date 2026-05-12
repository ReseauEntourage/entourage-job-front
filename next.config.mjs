import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import tracer from 'dd-trace';

tracer.init({
  version: process.env.HEROKU_RELEASE_VERSION,
  env: process.env.NODE_ENV,
});

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const context = dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin',
  },
];

let remotePatterns = [];

if (process.env.NEXT_PUBLIC_CDN_URL) {
  remotePatterns = [
    ...remotePatterns,
    {
      protocol: 'https',
      hostname: process.env.NEXT_PUBLIC_CDN_URL.replace('https://', ''),
      pathname: '/**',
    },
  ];
}

if (process.env.NEXT_PUBLIC_AWSS3_CDN_URL) {
  remotePatterns = [
    ...remotePatterns,
    {
      protocol: 'https',
      hostname: process.env.NEXT_PUBLIC_AWSS3_CDN_URL.replace('https://', ''),
      pathname: '/images/**',
    },
  ];
}

if (process.env.NEXT_PUBLIC_AWSS3_URL) {
  remotePatterns = [
    ...remotePatterns,
    {
      protocol: 'https',
      hostname: process.env.NEXT_PUBLIC_AWSS3_URL.replace('https://', ''),
      pathname: '/images/**',
    },
  ];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-lite-youtube-embed'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [{ loader: '@svgr/webpack', options: { dimensions: false } }],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { dimensions: false } }],
    });
    return config;
  },
  env: {
    NEXT_PUBLIC_RELEASE_VERSION:
      process.env.HEROKU_SLUG_COMMIT || 'development',
  },
  typescript: {
    tsconfigPath: 'src/tsconfig.json',
  },
  assetPrefix: !dev ? process.env.NEXT_PUBLIC_CDN_URL || undefined : undefined,
  images: {
    remotePatterns,
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/don',
        destination: process.env.NEXT_PUBLIC_DONATION_LINK,
        permanent: false,
      },
      {
        source: '/boite-a-outils',
        destination: process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL,
        permanent: false,
      },
      {
        source: '/linkedout',
        destination: '/entourage-pro',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  compiler: {
    styledComponents: {
      ssr: true,
    },
  },
};

export default nextConfig;
