// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { User } from '@/src/api/types';
import { slice } from './current-user.slice';

const { actions, reducer } = slice;

const buildUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-1',
    email: 'user@example.com',
    onboardingStatus: 'IN_PROGRESS',
    betaFeatures: {},
    ...overrides,
  }) as User;

describe('current-user slice', () => {
  it('resetCurrentUser returns the initial state', () => {
    const mutated = reducer(undefined, actions.setUser(buildUser()));

    expect(reducer(mutated, actions.resetCurrentUser())).toEqual(
      slice.getInitialState()
    );
  });

  it('setUser sets the user', () => {
    const user = buildUser();

    const state = reducer(undefined, actions.setUser(user));

    expect(state.user).toEqual(user);
  });

  it('fetchUserSucceeded sets the user and resets complete to false', () => {
    const initialState = { ...slice.getInitialState(), complete: true };
    const user = buildUser();

    const state = reducer(initialState, actions.fetchUserSucceeded(user));

    expect(state.user).toEqual(user);
    expect(state.complete).toBe(false);
  });

  it('fetchUserStatsSucceeded sets stats', () => {
    const stats = { profileViews: 3 } as any;

    const state = reducer(undefined, actions.fetchUserStatsSucceeded(stats));

    expect(state.stats).toEqual(stats);
  });

  it('fetchCurrentUserSocialSituationSucceeded merges into user.userSocialSituation', () => {
    const initialState = {
      ...slice.getInitialState(),
      user: buildUser({
        userSocialSituation: { nationality: 'FR' } as any,
      }),
    };

    const state = reducer(
      initialState,
      actions.fetchCurrentUserSocialSituationSucceeded({
        hasCompletedSurvey: true,
      })
    );

    expect(state.user?.userSocialSituation).toEqual({
      nationality: 'FR',
      hasCompletedSurvey: true,
    });
  });

  it('fetchCurrentUserSocialSituationSucceeded is a no-op when there is no user yet', () => {
    const state = reducer(
      undefined,
      actions.fetchCurrentUserSocialSituationSucceeded({
        hasCompletedSurvey: true,
      })
    );

    expect(state.user).toBeNull();
  });

  it('fetchStaffContactSucceeded sets staffContact', () => {
    const staffContact = { name: 'Coach' } as any;

    const state = reducer(
      undefined,
      actions.fetchStaffContactSucceeded(staffContact)
    );

    expect(state.staffContact).toEqual(staffContact);
  });

  it('fetchCompleteUserSucceeded sets the user and complete to true', () => {
    const user = buildUser();

    const state = reducer(undefined, actions.fetchCompleteUserSucceeded(user));

    expect(state.user).toEqual(user);
    expect(state.complete).toBe(true);
  });

  it('updateUserSucceeded merges the payload into the existing user', () => {
    const initialState = {
      ...slice.getInitialState(),
      user: buildUser({ email: 'old@example.com' }),
    };

    const state = reducer(
      initialState,
      actions.updateUserSucceeded({ user: { email: 'new@example.com' } })
    );

    expect(state.user?.email).toBe('new@example.com');
  });

  it('updateUserSucceeded throws when there is no authenticated user', () => {
    expect(() =>
      reducer(
        undefined,
        actions.updateUserSucceeded({ user: { email: 'new@example.com' } })
      )
    ).toThrow();
  });

  it('updateUserFailed sets userUpdateError', () => {
    const state = reducer(
      undefined,
      actions.updateUserFailed({ error: 'UPDATE_FAILED' })
    );

    expect(state.userUpdateError).toBe('UPDATE_FAILED');
  });

  it('updateUserCompanyFailed sets userCompanyUpdateError', () => {
    const state = reducer(
      undefined,
      actions.updateUserCompanyFailed({ error: 'UPDATE_FAILED' })
    );

    expect(state.userCompanyUpdateError).toBe('UPDATE_FAILED');
  });

  it('updateUserCompanySucceeded only transitions the request status', () => {
    const state = reducer(undefined, actions.updateUserCompanySucceeded());

    expect(state.updateUserCompany.status).toBe('SUCCEEDED');
  });

  it('updateProfileSucceeded merges userProfile into profile and profileComplete', () => {
    const initialState = {
      ...slice.getInitialState(),
      profile: { firstName: 'Old' } as any,
      profileComplete: { firstName: 'Old', hasPicture: false } as any,
    };

    const state = reducer(
      initialState,
      actions.updateProfileSucceeded({
        userProfile: { firstName: 'New' } as any,
      })
    );

    expect(state.profile).toEqual({ firstName: 'New' });
    expect(state.profileComplete).toEqual({
      firstName: 'New',
      hasPicture: false,
    });
  });

  it('updateProfileSucceeded is a no-op on profile/profileComplete when both are null', () => {
    const state = reducer(
      undefined,
      actions.updateProfileSucceeded({
        userProfile: { firstName: 'New' } as any,
      })
    );

    expect(state.profile).toBeNull();
    expect(state.profileComplete).toBeNull();
  });

  it('updateProfileFailed sets userUpdateError', () => {
    const state = reducer(
      undefined,
      actions.updateProfileFailed({ error: 'UPDATE_FAILED' })
    );

    expect(state.userUpdateError).toBe('UPDATE_FAILED');
  });

  it('updateOnboardingStatusSucceeded sets user.onboardingStatus', () => {
    const initialState = {
      ...slice.getInitialState(),
      user: buildUser({ onboardingStatus: 'NOT_STARTED' as any }),
    };

    const state = reducer(
      initialState,
      actions.updateOnboardingStatusSucceeded({
        onboardingStatus: 'COMPLETED' as any,
      })
    );

    expect(state.user?.onboardingStatus).toBe('COMPLETED');
  });

  it('updateOnboardingStatusSucceeded throws when there is no authenticated user', () => {
    expect(() =>
      reducer(
        undefined,
        actions.updateOnboardingStatusSucceeded({
          onboardingStatus: 'COMPLETED' as any,
        })
      )
    ).toThrow();
  });

  it('forceOnboardingAsCompletedSucceeded sets user.onboardingStatus', () => {
    const initialState = {
      ...slice.getInitialState(),
      user: buildUser({ onboardingStatus: 'NOT_STARTED' as any }),
    };

    const state = reducer(
      initialState,
      actions.forceOnboardingAsCompletedSucceeded({
        onboardingStatus: 'COMPLETED' as any,
      })
    );

    expect(state.user?.onboardingStatus).toBe('COMPLETED');
  });

  it('updateUserProfilePictureSucceeded sets hasPicture on profile and profileComplete', () => {
    const initialState = {
      ...slice.getInitialState(),
      profile: { hasPicture: false } as any,
      profileComplete: { hasPicture: false } as any,
    };

    const state = reducer(
      initialState,
      actions.updateUserProfilePictureSucceeded()
    );

    expect(state.profile?.hasPicture).toBe(true);
    expect(state.profileComplete?.hasPicture).toBe(true);
  });

  it('uploadExternalCvSucceeded sets hasExternalCv and resets hasExtractedCvData', () => {
    const initialState = {
      ...slice.getInitialState(),
      profile: { hasExternalCv: false } as any,
      profileComplete: {
        hasExternalCv: false,
        hasExtractedCvData: true,
      } as any,
    };

    const state = reducer(initialState, actions.uploadExternalCvSucceeded());

    expect(state.profile?.hasExternalCv).toBe(true);
    expect(state.profileComplete?.hasExternalCv).toBe(true);
    expect(state.profileComplete?.hasExtractedCvData).toBe(false);
  });

  it('fetchCurrentProfileSucceeded sets profile', () => {
    const profile = { firstName: 'A' } as any;

    const state = reducer(
      undefined,
      actions.fetchCurrentProfileSucceeded(profile)
    );

    expect(state.profile).toEqual(profile);
  });

  it('fetchCurrentProfileCompleteSucceeded sets profileComplete and complete to true', () => {
    const profileComplete = { firstName: 'A' } as any;

    const state = reducer(
      undefined,
      actions.fetchCurrentProfileCompleteSucceeded(profileComplete)
    );

    expect(state.profileComplete).toEqual(profileComplete);
    expect(state.complete).toBe(true);
  });

  it('fetchCurrentCompanySucceeded sets company', () => {
    const company = { id: 'company-1' } as any;

    const state = reducer(
      undefined,
      actions.fetchCurrentCompanySucceeded(company)
    );

    expect(state.company).toEqual(company);
  });

  it('fetchCurrentOrganizationSucceeded sets organization', () => {
    const organization = { id: 'org-1' } as any;

    const state = reducer(
      undefined,
      actions.fetchCurrentOrganizationSucceeded(organization)
    );

    expect(state.organization).toEqual(organization);
  });

  it('fetchCurrentAchievementsSucceeded sets achievements', () => {
    const achievements = [{ id: 'ach-1' }] as any;

    const state = reducer(
      undefined,
      actions.fetchCurrentAchievementsSucceeded(achievements)
    );

    expect(state.achievements).toEqual(achievements);
  });

  it('fetchCurrentReadDocumentsSucceeded sets readDocuments', () => {
    const readDocuments = [{ documentName: 'cgu', createdAt: '2026-01-01' }];

    const state = reducer(
      undefined,
      actions.fetchCurrentReadDocumentsSucceeded(readDocuments)
    );

    expect(state.readDocuments).toEqual(readDocuments);
  });

  it('fetchCurrentReferredUsersSucceeded sets referredUsers from referredCandidates', () => {
    const referredCandidates = [{ id: 'candidate-1' }] as any;

    const state = reducer(
      undefined,
      actions.fetchCurrentReferredUsersSucceeded({ referredCandidates })
    );

    expect(state.referredUsers).toEqual(referredCandidates);
  });

  it('fetchCurrentReferrerSucceeded sets referrer', () => {
    const referrer = { id: 'referrer-1' } as any;

    const state = reducer(
      undefined,
      actions.fetchCurrentReferrerSucceeded(referrer)
    );

    expect(state.referrer).toEqual(referrer);
  });

  it('deleteExternalCvSucceeded resets hasExternalCv on profile and profileComplete', () => {
    const initialState = {
      ...slice.getInitialState(),
      profile: { hasExternalCv: true } as any,
      profileComplete: { hasExternalCv: true } as any,
    };

    const state = reducer(initialState, actions.deleteExternalCvSucceeded());

    expect(state.profile?.hasExternalCv).toBe(false);
    expect(state.profileComplete?.hasExternalCv).toBe(false);
  });

  it('getExternalCvSucceeded sets externalCv', () => {
    const state = reducer(
      undefined,
      actions.getExternalCvSucceeded('https://example.com/cv.pdf')
    );

    expect(state.externalCv).toBe('https://example.com/cv.pdf');
  });

  it('generateProfileFromCVSucceeded sets hasExtractedCvData on profileComplete', () => {
    const initialState = {
      ...slice.getInitialState(),
      profileComplete: { hasExtractedCvData: false } as any,
    };

    const state = reducer(
      initialState,
      actions.generateProfileFromCVSucceeded()
    );

    expect(state.profileComplete?.hasExtractedCvData).toBe(true);
  });

  it('profileCompleteDraftUpdated merges the partial payload into profileComplete', () => {
    const initialState = {
      ...slice.getInitialState(),
      profileComplete: { description: 'Old', isAvailable: true } as any,
    };

    const state = reducer(
      initialState,
      actions.profileCompleteDraftUpdated({ description: 'New' })
    );

    expect(state.profileComplete).toEqual({
      description: 'New',
      isAvailable: true,
    });
  });

  it('profileCompleteDraftUpdated is a no-op when profileComplete is null', () => {
    const state = reducer(
      undefined,
      actions.profileCompleteDraftUpdated({ description: 'New' })
    );

    expect(state.profileComplete).toBeNull();
  });
});
