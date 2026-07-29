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

  describe('removeRecruitementAlert', () => {
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
        actions.removeRecruitementAlert('alert-1')
      );

      expect(state.recruitementAlerts).toEqual([remaining]);
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
    it(`${name} does not mutate the state (consumed by the listener only)`, () => {
      const initialState = slice.getInitialState();

      const state = reducer(initialState, buildAction());

      expect(state).toEqual(initialState);
    });
  });
});
