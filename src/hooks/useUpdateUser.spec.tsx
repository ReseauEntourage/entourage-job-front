jest.mock('@/src/api');

import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { User } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { currentUserActions } from '@/src/use-cases/current-user';
import { useUpdateUser } from './useUpdateUser';

const mockedApi = getMockedApi();
const user = { id: 'u1', email: 'a@b.fr', firstName: 'A' } as User;

function setup(hookUser: User = user) {
  const store = createTestStore();
  store.dispatch(currentUserActions.fetchUserSucceeded(user));
  const dispatch = jest.spyOn(store, 'dispatch');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const hook = renderHook(() => useUpdateUser(hookUser), { wrapper });
  return { store, dispatch, ...hook };
}

describe('useUpdateUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches updateUserRequested with the user id and the new data', () => {
    const { dispatch, result } = setup();
    act(() => result.current.updateUser({ firstName: 'B' }));

    expect(dispatch).toHaveBeenCalledWith(
      currentUserActions.updateUserRequested({
        userId: 'u1',
        user: { firstName: 'B' },
      })
    );
    expect(result.current.closeModal).toBe(false);
  });

  it('closes the modal without dispatching when there is nothing to update', () => {
    const { dispatch, result } = setup();
    act(() => result.current.updateUser({}));

    expect(dispatch).not.toHaveBeenCalled();
    expect(result.current.closeModal).toBe(true);
  });

  it('closes the modal without dispatching when the user has no id', () => {
    const { dispatch, result } = setup({ ...user, id: '' });
    act(() => result.current.updateUser({ firstName: 'B' }));

    expect(dispatch).not.toHaveBeenCalled();
    expect(result.current.closeModal).toBe(true);
  });

  it('closes the modal once the update has succeeded', async () => {
    mockedApi.putUser.mockResolvedValue({} as never);
    const { result, store } = setup();

    act(() => result.current.updateUser({ firstName: 'B' }));
    await act(flushPromises);

    expect(mockedApi.putUser).toHaveBeenCalledWith('u1', { firstName: 'B' });
    expect(result.current.closeModal).toBe(true);
    expect(store.getState().currentUser.user?.firstName).toBe('B');
  });

  it('keeps the modal open when the update fails', async () => {
    mockedApi.putUser.mockRejectedValue(new Error('boom'));
    const { result } = setup();

    act(() => result.current.updateUser({ firstName: 'B' }));
    await act(flushPromises);

    expect(result.current.closeModal).toBe(false);
  });

  it('dispatches updateUserCompanyRequested with the company name', () => {
    const { dispatch, result } = setup();
    act(() => result.current.updateUserCompany('ACME'));

    expect(dispatch).toHaveBeenCalledWith(
      currentUserActions.updateUserCompanyRequested({ companyName: 'ACME' })
    );
  });

  it('does not update the company without a user id', () => {
    const { dispatch, result } = setup({ ...user, id: '' });
    act(() => result.current.updateUserCompany('ACME'));
    expect(dispatch).not.toHaveBeenCalled();
  });
});
