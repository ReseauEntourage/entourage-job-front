import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useIsDev } from './useIsDev';

describe('useIsDev', () => {
  const original = process.env.NEXT_PUBLIC_ENV;
  afterEach(() => {
    process.env.NEXT_PUBLIC_ENV = original;
  });

  it('is true only for the development environment', () => {
    process.env.NEXT_PUBLIC_ENV = 'development';
    expect(renderHook(() => useIsDev()).result.current).toBe(true);

    process.env.NEXT_PUBLIC_ENV = 'production';
    expect(renderHook(() => useIsDev()).result.current).toBe(false);

    delete process.env.NEXT_PUBLIC_ENV;
    expect(renderHook(() => useIsDev()).result.current).toBe(false);
  });
});
