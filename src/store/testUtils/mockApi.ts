import { Api } from '@/src/api';

/**
 * Typed accessor for the auto-mocked `Api` singleton (`jest.mock('@/src/api')`
 * auto-mocks every instance method). Callers must still call
 * `jest.mock('@/src/api')` themselves at the top of their spec file so Jest
 * can hoist it; this only removes the repeated `Api.x as jest.Mock` casts.
 */
export function getMockedApi() {
  // eslint-disable-next-line no-undef -- `jest` global is only declared for *.spec.ts files by this repo's eslint config; this helper is imported from within those files at runtime.
  return jest.mocked(Api);
}
