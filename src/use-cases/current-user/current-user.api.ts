import { Api } from '@/src/api';
import {
  CurrentUserCompany,
  CurrentUserOrganization,
  CurrentUserProfile,
  CurrentUserProfileComplete,
  CurrentUserReferredUser,
  CurrentUserReferrer,
  StaffContact,
  User,
  UserAchievement,
  UserProfile,
  UserStats,
} from '@/src/api/types';
import { DocumentNameType, STORAGE_KEYS } from '@/src/constants';
import { api } from '@/src/store/api/api.slice';
import { authenticationActions, selectAccessToken } from '../authentication';
import { notificationsActions } from '../notifications';
import {
  selectCurrentUser,
  selectCurrentUserId,
  selectCurrentUserProfileComplete,
} from './current-user.selectors';
import { slice } from './current-user.slice';

const {
  fetchUserSucceeded,
  fetchUserStatsSucceeded,
  fetchCurrentUserSocialSituationSucceeded,
  fetchStaffContactSucceeded,
  updateUserSucceeded,
  updateProfileSucceeded,
  updateOnboardingStatusSucceeded,
  updateUserProfilePictureSucceeded,
  uploadExternalCvSucceeded,
  deleteExternalCvSucceeded,
  fetchCurrentProfileSucceeded,
  fetchCurrentProfileCompleteSucceeded,
  fetchCurrentCompanySucceeded,
  fetchCurrentOrganizationSucceeded,
  fetchCurrentAchievementsSucceeded,
  fetchCurrentReadDocumentsSucceeded,
  fetchCurrentReferredUsersSucceeded,
  fetchCurrentReferrerSucceeded,
  fetchCurrentProfileCompleteRequested,
} = slice.actions;

// `'NOT_AUTHENTICATED'` (not `null`): RTK Query treats a `queryFn` result
// with a falsy `error` and no `data` as invalid.
const NOT_AUTHENTICATED = 'NOT_AUTHENTICATED';

export const FETCH_USER_FIXED_CACHE_KEY = 'fetchUser';
export const FETCH_USER_STATS_FIXED_CACHE_KEY = 'fetchUserStats';
export const FETCH_STAFF_CONTACT_FIXED_CACHE_KEY = 'fetchStaffContact';
export const FETCH_CURRENT_USER_SOCIAL_SITUATION_FIXED_CACHE_KEY =
  'fetchCurrentUserSocialSituation';
export const UPDATE_USER_FIXED_CACHE_KEY = 'updateUser';
export const UPDATE_USER_COMPANY_FIXED_CACHE_KEY = 'updateUserCompany';
export const UPDATE_PROFILE_FIXED_CACHE_KEY = 'updateProfile';
export const UPDATE_SOCIAL_SITUATION_FIXED_CACHE_KEY = 'updateSocialSituation';
export const UPDATE_ONBOARDING_STATUS_FIXED_CACHE_KEY =
  'updateOnboardingStatus';
export const READ_DOCUMENT_FIXED_CACHE_KEY = 'readDocument';
export const UPDATE_USER_PROFILE_PICTURE_FIXED_CACHE_KEY =
  'updateUserProfilePicture';
export const DELETE_EXTERNAL_CV_FIXED_CACHE_KEY = 'deleteExternalCv';
export const UPLOAD_EXTERNAL_CV_FIXED_CACHE_KEY = 'uploadExternalCv';
export const FETCH_CURRENT_PROFILE_FIXED_CACHE_KEY = 'fetchCurrentProfile';
export const FETCH_CURRENT_PROFILE_COMPLETE_FIXED_CACHE_KEY =
  'fetchCurrentProfileComplete';
export const FETCH_CURRENT_COMPANY_FIXED_CACHE_KEY = 'fetchCurrentCompany';
export const FETCH_CURRENT_ORGANIZATION_FIXED_CACHE_KEY =
  'fetchCurrentOrganization';
