// eslint-disable-next-line
require('dotenv').config();

const webpack = require('webpack');
const withLess = require('next-with-less');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

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

if (process.env.CDN_URL) {
  remotePatterns = [
    ...remotePatterns,
    {
      protocol: 'https',
      hostname: process.env.CDN_URL.replace('https://', ''),
      pathname: '/**',
    },
  ];
}

if (process.env.AWSS3_CDN_URL) {
  remotePatterns = [
    ...remotePatterns,
    {
      protocol: 'https',
      hostname: process.env.AWSS3_CDN_URL.replace('https://', ''),
      pathname: '/images/**',
    },
  ];
}
if (process.env.AWSS3_URL) {
  remotePatterns = [
    ...remotePatterns,
    {
      protocol: 'https',
      hostname: process.env.AWSS3_URL.replace('https://', ''),
      pathname: '/images/**',
    },
  ];
}

module.exports = withLess({
  webpack: (config, options) => {
    config.resolve.modules.push(__dirname);

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      // disable plugins
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });

    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/react';
    }

    config.plugins.push(new webpack.EnvironmentPlugin(process.env));

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

    if (!dev && process.env.HEROKU_APP_ID) {
      config.plugins.push(
        new SentryWebpackPlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: `${process.env.HEROKU_APP_NAME}-sentry`,
          project: process.env.HEROKU_APP_NAME,
          include: '.',
          ignore: ['node_modules', 'next.config.js', 'assets', 'public'],
        })
      );
    }

    return config;
  },
  assetPrefix: !dev ? process.env.CDN_URL || undefined : undefined,
  images: {
    remotePatterns,
  },
  async redirects() {
    return [
      {
        source: '/entreprises/cvs',
        destination: '/candidats',
        permanent: false,
      },
      {
        source: '/don',
        destination: process.env.IRAISER_DONATION_LINK,
        permanent: false,
      },
      {
        source: '/tutoriel-video-premiers-pas',
        destination: process.env.TUTORIAL_VIDEO_FIRST_STEPS,
        permanent: false,
      },
      {
        source: '/tutoriel-video-cv',
        destination: process.env.TUTORIAL_VIDEO_CV,
        permanent: false,
      },
      {
        source: '/tutoriel-video-offres',
        destination: process.env.TUTORIAL_VIDEO_OFFERS,
        permanent: false,
      },
      {
        source: '/tutoriel-video-offres-2',
        destination: process.env.TUTORIAL_VIDEO_OFFERS_2,
        permanent: false,
      },
      {
        source: '/tutoriel-cv',
        destination: process.env.TUTORIAL_CV,
        permanent: false,
      },
      {
        source: '/tutoriel-projet-pro',
        destination: process.env.TUTORIAL_PP,
        permanent: false,
      },
      {
        source: '/tutoriel-entretien',
        destination: process.env.TUTORIAL_INTERVIEW_TRAINING,
        permanent: false,
      },
      {
        source: '/boite-a-outils',
        destination: process.env.TOOLBOX_URL,
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
});
