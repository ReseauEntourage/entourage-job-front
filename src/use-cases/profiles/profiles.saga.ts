import { call, put, select, takeLatest, takeLeading } from 'typed-redux-saga';
import { Api } from 'src/api';
import { PROFILES_LIMIT } from 'src/constants';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { mutateToArray } from 'src/utils';
import {
  selectProfilesHasFetchedAll,
  selectProfilesOffset,
} from './profiles.selectors';
import { slice } from './profiles.slice';

const {
  fetchSelectedProfileRequested,
  fetchSelectedProfileSucceeded,
  fetchSelectedProfileFailed,
  fetchProfilesRequested,
  fetchProfilesSucceeded,
  fetchProfilesFailed,
  fetchProfilesNextPage,
  resetProfilesOffset,
  fetchProfilesWithFilters,
  fetchProfilesRecommendationsRequested,
  fetchProfilesRecommendationsSucceeded,
  fetchProfilesRecommendationsFailed,
  postInternalMessageRequested,
  postInternalMessageSucceeded,
  postInternalMessageFailed,
} = slice.actions;

function* fetchProfilesNextPageSaga(
  action: ReturnType<typeof fetchProfilesNextPage>
) {
  const hasFetchedAll = yield* select(selectProfilesHasFetchedAll);

  if (!hasFetchedAll) {
    yield* put(fetchProfilesRequested(action.payload));
  }
}

function* fetchProfilesWithFiltersSaga(
  action: ReturnType<typeof fetchProfilesWithFilters>
) {
  yield* put(resetProfilesOffset());
  yield* put(fetchProfilesRequested(action.payload));
}

function* fetchProfilesRequestedSaga(
  action: ReturnType<typeof fetchProfilesRequested>
) {
  try {
    const offset = yield* select(selectProfilesOffset);
    const limit = PROFILES_LIMIT;

    const {
      departments,
      role,
      search,
      helps,
      businessSectorIds,
      contactTypes,
    } = action.payload;

    const response = yield* call(() =>
      Api.getAllUsersProfiles({
        departments: mutateToArray(departments),
        businessSectorIds: mutateToArray(businessSectorIds),
        helps: mutateToArray(helps),
        contactTypes: mutateToArray(contactTypes),
        role,
        search,
        offset,
        limit,
      })
    );
    yield* put(fetchProfilesSucceeded(response.data));
  } catch {
    yield* put(fetchProfilesFailed());
  }
}

function* fetchProfilesRecommendationsRequestedSaga() {
  const userId = yield* select(selectCurrentUserId);
  try {
    const response = yield* call(() => Api.getProfilesRecommendations(userId));
    yield* put(fetchProfilesRecommendationsSucceeded(response.data));
  } catch {
    yield* put(fetchProfilesRecommendationsFailed());
  }
}

function* fetchSelectedProfileSaga(
  action: ReturnType<typeof fetchSelectedProfileRequested>
) {
  const { userId } = action.payload;
  try {
    const { data: profile } = yield* call(() =>
      Api.getPublicUserProfile(userId)
    );
    yield* put(fetchSelectedProfileSucceeded({ ...profile }));
  } catch {
    yield* put(fetchSelectedProfileFailed());
  }
}

function* postInternalMessageSaga(
  action: ReturnType<typeof postInternalMessageRequested>
) {
  try {
    const postInternalMessageResponse = yield* call(() =>
      Api.postInternalMessage(action.payload)
    );
    yield* put(postInternalMessageSucceeded(postInternalMessageResponse.data));
    const putProfileResponse = yield* call(() =>
      Api.getPublicUserProfile(action.payload.addresseeUserId)
    );
    yield* put(fetchSelectedProfileSucceeded(putProfileResponse.data));
  } catch {
    yield* put(postInternalMessageFailed());
  }
}

export function* saga() {
  yield* takeLatest(fetchProfilesWithFilters, fetchProfilesWithFiltersSaga);
  yield* takeLeading(fetchProfilesNextPage, fetchProfilesNextPageSaga);
  yield* takeLatest(fetchProfilesRequested, fetchProfilesRequestedSaga);
  yield* takeLatest(
    fetchProfilesRecommendationsRequested,
    fetchProfilesRecommendationsRequestedSaga
  );
  yield* takeLatest(fetchSelectedProfileRequested, fetchSelectedProfileSaga);
  yield* takeLatest(postInternalMessageRequested, postInternalMessageSaga);
}
