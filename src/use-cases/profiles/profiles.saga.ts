import { call, put, select, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import {
  selectProfilesFilters,
  selectProfilesHasFetchedAll,
} from './profiles.selectors';
import { slice } from './profiles.slice';

const {
  fetchSelectedProfileRequested,
  fetchSelectedProfileSucceeded,
  fetchSelectedProfileFailed,
  fetchProfilesRequested,
  fetchProfilesSucceeded,
  fetchProfilesFailed,
  setProfilesFilters,
  incrementProfilesOffset,
  postInternalMessageRequested,
  postInternalMessageSucceeded,
  postInternalMessageFailed,
} = slice.actions;

function* fetchProfilesSagaRequested() {
  const hasFetchedAll = yield* select(selectProfilesHasFetchedAll);

  if (!hasFetchedAll) {
    yield* put(fetchProfilesRequested());
  }
}

function* fetchProfilesSaga() {
  try {
    const filters = yield* select(selectProfilesFilters);
    const response = yield* call(() => Api.getAllUsersProfiles(filters));
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
  yield* takeLatest(fetchProfilesRequested, fetchProfilesSaga);
  yield* takeLatest(setProfilesFilters, fetchProfilesSagaRequested);
  yield* takeLatest(incrementProfilesOffset, fetchProfilesSagaRequested);
  yield* takeLatest(fetchSelectedProfileRequested, fetchSelectedProfileSaga);
  yield* takeLatest(postInternalMessageRequested, postInternalMessageSaga);
}
