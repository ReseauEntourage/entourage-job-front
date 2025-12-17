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

    return webpackConfig;
  },

  docs: {},
};

export default config;
