// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { RecruitementAlert } from '@/src/api/types';
import {
  selectFetchRecruitementAlertMatchingLoading,
  selectFetchRecruitementAlertsLoading,
  selectRecruitementAlertMatchingById,
  selectRecruitementAlerts,
} from './recruitement-alerts.selectors';
import { RootState, slice } from './recruitement-alerts.slice';

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

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    recruitementAlerts: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

describe('recruitement-alerts.selectors', () => {
  describe('selectRecruitementAlerts', () => {
    it('returns the recruitement alerts list', () => {
      const recruitementAlerts = [buildRecruitementAlert()];

      expect(
        selectRecruitementAlerts(buildState({ recruitementAlerts }))
      ).toEqual(recruitementAlerts);
    });
  });

  describe('selectRecruitementAlertMatchingById', () => {
    it('returns the matching entry for the given alertId', () => {
      const matching = {
        profiles: [{ id: 'profile-1' }] as any,
        timestamp: 123,
      };
      const state = buildState({
        recruitementAlertMatchings: { 'alert-1': matching },
      });

      expect(selectRecruitementAlertMatchingById('alert-1')(state)).toEqual(
        matching
      );
    });

    it('returns an empty default when there is no matching entry for the alertId', () => {
      const state = buildState({ recruitementAlertMatchings: {} });

      expect(
        selectRecruitementAlertMatchingById('unknown-alert')(state)
      ).toEqual({ profiles: [], timestamp: 0 });
    });
  });

  describe('selectFetchRecruitementAlertsLoading', () => {
    it('returns true while the alerts fetch is requested', () => {
      const state = buildState({
        fetchRecruitementAlerts: { status: 'REQUESTED' as any },
      });

      expect(selectFetchRecruitementAlertsLoading(state)).toBe(true);
    });

    it('returns false when the alerts fetch is not requested', () => {
      const state = buildState({
        fetchRecruitementAlerts: { status: 'SUCCEEDED' as any },
      });

      expect(selectFetchRecruitementAlertsLoading(state)).toBe(false);
    });
  });

  describe('selectFetchRecruitementAlertMatchingLoading', () => {
    it('returns true while the matching fetch is requested', () => {
      const state = buildState({
        fetchRecruitementAlertMatching: { status: 'REQUESTED' as any },
      });

      expect(selectFetchRecruitementAlertMatchingLoading(state)).toBe(true);
    });

    it('returns false when the matching fetch is not requested', () => {
      const state = buildState({
        fetchRecruitementAlertMatching: { status: 'IDLE' as any },
      });

      expect(selectFetchRecruitementAlertMatchingLoading(state)).toBe(false);
    });
  });
});
