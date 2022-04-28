// eslint-disable-next-line
require('dotenv').config();

const webpack = require('webpack');
const withLess = require('next-with-less');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

const dev = process.env.NODE_ENV !== 'production';

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'unsafe-inline';
  child-src 'self' youtube.com www.youtube.com airtable.com www.airtable.com;
  style-src 'self';
  font-src 'self';
  img-src 'self' ${process.env.AWSS3_CDN_URL} ${
  process.env.CDN_URL ? process.env.CDN_URL : ''
};
`;

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
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
];

module.exports = withLess({
  lessOptions: {
    javascriptEnabled: true,
  },
  webpack: (config, options) => {
    config.resolve.modules.push(__dirname);

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
  assetPrefix: !dev ? process.env.CDN_URL || '' : '',
  async redirects() {
    return [
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
