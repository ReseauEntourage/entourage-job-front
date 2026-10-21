import { act, renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Api } from '@/src/api';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { selectNotifications } from '@/src/use-cases/notifications';
import { profilesActions } from '@/src/use-cases/profiles';
import { useDashboardRecommendations } from './useDashboardRecommendations';

jest.mock('@/src/api');

const mockedApi = jest.mocked(Api);

// RTK Query mutation state settles over a few ticks (rejection, then status).
const settle = async () => {
  for (let i = 0; i < 3; i += 1) {
    await act(async () => {
      await flushPromises();
    });
  }
};

const setup = () => {
  const store = createTestStore();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const hook = renderHook(() => useDashboardRecommendations(), { wrapper });
  return { store, ...hook };
};

describe('useDashboardRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the recommendations on mount and exposes them', async () => {
    const recommendations = [{ id: 'rec-1' }] as any;
    mockedApi.getProfilesRecommendations.mockResolvedValue({
      data: { embeddingPending: false, recommendations, nextCursor: null },
    } as any);
    const { result } = setup();

    expect(mockedApi.getProfilesRecommendations).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(true);

    await settle();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.recommendations).toEqual(recommendations);
    expect(result.current.isEmbeddingPending).toBe(false);
  });

  it('reports a pending embedding with no recommendation', async () => {
    mockedApi.getProfilesRecommendations.mockResolvedValue({
      data: { embeddingPending: true, recommendations: [], nextCursor: null },
    } as any);
    const { result } = setup();

    await settle();

    expect(result.current.isEmbeddingPending).toBe(true);
    expect(result.current.recommendations).toEqual([]);
  });

  it('flags an error and notifies when the recommendations cannot be fetched', async () => {
    mockedApi.getProfilesRecommendations.mockRejectedValue(new Error('x'));
    const { result, store } = setup();

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isLoading).toBe(false);
    expect(selectNotifications(store.getState()).map((n) => n.message)).toEqual(
      ['Une erreur est survenue lors de la récupération des recommandations']
    );
  });

  it('flags an error and notifies when the profiles fetch fails', async () => {
    mockedApi.getProfilesRecommendations.mockResolvedValue({
      data: { embeddingPending: false, recommendations: [], nextCursor: null },
    } as any);
    mockedApi.getAllUsersProfiles.mockRejectedValue(new Error('x'));
    const { result, store } = setup();
    await settle();

    await act(async () => {
      store.dispatch(
        profilesActions.fetchProfilesRequested({ offset: 0 } as any)
      );
      await flushPromises();
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(
      selectNotifications(store.getState()).map((n) => n.message)
    ).toContain('Une erreur est survenue lors de la récupération des profils');
  });

  it('resets the recommendations on unmount', async () => {
    mockedApi.getProfilesRecommendations.mockResolvedValue({
      data: {
        embeddingPending: false,
        recommendations: [{ id: 'rec-1' }],
        nextCursor: null,
      },
    } as any);
    const { store, unmount } = setup();
    await settle();
    expect(store.getState().profiles.profilesRecommendations).toHaveLength(1);

    unmount();

    expect(store.getState().profiles.profilesRecommendations).toEqual([]);
  });
});
