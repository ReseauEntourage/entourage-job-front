import { call, put, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import { slice } from './profiles.slice';

const {
  fetchSelectedProfileRequested,
  fetchSelectedProfileSucceeded,
  fetchSelectedProfileFailed,
  fetchProfilesListRequested,
  // fetchProfilesListSucceeded,
  fetchProfilesListFailed,
} = slice.actions;

function* fetchProfilesListSaga() {
  try {
    yield* call(() =>
      // make call to Api to get list of profiles
      {
        return {};
      }
    );
    // yield* put(fetchProfilesListSucceeded(response.data));
  } catch {
    yield* put(fetchProfilesListFailed());
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
  yield* takeLatest(fetchProfilesListRequested, fetchProfilesListSaga);
  yield* takeLatest(fetchSelectedProfileRequested, fetchSelectedProfileSaga);
}
