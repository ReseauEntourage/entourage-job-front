const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  // jest-environment-jsdom resolves the "browser" package export condition
  // by default, which points some packages (e.g. @react-hook/window-size,
  // @react-hook/debounce) at untranspiled ESM builds Jest can't parse.
  // Disabling it falls back to the "require"/CJS build for every package.
  // This only surfaces once a test imports the full use-cases registry
  // (e.g. the shared Redux test store), which transitively loads UI
  // components via onboardingOld's saga -> selectors -> utils chain.
  testEnvironmentOptions: { customExportConditions: [] },
  moduleNameMapper: {},
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
const jestConfig = async () => {
  const nextJestConfig = await createJestConfig(customJestConfig)();
  return {
    ...nextJestConfig,
    moduleNameMapper: {
      // Workaround to put our SVG stub first
      '\\.svg$': '<rootDir>/__mocks__/svg.js',
      ...nextJestConfig.moduleNameMapper,
      // next/jest's SWC transform only resolves the "@/*" tsconfig path when
      // "baseUrl" is also set. tsconfig.base.json has no baseUrl (Turbopack
      // resolves "@/*" from "paths" alone, unlike next/jest's transform), so
      // the mapping is declared explicitly here to keep Jest working.
      '^@/(.*)$': '<rootDir>/$1',
    },
  };
};

module.exports = jestConfig;
