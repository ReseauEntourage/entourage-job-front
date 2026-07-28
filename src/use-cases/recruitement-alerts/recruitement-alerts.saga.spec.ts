jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { RecruitementAlert, RecruitementAlertDto } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
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
): RecruitementAlertDto =>
  ({
    companyId: 'company-1',
    name: 'Alert 1',
    jobName: 'Developer',
    department: null,
    workingExperienceYears: null,
    contractType: null,
    ...overrides,
  }) as RecruitementAlertDto;

describe('recruitement-alerts saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchRecruitementAlertsAction', () => {
    it('stores the returned alerts on success', async () => {
      const store = createTestStore();
      const alerts = [buildRecruitementAlert()];
      mockedApi.getRecruitementAlerts.mockResolvedValue({
        data: alerts,
      } as any);

      store.dispatch(actions.fetchRecruitementAlertsAction());
      await flushPromises();

      expect(store.getState().recruitementAlerts.recruitementAlerts).toEqual(
        alerts
      );
      expect(
        store.getState().recruitementAlerts.fetchRecruitementAlerts.status
      ).toBe('SUCCEEDED');
    });

    it('dispatches fetchRecruitementAlertsFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getRecruitementAlerts.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchRecruitementAlertsAction());
      await flushPromises();

      expect(
        store.getState().recruitementAlerts.fetchRecruitementAlerts.status
      ).toBe('FAILED');
    });
  });

  describe('createRecruitementAlertAction', () => {
    it('notifies and re-fetches the alerts list on success', async () => {
      const store = createTestStore();
      const createdAlert = buildRecruitementAlert();
      mockedApi.createRecruitementAlert.mockResolvedValue({
        data: createdAlert,
      } as any);
      const refreshedAlerts = [createdAlert];
      mockedApi.getRecruitementAlerts.mockResolvedValue({
        data: refreshedAlerts,
      } as any);

      store.dispatch(
        actions.createRecruitementAlertAction(buildRecruitementAlertDto())
      );
      await flushPromises();

      expect(
        store.getState().recruitementAlerts.createRecruitementAlert.status
      ).toBe('SUCCEEDED');
      expect(store.getState().notifications.notifications).toHaveLength(1);
      expect(store.getState().notifications.notifications[0].type).toBe(
        'success'
      );
      expect(mockedApi.getRecruitementAlerts).toHaveBeenCalled();
      expect(store.getState().recruitementAlerts.recruitementAlerts).toEqual(
        refreshedAlerts
      );
    });

    it('notifies of the failure when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.createRecruitementAlert.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.createRecruitementAlertAction(buildRecruitementAlertDto())
      );
      await flushPromises();

      expect(
        store.getState().recruitementAlerts.createRecruitementAlert.status
      ).toBe('FAILED');
      expect(store.getState().notifications.notifications).toHaveLength(1);
      expect(store.getState().notifications.notifications[0].type).toBe(
        'danger'
      );
      expect(mockedApi.getRecruitementAlerts).not.toHaveBeenCalled();
    });
  });

  describe('deleteRecruitementAlertAction', () => {
    it('removes the matching entry, notifies and re-fetches the alerts list on success', async () => {
      const store = createTestStore({
        recruitementAlerts: {
          ...slice.getInitialState(),
          recruitementAlerts: [buildRecruitementAlert({ id: 'alert-1' })],
          recruitementAlertMatchings: {
            'alert-1': { profiles: [], timestamp: 123 },
          },
        },
      });
      mockedApi.deleteRecruitementAlert.mockResolvedValue({} as any);
      mockedApi.getRecruitementAlerts.mockResolvedValue({ data: [] } as any);

      store.dispatch(actions.deleteRecruitementAlertAction('alert-1'));
      await flushPromises();

      expect(
        store.getState().recruitementAlerts.deleteRecruitementAlert.status
      ).toBe('SUCCEEDED');
      expect(
        store.getState().recruitementAlerts.recruitementAlertMatchings
      ).toEqual({});
      expect(store.getState().notifications.notifications).toHaveLength(1);
      expect(store.getState().notifications.notifications[0].type).toBe(
        'success'
      );
      expect(mockedApi.getRecruitementAlerts).toHaveBeenCalled();
    });

    it('notifies of the failure and does not re-fetch when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.deleteRecruitementAlert.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.deleteRecruitementAlertAction('alert-1'));
      await flushPromises();

      expect(
        store.getState().recruitementAlerts.deleteRecruitementAlert.status
      ).toBe('FAILED');
      expect(store.getState().notifications.notifications).toHaveLength(1);
      expect(store.getState().notifications.notifications[0].type).toBe(
        'danger'
      );
      expect(mockedApi.getRecruitementAlerts).not.toHaveBeenCalled();
    });
  });

  describe('updateRecruitementAlertAction', () => {
    it('notifies, re-fetches the alerts list and the matching on success', async () => {
      const store = createTestStore();
      const updatedAlert = buildRecruitementAlert({ id: 'alert-1' });
      mockedApi.updateRecruitementAlert.mockResolvedValue({
        data: updatedAlert,
      } as any);
      mockedApi.getRecruitementAlerts.mockResolvedValue({
        data: [updatedAlert],
      } as any);
      const matchingProfiles = [{ id: 'profile-1' }] as any;
      mockedApi.getRecruitementAlertMatching.mockResolvedValue({
        data: matchingProfiles,
      } as any);

      store.dispatch(
        actions.updateRecruitementAlertAction({
          id: 'alert-1',
          data: buildRecruitementAlertDto(),
        })
      );
      await flushPromises();

      expect(
        store.getState().recruitementAlerts.updateRecruitementAlert.status
      ).toBe('SUCCEEDED');
      expect(store.getState().notifications.notifications).toHaveLength(1);
      expect(store.getState().notifications.notifications[0].type).toBe(
        'success'
      );
      expect(mockedApi.getRecruitementAlerts).toHaveBeenCalled();
      expect(mockedApi.getRecruitementAlertMatching).toHaveBeenCalledWith(
        'alert-1'
      );
      expect(
        store.getState().recruitementAlerts.recruitementAlertMatchings[
          'alert-1'
        ].profiles
      ).toEqual(matchingProfiles);
    });

    it('notifies of the failure when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.updateRecruitementAlert.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateRecruitementAlertAction({
          id: 'alert-1',
          data: buildRecruitementAlertDto(),
        })
      );
      await flushPromises();

      expect(
        store.getState().recruitementAlerts.updateRecruitementAlert.status
      ).toBe('FAILED');
      expect(store.getState().notifications.notifications).toHaveLength(1);
      expect(store.getState().notifications.notifications[0].type).toBe(
        'danger'
      );
    });
  });

  describe('fetchRecruitementAlertMatchingAction', () => {
    it('stores the matching profiles keyed by alertId on success', async () => {
      const store = createTestStore();
      const profiles = [{ id: 'profile-1' }] as any;
      mockedApi.getRecruitementAlertMatching.mockResolvedValue({
        data: profiles,
      } as any);

      store.dispatch(actions.fetchRecruitementAlertMatchingAction('alert-1'));
      await flushPromises();

      expect(
        store.getState().recruitementAlerts.fetchRecruitementAlertMatching
          .status
      ).toBe('SUCCEEDED');
      expect(
        store.getState().recruitementAlerts.recruitementAlertMatchings[
          'alert-1'
        ].profiles
      ).toEqual(profiles);
    });

    it('defaults the stored profiles to an empty array when the API returns a non-array payload', async () => {
      const store = createTestStore();
      mockedApi.getRecruitementAlertMatching.mockResolvedValue({
        data: { not: 'an array' },
      } as any);

      store.dispatch(actions.fetchRecruitementAlertMatchingAction('alert-1'));
      await flushPromises();

      expect(
        store.getState().recruitementAlerts.recruitementAlertMatchings[
          'alert-1'
        ].profiles
      ).toEqual([]);
    });

    it('dispatches fetchRecruitementAlertMatchingFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getRecruitementAlertMatching.mockRejectedValue(
        new Error('boom')
      );

      store.dispatch(actions.fetchRecruitementAlertMatchingAction('alert-1'));
      await flushPromises();

      expect(
        store.getState().recruitementAlerts.fetchRecruitementAlertMatching
          .status
      ).toBe('FAILED');
      expect(
        store.getState().recruitementAlerts.recruitementAlertMatchings[
          'alert-1'
        ]
      ).toBeUndefined();
    });
  });
});
