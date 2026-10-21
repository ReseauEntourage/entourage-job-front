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
import { useUpdateProfile } from './useUpdateProfile';

const mockedApi = getMockedApi();
const user = { id: 'u1' } as User;

function setup(hookUser: User = user) {
  const store = createTestStore();
  const dispatch = jest.spyOn(store, 'dispatch');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const hook = renderHook(() => useUpdateProfile(hookUser), { wrapper });
  return { dispatch, ...hook };
}

describe('useUpdateProfile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches updateProfileRequested with the user id and the profile data', () => {
    const { dispatch, result } = setup();
    act(() => result.current.updateUserProfile({ description: 'hello' }));

    expect(dispatch).toHaveBeenCalledWith(
      currentUserActions.updateProfileRequested({
        userId: 'u1',
        userProfile: { description: 'hello' },
      })
    );
    expect(result.current.closeModal).toBe(false);
  });

  it('closes the modal without dispatching when there is nothing to update', () => {
    const { dispatch, result } = setup();
    act(() => result.current.updateUserProfile({}));

    expect(dispatch).not.toHaveBeenCalled();
    expect(result.current.closeModal).toBe(true);
  });

  it('closes the modal without dispatching when the user has no id', () => {
    const { dispatch, result } = setup({} as User);
    act(() => result.current.updateUserProfile({ description: 'x' }));

    expect(dispatch).not.toHaveBeenCalled();
    expect(result.current.closeModal).toBe(true);
  });

  it('closes the modal once the update has succeeded', async () => {
    mockedApi.putUserProfile.mockResolvedValue({
      data: { description: 'hello' },
    } as never);
    const { result } = setup();

    act(() => result.current.updateUserProfile({ description: 'hello' }));
    await act(flushPromises);

    expect(mockedApi.putUserProfile).toHaveBeenCalledWith('u1', {
      description: 'hello',
    });
    expect(result.current.closeModal).toBe(true);
  });

  it('keeps the modal open when the update fails', async () => {
    mockedApi.putUserProfile.mockRejectedValue(new Error('boom'));
    const { result } = setup();

    act(() => result.current.updateUserProfile({ description: 'hello' }));
    await act(flushPromises);

    expect(result.current.closeModal).toBe(false);
  });
});
