import path from 'path';
import { StorybookConfig } from '@storybook/nextjs';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { AnyCantFix } from '../src/utils/Types';

const config: StorybookConfig = {
  framework: '@storybook/nextjs',

  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
  ],

  core: {},
  staticDirs: ['../public'],

  webpackFinal: async (webpackConfig) => {
    if (webpackConfig.resolve) {
      webpackConfig.resolve.modules = [
        path.resolve(__dirname, '..', './'),
        'node_modules',
      ];

      webpackConfig.resolve.roots = [
        path.resolve(__dirname, '../public'),
        'node_modules',
      ];

      webpackConfig.resolve.plugins = [
        ...(webpackConfig.resolve.plugins || []),
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, '../src/tsconfig.json'),
          extensions: webpackConfig.resolve.extensions,
        }),
      ];
    }

    if (webpackConfig.module && webpackConfig.module.rules) {
      const { rules } = webpackConfig.module;

      const imageRule = rules.find((rule) => {
        const { test } = rule as { test: RegExp };

        if (!test) {
          return false;
        }

        return test.test('.svg');
      }) as { [key: string]: AnyCantFix };

      imageRule.exclude = /\.svg$/;

      rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
    }

    return webpackConfig;
  },

  docs: {},
};

export default config;
