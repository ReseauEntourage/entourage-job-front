import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import {
  FETCH_DASHBOARD_PROFILES_RECOMMENDATIONS_FIXED_CACHE_KEY,
  FETCH_PROFILES_FIXED_CACHE_KEY,
  FETCH_SELECTED_PROFILE_FIXED_CACHE_KEY,
  profilesApi,
} from './profiles.api';
import {
  selectProfilesHasFetchedAll,
  selectProfilesOffset,
} from './profiles.selectors';
import { slice } from './profiles.slice';

const { actions } = slice;

/** Translates `fetchProfilesWithFiltersSaga`. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchProfilesWithFilters,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(actions.resetProfilesOffset());
    listenerApi.dispatch(actions.fetchProfilesRequested(action.payload));
  },
});

/**
 * Translates `fetchProfilesNextPageSaga`: only paginate past a page that
 * itself succeeded (mirrors the original `status === SUCCEEDED` guard, not
 * just "not currently loading") — an idle/failed `fetchProfiles` state
 * should not advance the offset.
 */
listenerMiddleware.startListening({
  actionCreator: actions.fetchProfilesNextPage,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as never;
    const hasFetchedAll = selectProfilesHasFetchedAll(state);
    const isFetchSucceeded = profilesApi.endpoints.fetchProfiles.select(
      FETCH_PROFILES_FIXED_CACHE_KEY
    )(state).isSuccess;

    if (!hasFetchedAll && isFetchSucceeded) {
      listenerApi.dispatch(actions.incrementProfilesOffset());
      listenerApi.dispatch(actions.fetchProfilesRequested(action.payload));
    }
  },
});

/** Translates `fetchProfilesRequestedSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchProfilesRequested,
  effect: (action, listenerApi) => {
    const offset = selectProfilesOffset(listenerApi.getState() as never);
    listenerApi.dispatch(
      profilesApi.endpoints.fetchProfiles.initiate(
        { ...action.payload, offset },
        { fixedCacheKey: FETCH_PROFILES_FIXED_CACHE_KEY }
      )
    );
  },
});

/** Translates `fetchDashboardProfilesRecommendationsRequestedSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchDashboardProfilesRecommendationsRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      profilesApi.endpoints.fetchDashboardProfilesRecommendations.initiate(
        undefined,
        {
          fixedCacheKey:
            FETCH_DASHBOARD_PROFILES_RECOMMENDATIONS_FIXED_CACHE_KEY,
        }
      )
    );
  },
});

/** Translates `fetchSelectedProfileSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchSelectedProfileRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      profilesApi.endpoints.fetchSelectedProfile.initiate(action.payload, {
        fixedCacheKey: FETCH_SELECTED_PROFILE_FIXED_CACHE_KEY,
      })
    );
  },
});
