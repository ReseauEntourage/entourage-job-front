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
  setProfilesRoleFilter,
  incrementProfilesOffset,
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

export function* saga() {
  yield* takeLatest(fetchProfilesRequested, fetchProfilesSaga);
  yield* takeLatest(setProfilesRoleFilter, fetchProfilesSagaRequested);
  yield* takeLatest(incrementProfilesOffset, fetchProfilesSagaRequested);
  yield* takeLatest(fetchSelectedProfileRequested, fetchSelectedProfileSaga);
}
