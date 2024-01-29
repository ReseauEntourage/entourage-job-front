import path from 'path';
import { StorybookConfig } from '@storybook/nextjs';
import { AnyCantFix } from '../src/utils/Types';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
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

  docs: {
    autodocs: false,
  },
};

export default config;
