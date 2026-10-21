import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { User } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { currentUserActions } from '@/src/use-cases/current-user';
import { useAuthenticatedUser } from './useAuthenticatedUser';

const render = (user?: User) => {
  const store = createTestStore();
  if (user) {
    store.dispatch(currentUserActions.fetchUserSucceeded(user));
  }
  return () =>
    renderHook(() => useAuthenticatedUser(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      ),
    });
};

describe('useAuthenticatedUser', () => {
  it('returns the current user', () => {
    const user = { id: 'u1' } as User;
    expect(render(user)().result.current).toEqual(user);
  });

  it('throws when nobody is authenticated', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    expect(render()).toThrow('User is not authenticated');
    consoleError.mockRestore();
  });
});
