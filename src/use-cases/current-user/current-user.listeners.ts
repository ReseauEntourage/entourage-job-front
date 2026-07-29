import { listenerMiddleware } from '@/src/store/listenerMiddleware';
// Imported from the slice directly (not the domain's barrel `index.ts`):
// `authentication.api.ts` itself imports `currentUserActions` from this
// domain's barrel, so importing `@/src/use-cases/authentication` here would
// form a circular import — harmless for lazily-accessed references (e.g.
// inside a saga generator), but this file accesses `authenticationSlice
// .actions.*` at module top level (registering listeners eagerly), which
// hits the TDZ mid-cycle. Mirrors `store/listenerMiddleware.ts`'s own
// Decision 9 listener for the same reason.
import { slice as authenticationSlice } from '../authentication/authentication.slice';
import {
  currentUserApi,
  DELETE_EXTERNAL_CV_FIXED_CACHE_KEY,
  FETCH_CURRENT_ACHIEVEMENTS_FIXED_CACHE_KEY,
  FETCH_CURRENT_COMPANY_FIXED_CACHE_KEY,
  FETCH_CURRENT_ORGANIZATION_FIXED_CACHE_KEY,
  FETCH_CURRENT_PROFILE_COMPLETE_FIXED_CACHE_KEY,
  FETCH_CURRENT_PROFILE_FIXED_CACHE_KEY,
  FETCH_CURRENT_READ_DOCUMENTS_FIXED_CACHE_KEY,
  FETCH_CURRENT_REFERRED_USERS_FIXED_CACHE_KEY,
  FETCH_CURRENT_REFERRER_FIXED_CACHE_KEY,
  FETCH_CURRENT_USER_SOCIAL_SITUATION_FIXED_CACHE_KEY,
  FETCH_STAFF_CONTACT_FIXED_CACHE_KEY,
  FETCH_USER_FIXED_CACHE_KEY,
  FETCH_USER_STATS_FIXED_CACHE_KEY,
  READ_DOCUMENT_FIXED_CACHE_KEY,
  UPDATE_ONBOARDING_STATUS_FIXED_CACHE_KEY,
  UPDATE_PROFILE_FIXED_CACHE_KEY,
  UPDATE_SOCIAL_SITUATION_FIXED_CACHE_KEY,
  UPDATE_USER_COMPANY_FIXED_CACHE_KEY,
  UPDATE_USER_FIXED_CACHE_KEY,
  UPDATE_USER_PROFILE_PICTURE_FIXED_CACHE_KEY,
  UPLOAD_EXTERNAL_CV_FIXED_CACHE_KEY,
} from './current-user.api';
import { slice } from './current-user.slice';

const { actions } = slice;

/** Translates `loginSucceededSaga`. */
listenerMiddleware.startListening({
  actionCreator: authenticationSlice.actions.loginSucceeded,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchUser.initiate(undefined, {
        fixedCacheKey: FETCH_USER_FIXED_CACHE_KEY,
      })
    );
  },
});

/** Translates `logoutSucceededSaga`. */
listenerMiddleware.startListening({
  actionCreator: authenticationSlice.actions.logoutSucceeded,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(actions.resetCurrentUser());
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchUserRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchUser.initiate(undefined, {
        fixedCacheKey: FETCH_USER_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchUserStatsRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchUserStats.initiate(undefined, {
        fixedCacheKey: FETCH_USER_STATS_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchStaffContactRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchStaffContact.initiate(undefined, {
        fixedCacheKey: FETCH_STAFF_CONTACT_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchCurrentUserSocialSituationRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchCurrentUserSocialSituation.initiate(
        undefined,
        {
          fixedCacheKey: FETCH_CURRENT_USER_SOCIAL_SITUATION_FIXED_CACHE_KEY,
        }
      )
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.updateUserRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.updateUser.initiate(action.payload, {
        fixedCacheKey: UPDATE_USER_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.updateUserCompanyRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.updateUserCompany.initiate(action.payload, {
        fixedCacheKey: UPDATE_USER_COMPANY_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.updateProfileRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.updateProfile.initiate(action.payload, {
        fixedCacheKey: UPDATE_PROFILE_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.updateSocialSituationRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.updateSocialSituation.initiate(action.payload, {
        fixedCacheKey: UPDATE_SOCIAL_SITUATION_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.updateOnboardingStatusRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.updateOnboardingStatus.initiate(action.payload, {
        fixedCacheKey: UPDATE_ONBOARDING_STATUS_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.readDocumentRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.readDocument.initiate(action.payload, {
        fixedCacheKey: READ_DOCUMENT_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.updateUserProfilePictureRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.updateUserProfilePicture.initiate(
        action.payload,
        { fixedCacheKey: UPDATE_USER_PROFILE_PICTURE_FIXED_CACHE_KEY }
      )
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.deleteExternalCvRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.deleteExternalCv.initiate(undefined, {
        fixedCacheKey: DELETE_EXTERNAL_CV_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.uploadExternalCvRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.uploadExternalCv.initiate(action.payload, {
        fixedCacheKey: UPLOAD_EXTERNAL_CV_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchCurrentProfileRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchCurrentProfile.initiate(undefined, {
        fixedCacheKey: FETCH_CURRENT_PROFILE_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchCurrentProfileCompleteRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchCurrentProfileComplete.initiate(undefined, {
        fixedCacheKey: FETCH_CURRENT_PROFILE_COMPLETE_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchCurrentCompanyRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchCurrentCompany.initiate(undefined, {
        fixedCacheKey: FETCH_CURRENT_COMPANY_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchCurrentOrganizationRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchCurrentOrganization.initiate(undefined, {
        fixedCacheKey: FETCH_CURRENT_ORGANIZATION_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchCurrentAchievementsRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchCurrentAchievements.initiate(undefined, {
        fixedCacheKey: FETCH_CURRENT_ACHIEVEMENTS_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchCurrentReadDocumentsRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchCurrentReadDocuments.initiate(undefined, {
        fixedCacheKey: FETCH_CURRENT_READ_DOCUMENTS_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchCurrentReferredUsersRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchCurrentReferredUsers.initiate(undefined, {
        fixedCacheKey: FETCH_CURRENT_REFERRED_USERS_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.fetchCurrentReferrerRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      currentUserApi.endpoints.fetchCurrentReferrer.initiate(undefined, {
        fixedCacheKey: FETCH_CURRENT_REFERRER_FIXED_CACHE_KEY,
      })
    );
  },
});
