jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import {
  authenticationActions,
  logoutSelectors,
} from '@/src/use-cases/authentication';
import {
  fetchCurrentUserSocialSituationSelectors,
  fetchUserSelectors,
  readDocumentSelectors,
  selectCurrentUserAchievements,
  selectCurrentUserCompany,
  selectCurrentUserOrganization,
  selectCurrentUserReadDocuments,
  selectCurrentUserReferredUsers,
  selectCurrentUserReferrer,
  selectCurrentUserStats,
  selectFetchCurrentAchievementsStatus,
  selectFetchCurrentCompanyStatus,
  selectFetchCurrentOrganizationStatus,
  selectFetchCurrentProfileCompleteStatus,
  selectFetchCurrentProfileStatus,
  selectFetchCurrentReadDocumentsStatus,
  selectFetchCurrentReferredUsersStatus,
  selectFetchCurrentReferrerStatus,
  selectFetchUserStatsStatus,
  updateProfileSelectors,
  updateSocialSituationSelectors,
  updateUserProfilePictureSelectors,
  updateUserSelectors,
  uploadExternalCvSelectors,
} from './current-user.selectors';
import { slice } from './current-user.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

function buildAuthenticatedStore() {
  seedAccessToken('token-123');
  return createTestStore();
}

describe('current-user api', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchUserRequested', () => {
    it('fetches the current user and stores it when authenticated', async () => {
      const store = buildAuthenticatedStore();
      const user = { id: 'user-1', onboardingStatus: 'IN_PROGRESS' } as any;
      mockedApi.getCurrentIdentity.mockResolvedValue({ data: user } as any);

      store.dispatch(actions.fetchUserRequested());
      await flushPromises();

      expect(store.getState().currentUser.user).toEqual(user);
      expect(
        fetchUserSelectors.selectIsFetchUserSucceeded(store.getState())
      ).toBe(true);
    });

    it('fails without calling the API when there is no access token', async () => {
      const store = createTestStore();

      store.dispatch(actions.fetchUserRequested());
      await flushPromises();

      expect(mockedApi.getCurrentIdentity).not.toHaveBeenCalled();
      expect(fetchUserSelectors.selectIsFetchUserFailed(store.getState())).toBe(
        true
      );
    });

    it('fails when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockRejectedValue(
        new Error('network error')
      );

      store.dispatch(actions.fetchUserRequested());
      await flushPromises();

      expect(fetchUserSelectors.selectIsFetchUserFailed(store.getState())).toBe(
        true
      );
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

      expect(updateUserSelectors.selectUpdateUserStatus(store.getState())).toBe(
        'SUCCEEDED'
      );
      expect(logoutSelectors.selectIsLogoutIdle(store.getState())).toBe(true);
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

      expect(logoutSelectors.selectIsLogoutSucceeded(store.getState())).toBe(
        true
      );
    });

    it('fails when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.putUser.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateUserRequested({
          userId: 'user-1',
          user: { email: 'new@example.com' },
        })
      );
      await flushPromises();

      expect(updateUserSelectors.selectUpdateUserStatus(store.getState())).toBe(
        'FAILED'
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
    });

    it('fails when the API call rejects', async () => {
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

      expect(
        store.getState().currentUser.user?.onboardingStatus
      ).toBeUndefined();
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

      expect(store.getState().currentUser.user).toEqual(refreshedUser);
    });

    it('notifies a danger message when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.putUserCompany.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateUserCompanyRequested({ companyName: 'Acme' })
      );
      await flushPromises();

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

    it('fails when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.putUserProfile.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateProfileRequested({
          userId: 'user-1',
          userProfile: {} as any,
        })
      );
      await flushPromises();

      expect(
        updateProfileSelectors.selectUpdateProfileStatus(store.getState())
      ).toBe('FAILED');
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

      expect(
        updateSocialSituationSelectors.selectIsUpdateSocialSituationSucceeded(
          store.getState()
        )
      ).toBe(true);
      expect(store.getState().currentUser.user).toEqual(refreshedUser);
    });

    it('fails when the API call rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);
      store.dispatch(actions.fetchUserRequested());
      await flushPromises();
      mockedApi.updateUserSocialSituation.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.updateSocialSituationRequested({}));
      await flushPromises();

      expect(
        updateSocialSituationSelectors.selectIsUpdateSocialSituationFailed(
          store.getState()
        )
      ).toBe(true);
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

      expect(
        readDocumentSelectors.selectReadDocumentStatus(store.getState())
      ).toBe('SUCCEEDED');
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

      expect(
        updateUserProfilePictureSelectors.selectUpdateUserProfilePictureStatus(
          store.getState()
        )
      ).toBe('SUCCEEDED');
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

      expect(
        updateUserProfilePictureSelectors.selectUpdateUserProfilePictureStatus(
          store.getState()
        )
      ).toBe('FAILED');
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

      expect(
        uploadExternalCvSelectors.selectIsUploadExternalCvSucceeded(
          store.getState()
        )
      ).toBe(true);
    });

    it('notifies and fails when the upload rejects', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.postExternalCv.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.uploadExternalCvRequested({ formData: new FormData() })
      );
      await flushPromises();

      expect(
        uploadExternalCvSelectors.selectIsUploadExternalCvFailed(
          store.getState()
        )
      ).toBe(true);
      expect(store.getState().notifications.notifications).toHaveLength(1);
    });
  });

  const guardedFetchers: {
    name: string;
    requested: () => { type: string; payload: unknown };
    apiMethod: keyof ReturnType<typeof getMockedApi>;
    mockData: unknown;
    selectStatus: (state: any) => string;
    selectResult?: (state: any) => unknown;
    expectedResult?: unknown;
  }[] = [
    {
      name: 'fetchStaffContactRequested',
      requested: () => actions.fetchStaffContactRequested(),
      apiMethod: 'getCurrentStaffContact',
      mockData: { name: 'Coach' },
      selectStatus: () => 'unused',
      selectResult: (state) => state.currentUser.staffContact,
      expectedResult: { name: 'Coach' },
    },
    {
      name: 'fetchCurrentProfileRequested',
      requested: () => actions.fetchCurrentProfileRequested(),
      apiMethod: 'getCurrentProfile',
      mockData: { id: 'profile-1' },
      selectStatus: selectFetchCurrentProfileStatus,
      selectResult: (state) => state.currentUser.profile,
      expectedResult: { id: 'profile-1' },
    },
    {
      name: 'fetchCurrentCompanyRequested',
      requested: () => actions.fetchCurrentCompanyRequested(),
      apiMethod: 'getCurrentCompany',
      mockData: { id: 'company-1' },
      selectStatus: selectFetchCurrentCompanyStatus,
      selectResult: selectCurrentUserCompany,
      expectedResult: { id: 'company-1' },
    },
    {
      name: 'fetchCurrentOrganizationRequested',
      requested: () => actions.fetchCurrentOrganizationRequested(),
      apiMethod: 'getCurrentOrganization',
      mockData: { id: 'org-1' },
      selectStatus: selectFetchCurrentOrganizationStatus,
      selectResult: selectCurrentUserOrganization,
      expectedResult: { id: 'org-1' },
    },
    {
      name: 'fetchUserStatsRequested',
      requested: () => actions.fetchUserStatsRequested(),
      apiMethod: 'getCurrentStats',
      mockData: { profileViews: 3 },
      selectStatus: selectFetchUserStatsStatus,
      selectResult: selectCurrentUserStats,
      expectedResult: { profileViews: 3 },
    },
  ];

  guardedFetchers.forEach(
    ({
      name,
      requested,
      apiMethod,
      mockData,
      selectStatus,
      selectResult,
      expectedResult,
    }) => {
      describe(name, () => {
        it('succeeds and stores the API payload when authenticated', async () => {
          const store = buildAuthenticatedStore();
          (mockedApi[apiMethod] as jest.Mock).mockResolvedValue({
            data: mockData,
          });

          store.dispatch(requested());
          await flushPromises();

          if (selectResult) {
            expect(selectResult(store.getState())).toEqual(expectedResult);
          } else {
            expect(selectStatus(store.getState())).toBe('REQUESTED');
          }
        });

        it('fails without calling the API when there is no access token', async () => {
          const store = createTestStore();

          store.dispatch(requested());
          await flushPromises();

          expect(mockedApi[apiMethod]).not.toHaveBeenCalled();
        });

        it('fails when the API call rejects', async () => {
          const store = buildAuthenticatedStore();
          (mockedApi[apiMethod] as jest.Mock).mockRejectedValue(
            new Error('boom')
          );

          store.dispatch(requested());
          await flushPromises();

          expect(mockedApi[apiMethod]).toHaveBeenCalled();
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

      expect(selectCurrentUserAchievements(store.getState())).toEqual([
        { id: 'ach-1' },
      ]);
      expect(selectFetchCurrentAchievementsStatus(store.getState())).toBe(
        'SUCCEEDED'
      );
    });

    it('fails without calling the API when there is no access token', async () => {
      const store = createTestStore();

      store.dispatch(actions.fetchCurrentAchievementsRequested());
      await flushPromises();

      expect(mockedApi.getCurrentAchievements).not.toHaveBeenCalled();
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

      expect(selectCurrentUserReadDocuments(store.getState())).toEqual([
        { documentName: 'cgu', createdAt: 'now' },
      ]);
      expect(selectFetchCurrentReadDocumentsStatus(store.getState())).toBe(
        'SUCCEEDED'
      );
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

      expect(selectCurrentUserReferredUsers(store.getState())).toEqual([
        { id: 'candidate-1' },
      ]);
      expect(selectFetchCurrentReferredUsersStatus(store.getState())).toBe(
        'SUCCEEDED'
      );
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

      expect(selectCurrentUserReferrer(store.getState())).toEqual({
        id: 'referrer-1',
      });
      expect(selectFetchCurrentReferrerStatus(store.getState())).toBe(
        'SUCCEEDED'
      );
    });
  });

  describe('fetchCurrentProfileCompleteRequested', () => {
    it('stores the complete profile and marks complete on success', async () => {
      const store = buildAuthenticatedStore();
      mockedApi.getCurrentProfileComplete.mockResolvedValue({
        data: { id: 'profile-1' },
      } as any);

      store.dispatch(actions.fetchCurrentProfileCompleteRequested());
      await flushPromises();

      expect(store.getState().currentUser.profileComplete).toEqual({
        id: 'profile-1',
      });
      expect(store.getState().currentUser.complete).toBe(true);
      expect(selectFetchCurrentProfileCompleteStatus(store.getState())).toBe(
        'SUCCEEDED'
      );
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
        fetchCurrentUserSocialSituationSelectors.selectIsFetchCurrentUserSocialSituationSucceeded(
          store.getState()
        )
      ).toBe(true);
    });

    it('fails when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getUserSocialSituation.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchCurrentUserSocialSituationRequested());
      await flushPromises();

      expect(
        fetchCurrentUserSocialSituationSelectors.selectIsFetchCurrentUserSocialSituationFailed(
          store.getState()
        )
      ).toBe(true);
    });
  });
});
