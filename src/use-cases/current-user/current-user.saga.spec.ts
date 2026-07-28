jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import { authenticationActions } from '@/src/use-cases/authentication';
import { slice } from './current-user.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

function buildAuthenticatedStore() {
  seedAccessToken('token-123');
  return createTestStore();
}

describe('current-user saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchUserRequested', () => {
    it('fetches the current user and dispatches fetchUserSucceeded when authenticated', async () => {
      const store = buildAuthenticatedStore();
      const user = { id: 'user-1', onboardingStatus: 'IN_PROGRESS' } as any;
      mockedApi.getCurrentIdentity.mockResolvedValue({ data: user } as any);

      store.dispatch(actions.fetchUserRequested());
      await flushPromises();

      expect(store.getState().currentUser.user).toEqual(user);
      expect(store.getState().currentUser.fetchUser.status).toBe('SUCCEEDED');
    });

    it('dispatches fetchUserFailed without calling the API when there is no access token', async () => {
      const store = createTestStore();

      store.dispatch(actions.fetchUserRequested());
      await flushPromises();

      expect(mockedApi.getCurrentIdentity).not.toHaveBeenCalled();
      expect(store.getState().currentUser.fetchUser.status).toBe('FAILED');
    });

    it('dispatches fetchUserFailed when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockRejectedValue(
        new Error('network error')
      );

      store.dispatch(actions.fetchUserRequested());
      await flushPromises();

      expect(store.getState().currentUser.fetchUser.status).toBe('FAILED');
    });

    it('stores the onboarding status in localStorage once fetched', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1', onboardingStatus: 'COMPLETED' },
      } as any);

      store.dispatch(actions.fetchUserRequested());
      await flushPromises();

      expect(localStorage.getItem('onboarding-completion-status')).toBe(
        'COMPLETED'
      );
    });
  });

  describe('fetchCompleteUserRequested', () => {
    it('triggers fetchCurrentProfileComplete and lands its result', async () => {
      const store = buildAuthenticatedStore();
      const profileComplete = { id: 'profile-1' } as any;
      mockedApi.getCurrentProfileComplete.mockResolvedValue({
        data: profileComplete,
      } as any);

      store.dispatch(actions.fetchCompleteUserRequested());
      await flushPromises();

      expect(store.getState().currentUser.profileComplete).toEqual(
        profileComplete
      );
      expect(store.getState().currentUser.complete).toBe(true);
    });
  });

  describe('updateUserRequested', () => {
    it('updates the user and does not log out when the email is unchanged', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1', email: 'same@example.com' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();
      mockedApi.putUser.mockResolvedValue({} as any);

      store.dispatch(
        actions.updateUserRequested({
          userId: 'user-1',
          user: { email: 'same@example.com' },
        })
      );
      await flushPromises();

      expect(store.getState().currentUser.updateUser.status).toBe('SUCCEEDED');
      expect(store.getState().authentication.logout.status).toBe('IDLE');
    });

    it('logs the user out when the email changes', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1', email: 'old@example.com' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();
      mockedApi.putUser.mockResolvedValue({} as any);

      store.dispatch(
        actions.updateUserRequested({
          userId: 'user-1',
          user: { email: 'new@example.com' },
        })
      );
      await flushPromises();

      expect(store.getState().authentication.logout.status).toBe('SUCCEEDED');
    });

    it('dispatches updateUserFailed when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.putUser.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateUserRequested({
          userId: 'user-1',
          user: { email: 'new@example.com' },
        })
      );
      await flushPromises();

      expect(store.getState().currentUser.updateUser.status).toBe('FAILED');
      expect(store.getState().currentUser.userUpdateError).toBe(
        'UPDATE_FAILED'
      );
    });
  });

  describe('updateOnboardingStatusRequested', () => {
    it('updates the onboarding status on success', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();
      mockedApi.putUser.mockResolvedValue({} as any);

      store.dispatch(
        actions.updateOnboardingStatusRequested({
          onboardingStatus: 'COMPLETED' as any,
        })
      );
      await flushPromises();

      expect(store.getState().currentUser.user?.onboardingStatus).toBe(
        'COMPLETED'
      );
      expect(store.getState().currentUser.updateOnboardingStatus.status).toBe(
        'SUCCEEDED'
      );
    });

    it('dispatches updateOnboardingStatusFailed when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();
      mockedApi.putUser.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateOnboardingStatusRequested({
          onboardingStatus: 'COMPLETED' as any,
        })
      );
      await flushPromises();

      expect(store.getState().currentUser.updateOnboardingStatus.status).toBe(
        'FAILED'
      );
    });
  });

  describe('forceOnboardingAsCompletedRequested', () => {
    it('forces the onboarding status to the API response value', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();
      mockedApi.putUser.mockResolvedValue({
        data: { onboardingStatus: 'COMPLETED' },
      } as any);

      store.dispatch(actions.forceOnboardingAsCompletedRequested());
      await flushPromises();

      expect(store.getState().currentUser.user?.onboardingStatus).toBe(
        'COMPLETED'
      );
    });

    it('dispatches forceOnboardingAsCompletedFailed when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();
      mockedApi.putUser.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.forceOnboardingAsCompletedRequested());
      await flushPromises();

      expect(
        store.getState().currentUser.forceOnboardingAsCompleted.status
      ).toBe('FAILED');
    });
  });

  describe('updateUserCompanyRequested', () => {
    it('re-fetches the current user on success', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.putUserCompany.mockResolvedValue({} as any);
      const refreshedUser = { id: 'user-1', company: 'Acme' } as any;
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: refreshedUser,
      } as any);

      store.dispatch(
        actions.updateUserCompanyRequested({ companyName: 'Acme' })
      );
      await flushPromises();

      expect(store.getState().currentUser.updateUserCompany.status).toBe(
        'SUCCEEDED'
      );
      expect(store.getState().currentUser.user).toEqual(refreshedUser);
    });

    it('notifies and sets the error on failure', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.putUserCompany.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateUserCompanyRequested({ companyName: 'Acme' })
      );
      await flushPromises();

      expect(store.getState().currentUser.updateUserCompany.status).toBe(
        'FAILED'
      );
      expect(store.getState().currentUser.userCompanyUpdateError).toBe(
        'UPDATE_FAILED'
      );
      expect(store.getState().notifications.notifications).toHaveLength(1);
    });
  });

  describe('updateProfileRequested', () => {
    it('re-fetches the complete profile when one was already loaded', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentProfileComplete.mockResolvedValue({
        data: { id: 'profile-1' },
      } as any);
      store.dispatch(actions.fetchCurrentProfileCompleteRequested());
      await flushPromises();

      mockedApi.putUserProfile.mockResolvedValue({
        data: { description: 'Updated bio' },
      } as any);
      mockedApi.getCurrentProfileComplete.mockResolvedValue({
        data: { id: 'profile-1', description: 'Updated bio' },
      } as any);

      store.dispatch(
        actions.updateProfileRequested({
          userId: 'user-1',
          userProfile: { description: 'Updated bio' } as any,
        })
      );
      await flushPromises();

      expect(store.getState().currentUser.profileComplete?.description).toBe(
        'Updated bio'
      );
    });

    it('dispatches updateProfileFailed when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.putUserProfile.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateProfileRequested({
          userId: 'user-1',
          userProfile: {} as any,
        })
      );
      await flushPromises();

      expect(store.getState().currentUser.updateProfile.status).toBe('FAILED');
      expect(store.getState().currentUser.userUpdateError).toBe(
        'UPDATE_FAILED'
      );
    });
  });

  describe('updateSocialSituationRequested', () => {
    it('re-fetches the current user on success', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();

      mockedApi.updateUserSocialSituation.mockResolvedValue({} as any);
      const refreshedUser = { id: 'user-1', updated: true } as any;
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: refreshedUser,
      } as any);

      store.dispatch(actions.updateSocialSituationRequested({}));
      await flushPromises();

      expect(store.getState().currentUser.updateSocialSituation.status).toBe(
        'SUCCEEDED'
      );
      expect(store.getState().currentUser.user).toEqual(refreshedUser);
    });

    it('dispatches updateSocialSituationFailed when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();
      mockedApi.updateUserSocialSituation.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.updateSocialSituationRequested({}));
      await flushPromises();

      expect(store.getState().currentUser.updateSocialSituation.status).toBe(
        'FAILED'
      );
    });
  });

  describe('readDocumentRequested', () => {
    it('marks the document as read and re-fetches the current user', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();

      mockedApi.postReadDocument.mockReturnValue(undefined as any);
      const refreshedUser = { id: 'user-1', updated: true } as any;
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: refreshedUser,
      } as any);

      store.dispatch(
        actions.readDocumentRequested({ documentName: 'cgu' as any })
      );
      await flushPromises();

      expect(store.getState().currentUser.readDocument.status).toBe(
        'SUCCEEDED'
      );
      expect(store.getState().currentUser.user).toEqual(refreshedUser);
    });
  });

  describe('updateUserProfilePictureRequested', () => {
    it('succeeds when the upload resolves', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.postProfileImage.mockResolvedValue({} as any);

      store.dispatch(
        actions.updateUserProfilePictureRequested({
          profileImage: new Blob(),
        })
      );
      await flushPromises();

      expect(store.getState().currentUser.updateUserProfilePicture.status).toBe(
        'SUCCEEDED'
      );
    });

    it('fails when the upload rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.postProfileImage.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateUserProfilePictureRequested({
          profileImage: new Blob(),
        })
      );
      await flushPromises();

      expect(store.getState().currentUser.updateUserProfilePicture.status).toBe(
        'FAILED'
      );
    });
  });

  describe('deleteExternalCvRequested', () => {
    it('resets hasExternalCv and notifies on success', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentProfile.mockResolvedValue({
        data: { hasExternalCv: true },
      } as any);
      store.dispatch(actions.fetchCurrentProfileRequested());
      await flushPromises();
      mockedApi.deleteExternalCv.mockResolvedValue({} as any);

      store.dispatch(actions.deleteExternalCvRequested());
      await flushPromises();

      expect(store.getState().currentUser.profile?.hasExternalCv).toBe(false);
      expect(store.getState().notifications.notifications).toHaveLength(1);
    });

    it('leaves the profile unchanged and does not notify when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentProfile.mockResolvedValue({
        data: { hasExternalCv: true },
      } as any);
      store.dispatch(actions.fetchCurrentProfileRequested());
      await flushPromises();
      mockedApi.deleteExternalCv.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.deleteExternalCvRequested());
      await flushPromises();

      expect(store.getState().currentUser.profile?.hasExternalCv).toBe(true);
      expect(store.getState().notifications.notifications).toHaveLength(0);
    });
  });

  describe('uploadExternalCvRequested', () => {
    it('succeeds when the upload resolves', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.postExternalCv.mockResolvedValue({} as any);

      store.dispatch(
        actions.uploadExternalCvRequested({ formData: new FormData() })
      );
      await flushPromises();

      expect(store.getState().currentUser.uploadExternalCv.status).toBe(
        'SUCCEEDED'
      );
    });

    it('notifies and fails when the upload rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.postExternalCv.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.uploadExternalCvRequested({ formData: new FormData() })
      );
      await flushPromises();

      expect(store.getState().currentUser.uploadExternalCv.status).toBe(
        'FAILED'
      );
      expect(store.getState().notifications.notifications).toHaveLength(1);
    });
  });

  describe('getExternalCvRequested', () => {
    it('sets the external CV url on success', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();
      mockedApi.getExternalCvByUser.mockResolvedValue({
        data: { url: 'https://cv.pdf' },
      } as any);

      store.dispatch(actions.getExternalCvRequested());
      await flushPromises();

      expect(store.getState().currentUser.externalCv).toBe('https://cv.pdf');
    });

    it('dispatches getExternalCvFailed when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();
      mockedApi.getExternalCvByUser.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.getExternalCvRequested());
      await flushPromises();

      expect(store.getState().currentUser.externalCv).toBeNull();
    });
  });

  describe('loginSucceeded / logoutSucceeded (cross-domain)', () => {
    it('fetches the current user when authentication succeeds', async () => {
      const store = createTestStore();
      const user = { id: 'user-1' } as any;
      mockedApi.getCurrentIdentity.mockResolvedValue({ data: user } as any);

      store.dispatch(
        authenticationActions.loginSucceeded({ accessToken: 'token-123' })
      );
      await flushPromises();

      expect(store.getState().currentUser.user).toEqual(user);
    });

    it('resets the current-user slice when authentication logs out', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();
      expect(store.getState().currentUser.user).not.toBeNull();

      store.dispatch(authenticationActions.logoutSucceeded());
      await flushPromises();

      expect(store.getState().currentUser.user).toBeNull();
    });
  });

  const guardedFetchers: {
    name: string;
    requested: () => { type: string; payload: unknown };
    apiMethod: keyof ReturnType<typeof getMockedApi>;
    mockData: unknown;
    statusField:
      | 'fetchStaffContact'
      | 'fetchCurrentProfile'
      | 'fetchCurrentCompany'
      | 'fetchCurrentOrganization'
      | 'fetchCurrentAchievements'
      | 'fetchCurrentReadDocuments'
      | 'fetchCurrentReferredUsers'
      | 'fetchCurrentReferrer'
      | 'fetchUserStats';
    resultField:
      | 'staffContact'
      | 'profile'
      | 'company'
      | 'organization'
      | 'achievements'
      | 'readDocuments'
      | 'stats'
      | null;
  }[] = [
    {
      name: 'fetchStaffContactRequested',
      requested: () => actions.fetchStaffContactRequested(),
      apiMethod: 'getCurrentStaffContact',
      mockData: { name: 'Coach' },
      statusField: 'fetchStaffContact',
      resultField: 'staffContact',
    },
    {
      name: 'fetchCurrentProfileRequested',
      requested: () => actions.fetchCurrentProfileRequested(),
      apiMethod: 'getCurrentProfile',
      mockData: { id: 'profile-1' },
      statusField: 'fetchCurrentProfile',
      resultField: 'profile',
    },
    {
      name: 'fetchCurrentCompanyRequested',
      requested: () => actions.fetchCurrentCompanyRequested(),
      apiMethod: 'getCurrentCompany',
      mockData: { id: 'company-1' },
      statusField: 'fetchCurrentCompany',
      resultField: 'company',
    },
    {
      name: 'fetchCurrentOrganizationRequested',
      requested: () => actions.fetchCurrentOrganizationRequested(),
      apiMethod: 'getCurrentOrganization',
      mockData: { id: 'org-1' },
      statusField: 'fetchCurrentOrganization',
      resultField: 'organization',
    },
    {
      name: 'fetchUserStatsRequested',
      requested: () => actions.fetchUserStatsRequested(),
      apiMethod: 'getCurrentStats',
      mockData: { profileViews: 3 },
      statusField: 'fetchUserStats',
      resultField: 'stats',
    },
  ];

  guardedFetchers.forEach(
    ({ name, requested, apiMethod, mockData, statusField, resultField }) => {
      describe(name, () => {
        it('succeeds and stores the API payload when authenticated', async () => {
          const store = buildAuthenticatedStore();
          (mockedApi[apiMethod] as jest.Mock).mockResolvedValue({
            data: mockData,
          });

          store.dispatch(requested());
          await flushPromises();

          expect(
            (store.getState().currentUser as any)[statusField].status
          ).toBe('SUCCEEDED');
          if (resultField) {
            expect((store.getState().currentUser as any)[resultField]).toEqual(
              mockData
            );
          }
        });

        it('fails without calling the API when there is no access token', async () => {
          const store = createTestStore();

          store.dispatch(requested());
          await flushPromises();

          expect(mockedApi[apiMethod]).not.toHaveBeenCalled();
          expect(
            (store.getState().currentUser as any)[statusField].status
          ).toBe('FAILED');
        });

        it('fails when the API call rejects', async () => {
          const store = buildAuthenticatedStore();
          (mockedApi[apiMethod] as jest.Mock).mockRejectedValue(
            new Error('boom')
          );

          store.dispatch(requested());
          await flushPromises();

          expect(
            (store.getState().currentUser as any)[statusField].status
          ).toBe('FAILED');
        });
      });
    }
  );

  describe('fetchCurrentAchievementsRequested', () => {
    it('stores the achievements list on success', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentAchievements.mockResolvedValue({
        data: { achievements: [{ id: 'ach-1' }] },
      } as any);

      store.dispatch(actions.fetchCurrentAchievementsRequested());
      await flushPromises();

      expect(store.getState().currentUser.achievements).toEqual([
        { id: 'ach-1' },
      ]);
    });
  });

  describe('fetchCurrentReadDocumentsRequested', () => {
    it('stores the read documents list on success', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentReadDocuments.mockResolvedValue({
        data: { readDocuments: [{ documentName: 'cgu', createdAt: 'now' }] },
      } as any);

      store.dispatch(actions.fetchCurrentReadDocumentsRequested());
      await flushPromises();

      expect(store.getState().currentUser.readDocuments).toEqual([
        { documentName: 'cgu', createdAt: 'now' },
      ]);
    });
  });

  describe('fetchCurrentReferredUsersRequested', () => {
    it('stores the referred candidates as referredUsers on success', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentReferredUsers.mockResolvedValue({
        data: { referredCandidates: [{ id: 'candidate-1' }] },
      } as any);

      store.dispatch(actions.fetchCurrentReferredUsersRequested());
      await flushPromises();

      expect(store.getState().currentUser.referredUsers).toEqual([
        { id: 'candidate-1' },
      ]);
    });
  });

  describe('fetchCurrentReferrerRequested', () => {
    it('stores the referrer on success', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentReferrer.mockResolvedValue({
        data: { id: 'referrer-1' },
      } as any);

      store.dispatch(actions.fetchCurrentReferrerRequested());
      await flushPromises();

      expect(store.getState().currentUser.referrer).toEqual({
        id: 'referrer-1',
      });
    });
  });

  describe('fetchCurrentUserSocialSituationRequested (unguarded)', () => {
    it('succeeds without needing an access token', async () => {
      const store = createTestStore();
      mockedApi.getUserSocialSituation.mockResolvedValue({
        data: { hasCompletedSurvey: true },
      } as any);

      store.dispatch(actions.fetchCurrentUserSocialSituationRequested());
      await flushPromises();

      expect(
        store.getState().currentUser.fetchCurrentUserSocialSituation.status
      ).toBe('SUCCEEDED');
    });

    it('fails when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getUserSocialSituation.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchCurrentUserSocialSituationRequested());
      await flushPromises();

      expect(
        store.getState().currentUser.fetchCurrentUserSocialSituation.status
      ).toBe('FAILED');
    });
  });
});
