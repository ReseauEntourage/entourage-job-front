// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { FeatureKey, User } from '@/src/api/types';
import {
  selectAuthenticatedUser,
  selectBetaFeatures,
  selectCurrentUser,
  selectCurrentUserAchievements,
  selectCurrentUserCompany,
  selectCurrentUserId,
  selectCurrentUserOrganization,
  selectCurrentUserProfile,
  selectCurrentUserProfileComplete,
  selectCurrentUserReadDocuments,
  selectCurrentUserReferredUsers,
  selectCurrentUserReferrer,
  selectCurrentUserStats,
  selectExternalCv,
  selectFetchCurrentAchievementsStatus,
  selectFetchCurrentCompanyStatus,
  selectFetchCurrentOrganizationStatus,
  selectFetchCurrentProfileCompleteStatus,
  selectFetchCurrentProfileStatus,
  selectFetchCurrentReadDocumentsStatus,
  selectFetchCurrentReferredUsersStatus,
  selectFetchCurrentReferrerStatus,
  selectFetchUserStatsStatus,
  selectHasBetaFeature,
  selectIsComplete,
  selectStaffContact,
} from './current-user.selectors';
import { RootState } from './current-user.slice';
import { slice } from './current-user.slice';

const buildUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-1',
    email: 'user@example.com',
    betaFeatures: {},
    ...overrides,
  }) as User;

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    currentUser: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

