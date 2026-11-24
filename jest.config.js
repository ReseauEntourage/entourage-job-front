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
    // uuid >= 12 only ships ESM: next/jest ignores node_modules for
    // transforms, so add uuid to its allow-list (the packages it transforms).
    transformIgnorePatterns: (nextJestConfig.transformIgnorePatterns || []).map(
      (pattern) =>
        pattern.replaceAll(
          'react-lite-youtube-embed',
          'uuid|react-lite-youtube-embed'
        )
    ),
    moduleNameMapper: {
      // Workaround to put our SVG stub first
      '\\.svg$': '<rootDir>/__mocks__/svg.js',
      // Swiper only ships ESM builds
      '^swiper/react$': '<rootDir>/__mocks__/swiper-react.js',
      '^swiper/modules$': '<rootDir>/__mocks__/swiper-modules.js',
      '^swiper/css(/.*)?$': '<rootDir>/__mocks__/swiper-css.js',
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
