import { fileURLToPath } from 'url';
import { StorybookConfig } from '@storybook/nextjs-vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  framework: '@storybook/nextjs-vite',

  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@chromatic-com/storybook',
  ],

  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [
      ...(viteConfig.plugins ?? []),
      tsconfigPaths({ projects: [fileURLToPath(new URL('../tsconfig.base.json', import.meta.url))] }),
    ];
    return viteConfig;
  },

  docs: {},
};

export default config;
