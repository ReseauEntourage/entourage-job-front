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
import { slice } from './elearning.slice';

const { actions } = slice;
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

describe('elearning saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchElearningUnitsRequested', () => {
    it('stores the returned units on success', async () => {
      const store = createTestStore();
      const units = [buildUnit()];
      mockedApi.getAllElearningUnits.mockResolvedValue({ data: units } as any);

      store.dispatch(actions.fetchElearningUnitsRequested(UserRoles.CANDIDATE));
      await flushPromises();

      expect(store.getState().elearning.elearningUnits).toEqual(units);
      expect(store.getState().elearning.fetchElearningUnits.status).toBe(
        'SUCCEEDED'
      );
    });

    it('dispatches fetchElearningUnitsFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getAllElearningUnits.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchElearningUnitsRequested(UserRoles.CANDIDATE));
      await flushPromises();

      expect(store.getState().elearning.fetchElearningUnits.status).toBe(
        'FAILED'
      );
    });
  });

  describe('postElearningCompletionRequested', () => {
    it('stores the completion, marks the request as succeeded and re-fetches the current user', async () => {
      seedAccessToken('token-123');
      const store = createTestStore({
        elearning: {
          ...slice.getInitialState(),
          elearningUnits: [buildUnit({ id: 'unit-1', userCompletions: [] })],
        },
      });
      const completion = buildCompletion({ unitId: 'unit-1' });
      mockedApi.postElearningCompletion.mockResolvedValue({
        data: completion,
      } as any);
      const refreshedUser = { id: 'user-1' } as any;
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: refreshedUser,
      } as any);

      store.dispatch(
        actions.postElearningCompletionRequested({ unitId: 'unit-1' })
      );
      await flushPromises();

      expect(store.getState().elearning.postElearningCompletion.status).toBe(
        'SUCCEEDED'
      );
      expect(
        store.getState().elearning.elearningUnits[0].userCompletions
      ).toEqual([completion]);
      expect(store.getState().currentUser.user).toEqual(refreshedUser);
    });

    it('dispatches postElearningCompletionFailed and does not re-fetch the current user when the API call rejects', async () => {
      seedAccessToken('token-123');
      const store = createTestStore();
      mockedApi.postElearningCompletion.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.postElearningCompletionRequested({ unitId: 'unit-1' })
      );
      await flushPromises();

      expect(store.getState().elearning.postElearningCompletion.status).toBe(
        'FAILED'
      );
      expect(mockedApi.getCurrentIdentity).not.toHaveBeenCalled();
      expect(store.getState().currentUser.fetchUser.status).toBe('IDLE');
    });
  });

  describe('logoutSucceeded (cross-domain)', () => {
    it('resets the elearning slice when authentication logs out', async () => {
      const store = createTestStore({
        elearning: {
          ...slice.getInitialState(),
          elearningUnits: [buildUnit()],
          isLoading: true,
        },
      });

      store.dispatch(authenticationActions.logoutSucceeded());
      await flushPromises();

      expect(store.getState().elearning).toEqual(slice.getInitialState());
    });
  });
});
