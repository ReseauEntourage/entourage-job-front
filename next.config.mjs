import dotenv from 'dotenv';
import withLess from 'next-with-less';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import hash from 'string-hash';
import { relative } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import tracer from 'dd-trace';

const ENV = `${process.env.NODE_ENV}`;

if (ENV === 'production') {
  tracer.init({
    version: process.env.NEXT_PUBLIC_HEROKU_RELEASE_VERSION,
  });
}

dotenv.config();

const dev = ENV !== 'production';
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
const nextConfig = withLess({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ({ resource }) => [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      // disable plugins
                      removeViewBox: false,
                      cleanupIDs: false,
                    },
                  },
                },
                {
                  name: 'cleanupIDs',
                  params: {
                    prefix: `svg${hash(relative(context, resource))}`,
                  },
                },
              ],
            },
          },
        },
      ],
    });

    config.plugins.push(
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // add errors to webpack instead of warnings
        failOnError: true,
        // allow const cycles that include an asyncronous const,
        // e.g. via const(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
      })
    );

    return config;
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
        source: '/tutoriel-video-premiers-pas',
        destination: process.env.NEXT_PUBLIC_TUTORIAL_VIDEO_FIRST_STEPS,
        permanent: false,
      },
      {
        source: '/tutoriel-projet-pro',
        destination: process.env.NEXT_PUBLIC_TUTORIAL_PP,
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
});

export default nextConfig;
