jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import {
  ElearningCompletion,
  ElearningUnit,
} from '@/src/features/backoffice/elearning/elearning.types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import { authenticationActions } from '@/src/use-cases/authentication';
import { fetchUserSelectors } from '@/src/use-cases/current-user';
import { elearningApi } from './elearning.api';
import { slice } from './elearning.slice';

const mockedApi = getMockedApi();

const buildUnit = (overrides: Partial<ElearningUnit> = {}): ElearningUnit => ({
  id: 'unit-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  title: 'Unit 1',
  description: 'Description',
  durationMinutes: 10,
  videoUrl: 'https://example.com/video.mp4',
  questions: [],
  roles: [],
  userCompletions: [],
  ...overrides,
});

const buildCompletion = (
  overrides: Partial<ElearningCompletion> = {}
): ElearningCompletion => ({
  id: 'completion-1',
  userId: 'user-1',
  unitId: 'unit-1',
  validatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('elearning api', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('getElearningUnits', () => {
    it('stores the returned units in the query cache', async () => {
      const store = createTestStore();
      const units = [buildUnit()];
      mockedApi.getAllElearningUnits.mockResolvedValue({ data: units } as any);

      await store.dispatch(
        elearningApi.endpoints.getElearningUnits.initiate(UserRoles.CANDIDATE)
      );

      const result = elearningApi.endpoints.getElearningUnits.select(
        UserRoles.CANDIDATE
      )(store.getState());
      expect(result.data).toEqual(units);
      expect(result.status).toBe('fulfilled');
    });

    it('surfaces the error when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getAllElearningUnits.mockRejectedValue(new Error('boom'));

      await store.dispatch(
        elearningApi.endpoints.getElearningUnits.initiate(UserRoles.CANDIDATE)
      );

      const result = elearningApi.endpoints.getElearningUnits.select(
        UserRoles.CANDIDATE
      )(store.getState());
      expect(result.status).toBe('rejected');
    });
  });

  describe('postElearningCompletion', () => {
    it('patches the cached unit, marks the mutation as fulfilled and re-fetches the current user', async () => {
      seedAccessToken('token-123');
      const store = createTestStore();
      mockedApi.getAllElearningUnits.mockResolvedValue({
        data: [buildUnit({ id: 'unit-1', userCompletions: [] })],
      } as any);
      await store.dispatch(
        elearningApi.endpoints.getElearningUnits.initiate(UserRoles.CANDIDATE)
      );

      const completion = buildCompletion({ unitId: 'unit-1' });
      mockedApi.postElearningCompletion.mockResolvedValue({
        data: completion,
      } as any);
      const refreshedUser = { id: 'user-1' } as any;
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: refreshedUser,
      } as any);

      const mutationResult = await store.dispatch(
        elearningApi.endpoints.postElearningCompletion.initiate({
          unitId: 'unit-1',
          role: UserRoles.CANDIDATE,
        })
      );
      await flushPromises();

      expect(mutationResult).not.toHaveProperty('error');
      const cached = elearningApi.endpoints.getElearningUnits.select(
        UserRoles.CANDIDATE
      )(store.getState());
      expect(cached.data?.[0].userCompletions).toEqual([completion]);
      expect(store.getState().currentUser.user).toEqual(refreshedUser);
    });

    it('does not re-fetch the current user when the API call rejects', async () => {
      seedAccessToken('token-123');
      const store = createTestStore();
      mockedApi.postElearningCompletion.mockRejectedValue(new Error('boom'));

      const mutationResult = await store.dispatch(
        elearningApi.endpoints.postElearningCompletion.initiate({
          unitId: 'unit-1',
          role: UserRoles.CANDIDATE,
        })
      );
      await flushPromises();

      expect(mutationResult).toHaveProperty('error');
      expect(mockedApi.getCurrentIdentity).not.toHaveBeenCalled();
      expect(fetchUserSelectors.selectIsFetchUserIdle(store.getState())).toBe(
        true
      );
    });
  });

  describe('logoutSucceeded (cross-domain)', () => {
    it('resets the elearning slice and clears the query cache when authentication logs out', async () => {
      const store = createTestStore({
        elearning: { ...slice.getInitialState(), isLoading: true },
      });
      mockedApi.getAllElearningUnits.mockResolvedValue({
        data: [buildUnit()],
      } as any);
      await store.dispatch(
        elearningApi.endpoints.getElearningUnits.initiate(UserRoles.CANDIDATE)
      );

      store.dispatch(authenticationActions.logoutSucceeded());
      await flushPromises();

      expect(store.getState().elearning).toEqual(slice.getInitialState());
      expect(
        elearningApi.endpoints.getElearningUnits.select(UserRoles.CANDIDATE)(
          store.getState()
        ).data
      ).toBeUndefined();
    });
  });
});