export const FETCH_CURRENT_ACHIEVEMENTS_FIXED_CACHE_KEY =
  'fetchCurrentAchievements';
export const FETCH_CURRENT_READ_DOCUMENTS_FIXED_CACHE_KEY =
  'fetchCurrentReadDocuments';
export const FETCH_CURRENT_REFERRED_USERS_FIXED_CACHE_KEY =
  'fetchCurrentReferredUsers';
export const FETCH_CURRENT_REFERRER_FIXED_CACHE_KEY = 'fetchCurrentReferrer';

export const currentUserApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** Translates `fetchUserRequestedSaga` + `fetchUserSucceededSaga`. */
    fetchUser: builder.mutation<User, void>({
      queryFn: async (_arg, { getState }) => {
        const accessToken = selectAccessToken(getState() as never);
        if (!accessToken) {
          return { error: NOT_AUTHENTICATED };
        }
        try {
          const { data } = await Api.getCurrentIdentity();
          return { data };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchUserSucceeded(data));
          try {
            localStorage.setItem(
              STORAGE_KEYS.ONBOARDING_COMPLETION_STATUS,
              data.onboardingStatus
            );
          } catch (e) {
            console.error(
              'Failed to store onboarding status in localStorage',
              e
            );
          }
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchUserStatsRequestedSaga`. */
    fetchUserStats: builder.mutation<UserStats, void>({
      queryFn: async (_arg, { getState }) => {
        const accessToken = selectAccessToken(getState() as never);
        if (!accessToken) {
          return { error: NOT_AUTHENTICATED };
        }
        try {
          const { data } = await Api.getCurrentStats();
          return { data };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchUserStatsSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchStaffContactRequestedSaga`. */
    fetchStaffContact: builder.mutation<StaffContact, void>({
      queryFn: async (_arg, { getState }) => {
        const accessToken = selectAccessToken(getState() as never);
        if (!accessToken) {
          return { error: NOT_AUTHENTICATED };
        }
        try {
          const { data } = await Api.getCurrentStaffContact();
          return { data };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchStaffContactSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchCurrentUserSocialSituationRequestedSaga` (unguarded). */
    fetchCurrentUserSocialSituation: builder.mutation<
      Partial<{ hasCompletedSurvey?: boolean }>,
      void
    >({
      queryFn: async () => {
        try {
          const { data } = await Api.getUserSocialSituation();
          return { data };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchCurrentUserSocialSituationSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `updateUserRequestedSaga`. */
    updateUser: builder.mutation<void, { userId: string; user: Partial<User> }>(
      {
        queryFn: async ({ userId, user }) => {
          try {
            await Api.putUser(userId, user);
            return { data: undefined };
          } catch (error) {
            return { error };
          }
        },
        onQueryStarted: async (
          { user },
          { dispatch, getState, queryFulfilled }
        ) => {
          const formerUser = selectCurrentUser(getState() as never);
          try {
            await queryFulfilled;
            dispatch(updateUserSucceeded({ user }));
            if (user.email && user.email !== formerUser?.email) {
              dispatch(authenticationActions.logoutRequested());
            }
          } catch {
            // Handled by the mutation's own error state; no data change needed.
          }
        },
      }
    ),
    /** Translates `updateUserCompanyRequestedSaga`. */
    updateUserCompany: builder.mutation<void, { companyName: string | null }>({
      queryFn: async ({ companyName }) => {
        try {
          await Api.putUserCompany(companyName);
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            currentUserApi.endpoints.fetchUser.initiate(undefined, {
              fixedCacheKey: FETCH_USER_FIXED_CACHE_KEY,
            })
          );
        } catch {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: `Une erreur est survenue lors de la mise à jour de l'entreprise. Veuillez réessayer.`,
            })
          );
        }
      },
    }),
    /** Translates `updateProfileRequestedSaga`. */
    updateProfile: builder.mutation<
      Partial<UserProfile>,
      { userId: string; userProfile: Partial<UserProfile> }
    >({
      queryFn: async ({ userId, userProfile }) => {
        try {
          const { data } = await Api.putUserProfile(userId, userProfile);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, getState, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateProfileSucceeded({ userProfile: data }));
          const profileComplete = selectCurrentUserProfileComplete(
            getState() as never
          );
          if (profileComplete) {
            dispatch(fetchCurrentProfileCompleteRequested());
          }
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `updateSocialSituationRequestedSaga`. */
    updateSocialSituation: builder.mutation<
      void,
      Partial<{
        nationality?: string;
        accommodation?: string;
        resources?: string;
        studiesLevel?: string;
        workingExperience?: string;
        jobSearchDuration?: string;
        hasCompletedSurvey?: boolean;
      }>
    >({
      queryFn: async (socialSituation, { getState }) => {
        // Throws (`assertIsDefined`) if there is no authenticated user —
        // mirrors the original saga's unguarded `select(selectCurrentUserId)`.
        const userId = selectCurrentUserId(getState() as never);
        try {
          await Api.updateUserSocialSituation(userId, {
            hasCompletedSurvey: true,
            ...socialSituation,
          });
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            currentUserApi.endpoints.fetchUser.initiate(undefined, {
              fixedCacheKey: FETCH_USER_FIXED_CACHE_KEY,
            })
          );
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `updateOnboardingStatusRequestedSaga`. */
    updateOnboardingStatus: builder.mutation<
      void,
      { onboardingStatus: User['onboardingStatus'] }
    >({
      queryFn: async ({ onboardingStatus }, { getState }) => {
        const userId = selectCurrentUserId(getState() as never);
        try {
          await Api.putUser(userId, { onboardingStatus });
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (
        { onboardingStatus },
        { dispatch, queryFulfilled }
      ) => {
        try {
          await queryFulfilled;
          dispatch(updateOnboardingStatusSucceeded({ onboardingStatus }));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /**
     * Translates `readDocumentRequestedSaga`. `Api.postReadDocument` is
     * deliberately not awaited (mirrors the original saga, which fired it
     * without `yield*` — success and the subsequent user refetch happen
     * unconditionally once `userId` is known, regardless of that call's
     * outcome).
     */
    readDocument: builder.mutation<void, { documentName: DocumentNameType }>({
      queryFn: ({ documentName }, { getState }) => {
        const userId = selectCurrentUserId(getState() as never);
        Api.postReadDocument({ documentName }, userId);
        return { data: undefined };
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch {
          // fall through — the user refetch below still runs, mirroring the
          // original saga's unconditional `yield* fetchUserRequestedSaga()`.
        }
        dispatch(
          currentUserApi.endpoints.fetchUser.initiate(undefined, {
            fixedCacheKey: FETCH_USER_FIXED_CACHE_KEY,
          })
        );
      },
    }),
    /** Translates `updateUserProfilePictureRequestedSaga`. */
    updateUserProfilePicture: builder.mutation<void, { profileImage: Blob }>({
      queryFn: async ({ profileImage }) => {
        try {
          const formData = new FormData();
          formData.append('profileImage', profileImage);
          await Api.postProfileImage(formData);
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(updateUserProfilePictureSucceeded());
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `deleteExternalCvRequestedSaga`. */
    deleteExternalCv: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          await Api.deleteExternalCv();
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(deleteExternalCvSucceeded());
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: `Le CV a bien été supprimé`,
            })
          );
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `uploadExternalCvRequestedSaga`. */
    uploadExternalCv: builder.mutation<void, { formData: FormData }>({
      queryFn: async ({ formData }) => {
        try {
          await Api.postExternalCv(formData);
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(uploadExternalCvSucceeded());
        } catch {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: `Une erreur est survenue lors de l'import du CV. Veuillez réessayer.`,
            })
          );
        }
      },
    }),
    /** Translates `fetchCurrentProfileRequestedSaga`. */
    fetchCurrentProfile: builder.mutation<CurrentUserProfile, void>({
      queryFn: async (_arg, { getState }) => {
        const accessToken = selectAccessToken(getState() as never);
        if (!accessToken) {
          return { error: NOT_AUTHENTICATED };
        }
        try {
          const { data } = await Api.getCurrentProfile();
          return { data };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchCurrentProfileSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchCurrentProfileCompleteRequestedSaga`. */
    fetchCurrentProfileComplete: builder.mutation<
      CurrentUserProfileComplete,
      void
    >({
      queryFn: async (_arg, { getState }) => {
        const accessToken = selectAccessToken(getState() as never);
        if (!accessToken) {
          return { error: NOT_AUTHENTICATED };
        }
        try {
          const { data } = await Api.getCurrentProfileComplete();
          return { data };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchCurrentProfileCompleteSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchCurrentCompanyRequestedSaga`. */
    fetchCurrentCompany: builder.mutation<CurrentUserCompany, void>({
      queryFn: async (_arg, { getState }) => {
        const accessToken = selectAccessToken(getState() as never);
        if (!accessToken) {
          return { error: NOT_AUTHENTICATED };
        }
        try {
          const { data } = await Api.getCurrentCompany();
          return { data };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchCurrentCompanySucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchCurrentOrganizationRequestedSaga`. */
    fetchCurrentOrganization: builder.mutation<CurrentUserOrganization, void>({
      queryFn: async (_arg, { getState }) => {
        const accessToken = selectAccessToken(getState() as never);
        if (!accessToken) {
          return { error: NOT_AUTHENTICATED };
        }
        try {
          const { data } = await Api.getCurrentOrganization();
          return { data };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchCurrentOrganizationSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchCurrentAchievementsRequestedSaga`. */
    fetchCurrentAchievements: builder.mutation<UserAchievement[], void>({
      queryFn: async (_arg, { getState }) => {
        const accessToken = selectAccessToken(getState() as never);
        if (!accessToken) {
          return { error: NOT_AUTHENTICATED };
        }
        try {
          const { data } = await Api.getCurrentAchievements();
          return { data: data.achievements };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchCurrentAchievementsSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchCurrentReadDocumentsRequestedSaga`. */
    fetchCurrentReadDocuments: builder.mutation<
      { documentName: string; createdAt: string }[],
      void
    >({
      queryFn: async (_arg, { getState }) => {
        const accessToken = selectAccessToken(getState() as never);
        if (!accessToken) {
          return { error: NOT_AUTHENTICATED };
        }
        try {
          const { data } = await Api.getCurrentReadDocuments();
          return { data: data.readDocuments };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchCurrentReadDocumentsSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchCurrentReferredUsersRequestedSaga`. */
    fetchCurrentReferredUsers: builder.mutation<
      { referredCandidates: CurrentUserReferredUser[] },
      void
    >({
      queryFn: async (_arg, { getState }) => {
        const accessToken = selectAccessToken(getState() as never);
        if (!accessToken) {
          return { error: NOT_AUTHENTICATED };
        }
        try {
          const { data } = await Api.getCurrentReferredUsers();
          return { data };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchCurrentReferredUsersSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchCurrentReferrerRequestedSaga`. */
    fetchCurrentReferrer: builder.mutation<CurrentUserReferrer, void>({
      queryFn: async (_arg, { getState }) => {
        const accessToken = selectAccessToken(getState() as never);
        if (!accessToken) {
          return { error: NOT_AUTHENTICATED };
        }
        try {
          const { data } = await Api.getCurrentReferrer();
          return { data };
        } catch (error) {
          console.error(error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchCurrentReferrerSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useUpdateProfileMutation,
  useUpdateSocialSituationMutation,
  useReadDocumentMutation,
} = currentUserApi;
