// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { RecruitementAlert } from '@/src/api/types';
import { slice } from './recruitement-alerts.slice';

const { actions, reducer } = slice;

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

describe('recruitement-alerts slice', () => {
  describe('fetchRecruitementAlertsSucceeded', () => {
    it('sets the recruitement alerts list', () => {
      const alerts = [buildRecruitementAlert()];

      const state = reducer(
        undefined,
        actions.fetchRecruitementAlertsSucceeded(alerts)
      );

      expect(state.recruitementAlerts).toEqual(alerts);
    });
  });

  describe('deleteRecruitementAlertSucceeded', () => {
    it('removes the deleted alert from the list', () => {
      const remaining = buildRecruitementAlert({ id: 'alert-2' });
      const initialState = {
        ...slice.getInitialState(),
        recruitementAlerts: [
          buildRecruitementAlert({ id: 'alert-1' }),
          remaining,
        ],
      };

      const state = reducer(
        initialState,
        actions.deleteRecruitementAlertSucceeded('alert-1')
      );

      expect(state.recruitementAlerts).toEqual([remaining]);
    });

    it('removes the associated matching entry when one exists', () => {
      const initialState = {
        ...slice.getInitialState(),
        recruitementAlerts: [buildRecruitementAlert({ id: 'alert-1' })],
        recruitementAlertMatchings: {
          'alert-1': { profiles: [], timestamp: 123 },
        },
      };

      const state = reducer(
        initialState,
        actions.deleteRecruitementAlertSucceeded('alert-1')
      );

      expect(state.recruitementAlertMatchings).toEqual({});
    });

    it('does not throw when there is no matching entry for the deleted alert', () => {
      const initialState = {
        ...slice.getInitialState(),
        recruitementAlerts: [buildRecruitementAlert({ id: 'alert-1' })],
        recruitementAlertMatchings: {},
      };

      expect(() =>
        reducer(
          initialState,
          actions.deleteRecruitementAlertSucceeded('alert-1')
        )
      ).not.toThrow();
    });
  });

  describe('updateRecruitementAlertSucceeded', () => {
    it('replaces the matching alert in the list', () => {
      const untouched = buildRecruitementAlert({
        id: 'alert-2',
        name: 'Other',
      });
      const updatedAlert = buildRecruitementAlert({
        id: 'alert-1',
        name: 'Updated name',
      });
      const initialState = {
        ...slice.getInitialState(),
        recruitementAlerts: [
          buildRecruitementAlert({ id: 'alert-1', name: 'Old name' }),
          untouched,
        ],
      };

      const state = reducer(
        initialState,
        actions.updateRecruitementAlertSucceeded(updatedAlert)
      );

      expect(state.recruitementAlerts).toEqual([updatedAlert, untouched]);
    });

    it('leaves the list unchanged when no alert matches the payload id', () => {
      const initialState = {
        ...slice.getInitialState(),
        recruitementAlerts: [buildRecruitementAlert({ id: 'alert-1' })],
      };

      const state = reducer(
        initialState,
        actions.updateRecruitementAlertSucceeded(
          buildRecruitementAlert({ id: 'unknown-alert' })
        )
      );

      expect(state.recruitementAlerts).toEqual(initialState.recruitementAlerts);
    });
  });

  describe('fetchRecruitementAlertMatchingSucceeded', () => {
    it('stores the matching profiles keyed by alertId from action.meta.arg', () => {
      const profiles = [{ id: 'profile-1' }] as any;
      const action = {
        type: actions.fetchRecruitementAlertMatchingSucceeded.type,
        payload: profiles,
        meta: { arg: 'alert-1' },
      };

      const state = reducer(undefined, action);

      expect(state.recruitementAlertMatchings['alert-1'].profiles).toEqual(
        profiles
      );
      expect(typeof state.recruitementAlertMatchings['alert-1'].timestamp).toBe(
        'number'
      );
    });

    it('defaults profiles to an empty array when the payload is not an array', () => {
      const action = {
        type: actions.fetchRecruitementAlertMatchingSucceeded.type,
        payload: { not: 'an array' },
        meta: { arg: 'alert-1' },
      };

      const state = reducer(undefined, action);

      expect(state.recruitementAlertMatchings['alert-1'].profiles).toEqual([]);
    });

    it('is a no-op on recruitementAlertMatchings when there is no meta.arg', () => {
      const state = reducer(
        undefined,
        actions.fetchRecruitementAlertMatchingSucceeded([] as any)
      );

      expect(state.recruitementAlertMatchings).toEqual({});
    });
  });

  const plainTriggerActions: [
    string,
    () => { type: string; payload: unknown },
  ][] = [
    [
      'fetchRecruitementAlertsAction',
      () => actions.fetchRecruitementAlertsAction(),
    ],
    [
      'createRecruitementAlertAction',
      () =>
        actions.createRecruitementAlertAction({
          companyId: 'company-1',
          name: 'Alert',
          jobName: 'Developer',
          department: null,
          workingExperienceYears: null,
          contractType: null,
        }),
    ],
    [
      'deleteRecruitementAlertAction',
      () => actions.deleteRecruitementAlertAction('alert-1'),
    ],
    [
      'updateRecruitementAlertAction',
      () =>
        actions.updateRecruitementAlertAction({
          id: 'alert-1',
          data: {
            companyId: 'company-1',
            name: 'Alert',
            jobName: 'Developer',
            department: null,
            workingExperienceYears: null,
            contractType: null,
          },
        }),
    ],
    [
      'fetchRecruitementAlertMatchingAction',
      () => actions.fetchRecruitementAlertMatchingAction('alert-1'),
    ],
  ];

  plainTriggerActions.forEach(([name, buildAction]) => {
    it(`${name} does not mutate the state (consumed by the saga only)`, () => {
      const initialState = slice.getInitialState();

      const state = reducer(initialState, buildAction());

      expect(state).toEqual(initialState);
    });
  });
});
