// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { RecruitementAlert } from '@/src/api/types';
import { selectRecruitementAlerts } from './recruitement-alerts.selectors';
import { slice } from './recruitement-alerts.slice';

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

// `as any`: this selector only reads `state.recruitementAlerts.*`, but the
// module's exported `RootState` type also requires the shared `api` reducer
// key (for the RTK-Query-backed selectors in `recruitement-alerts.selectors.ts`,
// exercised via `createTestStore` in `recruitement-alerts.api.spec.ts` instead)
// — not relevant here.
const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): any => ({
  recruitementAlerts: { ...slice.getInitialState(), ...overrides },
});

describe('recruitement-alerts.selectors', () => {
  describe('selectRecruitementAlerts', () => {
    it('returns the recruitement alerts list', () => {
      const recruitementAlerts = [buildRecruitementAlert()];

      expect(
        selectRecruitementAlerts(buildState({ recruitementAlerts }))
      ).toEqual(recruitementAlerts);
    });
  });
});
