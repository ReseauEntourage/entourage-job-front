import { call, put, select, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import { PROFILES_LIMIT } from 'src/constants';
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

    const { departments, role, search, helps, businessLines } = action.payload;

    const response = yield* call(() =>
      Api.getAllUsersProfiles({
        departments: mutateToArray(departments),
        businessLines: mutateToArray(businessLines),
        helps: mutateToArray(helps),
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

function* fetchSelectedProfileSaga(
  action: ReturnType<typeof fetchSelectedProfileRequested>
) {
  const { userId } = action.payload;
  try {
    const response = yield* call(() => Api.getPublicUserProfile(userId));
    yield* put(fetchSelectedProfileSucceeded(response.data));
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
  yield* takeLatest(fetchProfilesNextPage, fetchProfilesNextPageSaga);
  yield* takeLatest(fetchProfilesRequested, fetchProfilesRequestedSaga);
  yield* takeLatest(fetchSelectedProfileRequested, fetchSelectedProfileSaga);
  yield* takeLatest(postInternalMessageRequested, postInternalMessageSaga);
}
