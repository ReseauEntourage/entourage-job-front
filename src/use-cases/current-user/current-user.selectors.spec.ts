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
  selectHasBetaFeature,
  selectStaffContact,
} from './current-user.selectors';
import { slice } from './current-user.slice';

const buildUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-1',
    email: 'user@example.com',
    betaFeatures: {},
    ...overrides,
  }) as User;

// `as any`: these selectors only read `state.currentUser.*`, but the
// module's exported `RootState` type also requires the shared `api` reducer
// key (for the RTK-Query-backed status selectors in the same file, exercised
// via `createTestStore` in `current-user.api.spec.ts` instead) — not
// relevant here.
const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): any => ({
  currentUser: { ...slice.getInitialState(), ...overrides },
});

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
});
