import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

/* =======================
   TypeScript
======================= */
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

/* =======================
   React / Next
======================= */
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import next from '@next/eslint-plugin-next';

/* =======================
   Tooling
======================= */
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import typedReduxSaga from '@jambit/eslint-plugin-typed-redux-saga';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import pluginJest from 'eslint-plugin-jest';

export default defineConfig([
  /* ==================================================
     Global ignores (ex .eslintignore)
  ================================================== */
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'public/**',
      'coverage/**',
      'src/styles/dist/**',
      '*.config.js',
      '*.config.mjs',
      'server-next.js',
      '.lintstagedrc.js',
      '!/.storybook/**',
    ],
  },

  /* ==================================================
     Base ESLint rules
  ================================================== */
  js.configs.recommended,

  /* ==================================================
     Main config (JS / TS / React)
  ================================================== */
  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./src/tsconfig.json', './cypress/tsconfig.json'],
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      prettier,
      '@jambit/typed-redux-saga': typedReduxSaga,
      '@next/next': next,
      'jsx-a11y': jsxA11y,
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.base.json',
        },
        node: {
          paths: ['.'],
        },
      },
    },

    rules: {
      /* =======================
         Plain JS
      ======================= */
      'no-unused-vars': 'off',
      'arrow-body-style': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'object-curly-newline': 'off',
      'no-useless-constructor': 'off',
      'class-methods-use-this': 'off',
      'max-classes-per-file': 'off',
      camelcase: 'off',
      curly: 'warn',
      strict: ['error', 'global'],
      'prefer-promise-reject-errors': 'off',
      'no-return-assign': 'off',
      'no-case-declarations': 'off',
      'no-param-reassign': 'off',
      'consistent-return': 'off',
      'no-underscore-dangle': 'off',

      /* =======================
         React
      ======================= */
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'error',
      'react/no-array-index-key': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-wrap-multilines': 'off',
      'react/require-default-props': 'off',
      'react/static-property-placement': ['warn', 'static getter'],
      'react/jsx-filename-extension': [
        'warn',
        { extensions: ['.js', '.jsx', '.tsx'] },
      ],

      /* =======================
         React Hooks
      ======================= */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      /* =======================
         JSX A11Y (désactivées comme avant)
      ======================= */
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/control-has-associated-label': 'off',
      'jsx-a11y/aria-role': [
        'error',
        {
          allowedInvalidRoles: ['Candidat'],
          ignoreNonDOM: true,
        },
      ],

      /* =======================
         Prettier
      ======================= */
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],

      /* =======================
         TypeScript
      ======================= */
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^(_action|_state)',
        },
      ],
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',

      /* =======================
         Imports
      ======================= */
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
        },
      ],
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error',
      'import/no-named-as-default': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            'tests/**/*',
            '**/__tests__/**',
            '**/__mocks__/**',
            '**/*{.,_}{test,spec}.{js,jsx,ts,tsx}',
            '**/*.stories.*',
            '**/.storybook/**/*.*',
          ],
        },
      ],
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          alphabetize: { order: 'asc' },
          pathGroups: [
            { pattern: 'src/**', group: 'parent' },
            { pattern: 'tests/**', group: 'parent' },
          ],
        },
      ],
    },
  },

  /* ==================================================
     Overrides
  ================================================== */

  // Storybook
  {
    files: ['src/**/*.stories.tsx', '.storybook/**/*'],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // Cypress
  {
    files: ['cypress/**/*'],
    languageOptions: {
      parserOptions: {
        project: './cypress/tsconfig.json',
      },
    },
  },

  // Next.js pages
  {
    files: ['src/pages/**'],
    rules: {
      'import/no-default-export': 'off',
      'import/prefer-default-export': 'error',
    },
  },

  // typed-redux-saga
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      '@jambit/typed-redux-saga/use-typed-effects': 'error',
      '@jambit/typed-redux-saga/delegate-effects': 'error',
    },
  },

  // E2E tests
  {
    // update this to match your test files
    files: ['**/*.spec.ts', '**/*.test.js'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
]);
