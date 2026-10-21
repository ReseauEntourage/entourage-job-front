import { renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Api } from '@/src/api';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { currentUserActions } from '@/src/use-cases/current-user';
import { useConfirmationToaster } from './useConfirmationToaster';

jest.mock('@/src/api');

const setup = () => {
  // updateUserSucceeded asserts an authenticated user
  const store = createTestStore({
    currentUser: {
      ...createTestStore().getState().currentUser,
      user: { id: 'u1', firstName: 'Old' } as any,
    },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const hook = renderHook(() => useConfirmationToaster(), { wrapper });
  const messages = () =>
    store.getState().notifications.notifications.map((n: any) => ({
      type: n.type,
      message: n.message,
    }));
  return { store, messages, ...hook };
};

describe('useConfirmationToaster', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stays silent until something is saved', () => {
    const { messages } = setup();
    expect(messages()).toEqual([]);
  });

  it('confirms a profile update', async () => {
    (Api.putUserProfile as jest.Mock).mockResolvedValue({ data: {} });
    const { store, messages } = setup();
    store.dispatch(
      currentUserActions.updateProfileRequested({
        userId: 'u1',
        userProfile: {},
      } as any)
    );
    await waitFor(() => expect(messages()).toHaveLength(1));
    expect(messages()[0]).toEqual({
      type: 'success',
      message: 'La modification du profil a bien été enregistrée',
    });
  });

  it('reports a failed profile update', async () => {
    (Api.putUserProfile as jest.Mock).mockRejectedValue(new Error('x'));
    const { store, messages } = setup();
    store.dispatch(
      currentUserActions.updateProfileRequested({
        userId: 'u1',
        userProfile: {},
      } as any)
    );
    await waitFor(() => expect(messages()).toHaveLength(1));
    expect(messages()[0]).toEqual({
      type: 'danger',
      message: 'Une erreur est survenue lors de la modification',
    });
  });

  it('confirms a personal information update', async () => {
    (Api.putUser as jest.Mock).mockResolvedValue({ data: {} });
    const { store, messages } = setup();
    store.dispatch(
      currentUserActions.updateUserRequested({
        userId: 'u1',
        user: { firstName: 'Awa' },
      } as any)
    );
    await waitFor(() => expect(messages()).toHaveLength(1));
    expect(messages()[0]).toEqual({
      type: 'success',
      message: 'Vos informations personnelles ont bien été mises à jour',
    });
  });

  it('reports a failed personal information update', async () => {
    (Api.putUser as jest.Mock).mockRejectedValue(new Error('x'));
    const { store, messages } = setup();
    store.dispatch(
      currentUserActions.updateUserRequested({
        userId: 'u1',
        user: { firstName: 'Awa' },
      } as any)
    );
    await waitFor(() => expect(messages()).toHaveLength(1));
    expect(messages()[0].type).toBe('danger');
  });
});
