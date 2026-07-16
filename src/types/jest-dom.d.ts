import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

// Specs import `expect` from the `expect` package directly (see EmailOtpInput.spec.tsx)
// to avoid the ambient `expect` global collision between Cypress and Jest types.
// jest-dom only augments `jest.Matchers`, so we re-augment the `expect` package's
// own `Matchers` interface here for that import style to see jest-dom matchers.
declare module 'expect' {
  interface Matchers<R extends void | Promise<void>, T = unknown>
    extends TestingLibraryMatchers<T, R> {}
}