describe('current-user.selectors', () => {
  describe('selectCurrentUser', () => {
    it('returns the current user', () => {
      const user = buildUser();
      expect(selectCurrentUser(buildState({ user }))).toBe(user);
    });

    it('returns null when there is no user', () => {
      expect(selectCurrentUser(buildState())).toBeNull();
    });
  });

  describe('selectAuthenticatedUser', () => {
    it('returns the current user when defined', () => {
      const user = buildUser();
      expect(selectAuthenticatedUser(buildState({ user }))).toBe(user);
    });

    it('throws when there is no authenticated user', () => {
      expect(() => selectAuthenticatedUser(buildState())).toThrow();
    });
  });

  describe('selectCurrentUserId', () => {
    it("returns the authenticated user's id", () => {
      const user = buildUser({ id: 'user-42' });
      expect(selectCurrentUserId(buildState({ user }))).toBe('user-42');
    });

    it('throws when there is no authenticated user', () => {
      expect(() => selectCurrentUserId(buildState())).toThrow();
    });
  });

  describe('selectStaffContact', () => {
    it('returns the staff contact', () => {
      const staffContact = { name: 'Coach' } as any;
      expect(selectStaffContact(buildState({ staffContact }))).toEqual(
        staffContact
      );
    });
  });

  describe('selectExternalCv', () => {
    it('returns the external CV url', () => {
      expect(
        selectExternalCv(buildState({ externalCv: 'https://cv.pdf' }))
      ).toBe('https://cv.pdf');
    });
  });

  describe('selectCurrentUserStats', () => {
    it('returns the user stats', () => {
      const stats = { profileViews: 1 } as any;
      expect(selectCurrentUserStats(buildState({ stats }))).toEqual(stats);
    });
  });

  describe('selectIsComplete', () => {
    it('returns the complete flag', () => {
      expect(selectIsComplete(buildState({ complete: true }))).toBe(true);
      expect(selectIsComplete(buildState({ complete: false }))).toBe(false);
    });
  });

  describe('selectCurrentUserProfile', () => {
    it('returns the profile', () => {
      const profile = { firstName: 'A' } as any;
      expect(selectCurrentUserProfile(buildState({ profile }))).toEqual(
        profile
      );
    });
  });

  describe('selectCurrentUserProfileComplete', () => {
    it('returns the complete profile', () => {
      const profileComplete = { firstName: 'A' } as any;
      expect(
        selectCurrentUserProfileComplete(buildState({ profileComplete }))
      ).toEqual(profileComplete);
    });
  });

  describe('selectCurrentUserCompany', () => {
    it('returns the company', () => {
      const company = { id: 'company-1' } as any;
      expect(selectCurrentUserCompany(buildState({ company }))).toEqual(
        company
      );
    });
  });

  describe('selectCurrentUserOrganization', () => {
    it('returns the organization', () => {
      const organization = { id: 'org-1' } as any;
      expect(
        selectCurrentUserOrganization(buildState({ organization }))
      ).toEqual(organization);
    });
  });

  describe('selectCurrentUserAchievements', () => {
    it('returns the achievements list', () => {
      const achievements = [{ id: 'ach-1' }] as any;
      expect(
        selectCurrentUserAchievements(buildState({ achievements }))
      ).toEqual(achievements);
    });
  });

  describe('selectCurrentUserReadDocuments', () => {
    it('returns the read documents list', () => {
      const readDocuments = [{ documentName: 'cgu', createdAt: 'now' }];
      expect(
        selectCurrentUserReadDocuments(buildState({ readDocuments }))
      ).toEqual(readDocuments);
    });
  });

  describe('selectCurrentUserReferredUsers', () => {
    it('returns the referred users list', () => {
      const referredUsers = [{ id: 'candidate-1' }] as any;
      expect(
        selectCurrentUserReferredUsers(buildState({ referredUsers }))
      ).toEqual(referredUsers);
    });
  });

  describe('selectCurrentUserReferrer', () => {
    it('returns the referrer', () => {
      const referrer = { id: 'referrer-1' } as any;
      expect(selectCurrentUserReferrer(buildState({ referrer }))).toEqual(
        referrer
      );
    });
  });

  describe('selectBetaFeatures', () => {
    it("returns the user's beta features", () => {
      const user = buildUser({
        betaFeatures: { [FeatureKey.MESSAGING_AI_ASSISTANT]: true },
      });
      expect(selectBetaFeatures(buildState({ user }))).toEqual({
        [FeatureKey.MESSAGING_AI_ASSISTANT]: true,
      });
    });

    it('returns an empty object when there is no user', () => {
      expect(selectBetaFeatures(buildState())).toEqual({});
    });
  });

  describe('selectHasBetaFeature', () => {
    it('returns true when the feature flag is enabled for the user', () => {
      const user = buildUser({
        betaFeatures: { [FeatureKey.MESSAGING_AI_ASSISTANT]: true },
      });
      expect(
        selectHasBetaFeature(FeatureKey.MESSAGING_AI_ASSISTANT)(
          buildState({ user })
        )
      ).toBe(true);
    });

    it('returns false when the feature flag is absent', () => {
      const user = buildUser({
        betaFeatures: { [FeatureKey.MESSAGING_AI_ASSISTANT]: false },
      });
      expect(
        selectHasBetaFeature(FeatureKey.MESSAGING_AI_ASSISTANT)(
          buildState({ user })
        )
      ).toBe(false);
    });
  });

  const statusSelectors: [string, (state: RootState) => string, string][] = [
    [
      'selectFetchCurrentCompanyStatus',
      selectFetchCurrentCompanyStatus,
      'fetchCurrentCompany',
    ],
    [
      'selectFetchCurrentProfileStatus',
      selectFetchCurrentProfileStatus,
      'fetchCurrentProfile',
    ],
    [
      'selectFetchCurrentProfileCompleteStatus',
      selectFetchCurrentProfileCompleteStatus,
      'fetchCurrentProfileComplete',
    ],
    [
      'selectFetchCurrentOrganizationStatus',
      selectFetchCurrentOrganizationStatus,
      'fetchCurrentOrganization',
    ],
    [
      'selectFetchCurrentAchievementsStatus',
      selectFetchCurrentAchievementsStatus,
      'fetchCurrentAchievements',
    ],
    [
      'selectFetchCurrentReadDocumentsStatus',
      selectFetchCurrentReadDocumentsStatus,
      'fetchCurrentReadDocuments',
    ],
    [
      'selectFetchCurrentReferredUsersStatus',
      selectFetchCurrentReferredUsersStatus,
      'fetchCurrentReferredUsers',
    ],
    [
      'selectFetchCurrentReferrerStatus',
      selectFetchCurrentReferrerStatus,
      'fetchCurrentReferrer',
    ],
    [
      'selectFetchUserStatsStatus',
      selectFetchUserStatsStatus,
      'fetchUserStats',
    ],
  ];

  statusSelectors.forEach(([name, selector, stateKey]) => {
    describe(name, () => {
      it(`reads the status from currentUser.${stateKey}`, () => {
        const state = buildState({
          [stateKey]: { status: 'SUCCEEDED' },
        } as any);

        expect(selector(state)).toBe('SUCCEEDED');
      });
    });
  });
});
