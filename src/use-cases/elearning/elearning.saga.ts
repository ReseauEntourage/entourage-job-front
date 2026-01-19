import { call, put, takeLatest } from 'typed-redux-saga';
import { Api } from '@/src/api';
import { slice } from './elearning.slice';

const {
  fetchElearningUnitsRequested,
  fetchElearningUnitsSucceeded,
  fetchElearningUnitsFailed,
  postElearningCompletionRequested,
  postElearningCompletionSucceeded,
  postElearningCompletionFailed,
} = slice.actions;

function* fetchElearningUnitsRequestedSaga(
  action: ReturnType<typeof fetchElearningUnitsRequested>
) {
  const userRole = action.payload;
  try {
    const { data } = yield* call(() =>
      Api.getAllElearningUnits({
        limit: 10,
        offset: 0,
        role: userRole,
      })
    );
    yield* put(fetchElearningUnitsSucceeded(data));
  } catch (error) {
    console.error('Error fetching elearning units:', error);
    yield* put(fetchElearningUnitsFailed());
  }
}

function* postElearningCompletionRequestedSaga(
  action: ReturnType<typeof postElearningCompletionRequested>
) {
  const { unitId } = action.payload;
  try {
    const { data } = yield* call(() => Api.postElearningCompletion(unitId));
    yield* put(postElearningCompletionSucceeded(data));
  } catch (error) {
    console.error('Error posting elearning completion:', error);
    yield* put(postElearningCompletionFailed());
  }
}

export function* saga() {
  yield* takeLatest(
    fetchElearningUnitsRequested,
    fetchElearningUnitsRequestedSaga
  );
  yield* takeLatest(
    postElearningCompletionRequested,
    postElearningCompletionRequestedSaga
  );
}
