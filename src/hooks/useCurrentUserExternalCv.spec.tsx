import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { slice } from '@/src/use-cases/current-user/current-user.slice';
import { useCurrentUserExternalCv } from './useCurrentUserExternalCv';

const render = (externalCv: string | null) => {
  const store = createTestStore({
    currentUser: { ...slice.getInitialState(), externalCv },
  });
  return renderHook(() => useCurrentUserExternalCv(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  });
};

describe('useCurrentUserExternalCv', () => {
  it('returns the external CV from the current user state', () => {
    expect(render('cv.pdf').result.current).toBe('cv.pdf');
  });

  it('returns null when there is none', () => {
    expect(render(null).result.current).toBeNull();
  });
});
