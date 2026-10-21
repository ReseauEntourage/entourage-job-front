import { fileURLToPath } from 'url';
import { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  framework: '@storybook/nextjs-vite',

  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: ['@storybook/addon-links', '@chromatic-com/storybook'],

  viteFinal: async (viteConfig) => {
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: {
        ...(viteConfig.resolve?.alias as Record<string, string>),
        '@': fileURLToPath(new URL('..', import.meta.url)),
      },
    };
    return viteConfig;
  },

  docs: {},
};

export default config;
