import { renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Api } from '@/src/api';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { useEventDirectory } from './useEventDirectory';

let mockParams: any = { modes: [], eventTypes: [] };
jest.mock('./EventDirectory/useEventDirectoryQueryParams', () => ({
  useEventDirectoryQueryParams: () => mockParams,
}));
let mockAtBottom: () => void = () => {};
jest.mock('@/src/hooks/useIsAtBottom', () => ({
  useIsAtBottom: (callback: () => void) => {
    mockAtBottom = callback;
  },
}));
jest.mock('@/src/api');

const setup = () => {
  const store = createTestStore();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { store, ...renderHook(() => useEventDirectory(), { wrapper }) };
};

describe('useEventDirectory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { modes: [], eventTypes: [] };
  });

  it('is loading, then lists the fetched events', async () => {
    (Api.getAllEvents as jest.Mock).mockResolvedValue({
      data: [{ id: 'e1' }, { id: 'e2' }],
    });
    const { result } = setup();
    expect(result.current.isEventLoading).toBe(true);
    await waitFor(() => expect(result.current.events).toHaveLength(2));
    expect(result.current.isEventLoading).toBe(false);
    expect(Api.getAllEvents).toHaveBeenCalledTimes(1);
  });

  it('passes the filters of the URL to the API', async () => {
    mockParams = { modes: ['remote'], eventTypes: [], search: 'cv' };
    (Api.getAllEvents as jest.Mock).mockResolvedValue({ data: [] });
    setup();
    await waitFor(() => expect(Api.getAllEvents).toHaveBeenCalled());
    expect(Api.getAllEvents).toHaveBeenCalledWith(
      expect.objectContaining({ modes: ['remote'], search: 'cv', offset: 0 })
    );
  });

  it('notifies the user when the fetch fails', async () => {
    (Api.getAllEvents as jest.Mock).mockRejectedValue(new Error('x'));
    const { store } = setup();
    await waitFor(() =>
      expect(store.getState().notifications.notifications).toHaveLength(1)
    );
  });

  it('loads the next page at the bottom of the page, until everything is fetched', async () => {
    const page = Array.from({ length: 25 }, (_, i) => ({ id: `e${i}` }));
    (Api.getAllEvents as jest.Mock).mockResolvedValue({ data: page });
    const { result } = setup();
    await waitFor(() => expect(result.current.isEventLoading).toBe(false));
    const callsBefore = (Api.getAllEvents as jest.Mock).mock.calls.length;
    mockAtBottom();
    await waitFor(() =>
      expect((Api.getAllEvents as jest.Mock).mock.calls.length).toBeGreaterThan(
        callsBefore
      )
    );
  });

  it('does not load more once a short page proved everything is fetched', async () => {
    (Api.getAllEvents as jest.Mock).mockResolvedValue({
      data: [{ id: 'e1' }],
    });
    const { result } = setup();
    await waitFor(() => expect(result.current.isEventLoading).toBe(false));
    mockAtBottom();
    await flushPromises();
    expect(Api.getAllEvents).toHaveBeenCalledTimes(1);
  });
});
