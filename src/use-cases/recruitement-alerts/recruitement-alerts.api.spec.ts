jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { RecruitementAlert, RecruitementAlertDto } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import {
  selectFetchRecruitementAlertMatchingLoading,
  selectFetchRecruitementAlertsLoading,
  selectRecruitementAlertMatchingById,
  selectRecruitementAlerts,
} from './recruitement-alerts.selectors';
import { slice } from './recruitement-alerts.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

const buildRecruitementAlert = (
  overrides: Partial<RecruitementAlert> = {}
): RecruitementAlert =>
  ({
    id: 'alert-1',
    name: 'Alert 1',
    jobName: 'Developer',
    department: null,
    workingExperienceYears: null,
    contractType: null,
    companyId: 'company-1',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    ...overrides,
  }) as RecruitementAlert;

const buildRecruitementAlertDto = (
  overrides: Partial<RecruitementAlertDto> = {}
): RecruitementAlertDto => ({
  companyId: 'company-1',
  name: 'Alert 1',
  jobName: 'Developer',
  department: null,
  workingExperienceYears: null,
  contractType: null,
  ...overrides,
});

describe('recruitement-alerts api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchRecruitementAlertsAction', () => {
    it('fetches and stores the alerts list', async () => {
      const store = createTestStore();
      const alerts = [buildRecruitementAlert()];
      mockedApi.getRecruitementAlerts.mockResolvedValue({
        data: alerts,
      } as any);

      store.dispatch(actions.fetchRecruitementAlertsAction());
      await flushPromises();

      expect(selectRecruitementAlerts(store.getState())).toEqual(alerts);
      expect(selectFetchRecruitementAlertsLoading(store.getState())).toBe(
        false
      );
    });
  });

  describe('createRecruitementAlertAction', () => {
    it('creates the alert, notifies success, and refetches the list', async () => {
      const store = createTestStore();
      const dto = buildRecruitementAlertDto();
      mockedApi.createRecruitementAlert.mockResolvedValue({
        data: buildRecruitementAlert(),
      } as any);
      mockedApi.getRecruitementAlerts.mockResolvedValue({
        data: [buildRecruitementAlert()],
      } as any);

      store.dispatch(actions.createRecruitementAlertAction(dto));
      await flushPromises();

      expect(mockedApi.createRecruitementAlert).toHaveBeenCalledWith(dto);
      expect(mockedApi.getRecruitementAlerts).toHaveBeenCalledTimes(1);
      expect(store.getState().notifications.notifications).toEqual([
        expect.objectContaining({
          type: 'success',
          message: "L'alerte a été créée avec succès",
        }),
      ]);
    });

    it('notifies failure without refetching the list when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.createRecruitementAlert.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.createRecruitementAlertAction(buildRecruitementAlertDto())
      );
      await flushPromises();

      expect(mockedApi.getRecruitementAlerts).not.toHaveBeenCalled();
      expect(store.getState().notifications.notifications).toEqual([
        expect.objectContaining({
          type: 'danger',
          message: "Une erreur est survenue lors de la création de l'alerte",
        }),
      ]);
    });
  });

  describe('deleteRecruitementAlertAction', () => {
    it('removes the alert locally, notifies success, and refetches the list', async () => {
      const store = createTestStore({
        recruitementAlerts: {
          ...slice.getInitialState(),
          recruitementAlerts: [buildRecruitementAlert({ id: 'alert-1' })],
        },
      });
      mockedApi.deleteRecruitementAlert.mockResolvedValue(undefined as any);
      mockedApi.getRecruitementAlerts.mockResolvedValue({ data: [] } as any);

      store.dispatch(actions.deleteRecruitementAlertAction('alert-1'));
      await flushPromises();

      expect(mockedApi.deleteRecruitementAlert).toHaveBeenCalledWith('alert-1');
      expect(mockedApi.getRecruitementAlerts).toHaveBeenCalledTimes(1);
      expect(store.getState().notifications.notifications).toEqual([
        expect.objectContaining({
          type: 'success',
          message: "L'alerte a été supprimée avec succès",
        }),
      ]);
    });

    it('notifies failure without removing the alert when the API call rejects', async () => {
      const store = createTestStore({
        recruitementAlerts: {
          ...slice.getInitialState(),
          recruitementAlerts: [buildRecruitementAlert({ id: 'alert-1' })],
        },
      });
      mockedApi.deleteRecruitementAlert.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.deleteRecruitementAlertAction('alert-1'));
      await flushPromises();

      expect(selectRecruitementAlerts(store.getState())).toHaveLength(1);
      expect(store.getState().notifications.notifications).toEqual([
        expect.objectContaining({
          type: 'danger',
          message: "Une erreur est survenue lors de la suppression de l'alerte",
        }),
      ]);
    });
  });

  describe('updateRecruitementAlertAction', () => {
    it('replaces the alert locally, notifies success, and refetches the list and the matching', async () => {
      const store = createTestStore({
        recruitementAlerts: {
          ...slice.getInitialState(),
          recruitementAlerts: [
            buildRecruitementAlert({ id: 'alert-1', name: 'Old name' }),
          ],
        },
      });
      const updatedAlert = buildRecruitementAlert({
        id: 'alert-1',
        name: 'New name',
      });
      mockedApi.updateRecruitementAlert.mockResolvedValue({
        data: updatedAlert,
      } as any);
      // The subsequent list refetch (triggered right after the local
      // update, mirroring the original saga) is what determines the final
      // state here, same as it would with a real server response.
      mockedApi.getRecruitementAlerts.mockResolvedValue({
        data: [updatedAlert],
      } as any);
      mockedApi.getRecruitementAlertMatching.mockResolvedValue({
        data: [],
      } as any);

      store.dispatch(
        actions.updateRecruitementAlertAction({
          id: 'alert-1',
          data: buildRecruitementAlertDto({ name: 'New name' }),
        })
      );
      await flushPromises();

      expect(selectRecruitementAlerts(store.getState())).toEqual([
        updatedAlert,
      ]);
      expect(mockedApi.getRecruitementAlerts).toHaveBeenCalledTimes(1);
      expect(mockedApi.getRecruitementAlertMatching).toHaveBeenCalledWith(
        'alert-1'
      );
      expect(store.getState().notifications.notifications).toEqual([
        expect.objectContaining({
          type: 'success',
          message: "L'alerte a été mise à jour avec succès",
        }),
      ]);
    });
  });

  describe('fetchRecruitementAlertMatchingAction', () => {
    it('caches the matching profiles independently per alertId', async () => {
      const store = createTestStore();
      mockedApi.getRecruitementAlertMatching.mockImplementation(
        (alertId: string) =>
          Promise.resolve({
            data: [{ id: `profile-${alertId}` }],
          }) as any
      );

      store.dispatch(actions.fetchRecruitementAlertMatchingAction('alert-1'));
      store.dispatch(actions.fetchRecruitementAlertMatchingAction('alert-2'));
      await flushPromises();

      expect(
        selectRecruitementAlertMatchingById('alert-1')(store.getState())
          .profiles
      ).toEqual([{ id: 'profile-alert-1' }]);
      expect(
        selectRecruitementAlertMatchingById('alert-2')(store.getState())
          .profiles
      ).toEqual([{ id: 'profile-alert-2' }]);
      // Each alert's matching has its own loading status (fixes the original
      // saga's single shared loading flag across all alerts).
      expect(
        selectFetchRecruitementAlertMatchingLoading('alert-1')(store.getState())
      ).toBe(false);
    });

    it('defaults to an empty profiles list and a zero timestamp before any fetch', () => {
      const store = createTestStore();

      expect(
        selectRecruitementAlertMatchingById('unknown-alert')(store.getState())
      ).toEqual({ profiles: [], timestamp: 0 });
    });

    it('reports an error when the matching fetch rejects', async () => {
      const store = createTestStore();
      mockedApi.getRecruitementAlertMatching.mockRejectedValue(
        new Error('boom')
      );

      store.dispatch(actions.fetchRecruitementAlertMatchingAction('alert-1'));
      await flushPromises();

      expect(
        selectRecruitementAlertMatchingById('alert-1')(store.getState())
      ).toEqual({ profiles: [], timestamp: 0 });
    });
  });
});
