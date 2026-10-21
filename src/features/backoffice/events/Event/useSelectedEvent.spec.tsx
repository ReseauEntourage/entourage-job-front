import { renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Api } from '@/src/api';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { useSelectedEvent, useSelectSelectedEvent } from './useSelectedEvent';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/api');

const setup = <T,>(hook: () => T, store = createTestStore()) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { store, ...renderHook(hook, { wrapper }) };
};

describe('useSelectedEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not fetch without event id', () => {
    (useRouter as jest.Mock).mockReturnValue({ query: {} });
    const { result } = setup(() => useSelectedEvent());
    expect(Api.getEvent).not.toHaveBeenCalled();
    expect(result.current.selectedEvent).toBeNull();
  });

  it('fetches the event of the URL and exposes it', async () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { eventId: 'evt-1' } });
    (Api.getEvent as jest.Mock).mockResolvedValue({
      data: { id: 'evt-1', title: 'Atelier' },
    });
    const { result } = setup(() => useSelectedEvent());
    await waitFor(() =>
      expect(result.current.selectedEvent).toMatchObject({ title: 'Atelier' })
    );
    expect(Api.getEvent).toHaveBeenCalledWith('evt-1');
  });

  it('notifies the user when the fetch fails', async () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { eventId: 'evt-1' } });
    (Api.getEvent as jest.Mock).mockRejectedValue(new Error('boom'));
    const { store } = setup(() => useSelectedEvent());
    await waitFor(() =>
      expect(store.getState().notifications.notifications).toHaveLength(1)
    );
    expect(store.getState().notifications.notifications[0]).toMatchObject({
      type: 'danger',
      message: 'Une erreur est survenue',
    });
  });
});

describe('useSelectSelectedEvent', () => {
  it('throws when no event is selected', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => setup(() => useSelectSelectedEvent())).toThrow(
      'No selected event'
    );
  });
});
