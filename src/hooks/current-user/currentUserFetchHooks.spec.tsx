jest.mock('@/src/api');

import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import {
  createTestStore,
  TestStore,
} from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import { useCurrentUserAchievements } from './useCurrentUserAchievements';
import { useCurrentUserCompany } from './useCurrentUserCompany';
import { useCurrentUserOrganization } from './useCurrentUserOrganization';
import { useCurrentUserProfile } from './useCurrentUserProfile';
import { useCurrentUserProfileComplete } from './useCurrentUserProfileComplete';
import { useCurrentUserReadDocuments } from './useCurrentUserReadDocuments';
import { useCurrentUserReferredUsers } from './useCurrentUserReferredUsers';
import { useCurrentUserReferrer } from './useCurrentUserReferrer';
import { useCurrentUserStats } from './useCurrentUserStats';

const mockedApi = getMockedApi();

type Case = {
  name: string;
  useHook: () => unknown;
  apiMethod: keyof typeof mockedApi;
  payload: unknown;
  // API response body when it differs from the stored data
  response?: unknown;
};

// Every hook follows the same contract: fetch on mount while the request is
// idle (or failed), expose the slice data, never refetch once succeeded.
const cases: Case[] = [
  {
    name: 'useCurrentUserAchievements',
    useHook: useCurrentUserAchievements,
    apiMethod: 'getCurrentAchievements',
    payload: [{ id: 'a1' }],
    response: { achievements: [{ id: 'a1' }] },
  },
  {
    name: 'useCurrentUserCompany',
    useHook: useCurrentUserCompany,
    apiMethod: 'getCurrentCompany',
    payload: { id: 'c1', name: 'ACME' },
  },
  {
    name: 'useCurrentUserOrganization',
    useHook: useCurrentUserOrganization,
    apiMethod: 'getCurrentOrganization',
    payload: { id: 'o1' },
  },
  {
    name: 'useCurrentUserProfile',
    useHook: useCurrentUserProfile,
    apiMethod: 'getCurrentProfile',
    payload: { id: 'p1' },
  },
  {
    name: 'useCurrentUserProfileComplete',
    useHook: useCurrentUserProfileComplete,
    apiMethod: 'getCurrentProfileComplete',
    payload: { id: 'p1', description: 'full' },
  },
  {
    name: 'useCurrentUserReadDocuments',
    useHook: useCurrentUserReadDocuments,
    apiMethod: 'getCurrentReadDocuments',
    payload: [{ documentName: 'Charte', createdAt: '2026-01-01' }],
    response: {
      readDocuments: [{ documentName: 'Charte', createdAt: '2026-01-01' }],
    },
  },
  {
    name: 'useCurrentUserReferredUsers',
    useHook: useCurrentUserReferredUsers,
    apiMethod: 'getCurrentReferredUsers',
    payload: [{ id: 'r1' }],
    response: { referredCandidates: [{ id: 'r1' }] },
  },
  {
    name: 'useCurrentUserReferrer',
    useHook: useCurrentUserReferrer,
    apiMethod: 'getCurrentReferrer',
    payload: { id: 'ref1' },
  },
  {
    name: 'useCurrentUserStats',
    useHook: useCurrentUserStats,
    apiMethod: 'getCurrentStats',
    payload: { profileViews: 3 },
  },
];

function wrapperFor(store: TestStore) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

cases.forEach(({ name, useHook, apiMethod, payload, response }) =>
  describe(name, () => {
    const api = () => mockedApi[apiMethod] as unknown as jest.Mock;

    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined);
      seedAccessToken('token-123');
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
      localStorage.clear();
    });

    it('fetches on mount and returns the loaded data', async () => {
      api().mockResolvedValue({ data: response ?? payload });
      const store = createTestStore();

      const { result } = renderHook(() => useHook(), {
        wrapper: wrapperFor(store),
      });
      await flushPromises();

      expect(api()).toHaveBeenCalledTimes(1);
      expect(result.current).toEqual(payload);
    });

    it('does not fetch again on remount once the data has been loaded', async () => {
      api().mockResolvedValue({ data: response ?? payload });
      const store = createTestStore();

      const first = renderHook(() => useHook(), { wrapper: wrapperFor(store) });
      await flushPromises();
      first.unmount();

      const second = renderHook(() => useHook(), {
        wrapper: wrapperFor(store),
      });
      await flushPromises();

      expect(api()).toHaveBeenCalledTimes(1);
      expect(second.result.current).toEqual(payload);
    });

    it('does not call the API when there is no access token', async () => {
      localStorage.clear();
      const store = createTestStore();

      renderHook(() => useHook(), { wrapper: wrapperFor(store) });
      await flushPromises();

      expect(api()).not.toHaveBeenCalled();
    });
  })
);
