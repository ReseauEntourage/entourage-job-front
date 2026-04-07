import { call, put, takeEvery, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import { slice as messagingSlice } from 'src/use-cases/messaging/messaging.slice';
import { slice } from './gamification.slice';

const {
  achievementProgressionsInitialized,
  achievementProgressionReceived,
  fetchAchievementProgressionInitial,
} = slice.actions;

function* fetchInitialProgressionSaga() {
  try {
    const { data } = yield* call(() => Api.getAchievementProgression());
    yield* put(achievementProgressionsInitialized(data));
  } catch {
    // Non-critical: silently ignore failures so the UI is not affected
  }
}

function* fetchProgressionAfterMessageSaga() {
  try {
    const { data } = yield* call(() => Api.getAchievementProgression());
    yield* put(achievementProgressionReceived(data));
  } catch {
    // Non-critical: silently ignore failures so the UI is not affected
  }
}

export function* saga() {
  yield* takeLatest(
    fetchAchievementProgressionInitial,
    fetchInitialProgressionSaga
  );
  yield* takeEvery(
    messagingSlice.actions.postMessageSucceeded,
    fetchProgressionAfterMessageSaga
  );
}
