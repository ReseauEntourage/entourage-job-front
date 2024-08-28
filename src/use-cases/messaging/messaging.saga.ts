import { call, put, select, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import { slice } from './messaging.slice';

const {
  getConversationsSucceeded,
  getConversationsFailed,
  getConversationsRequested,
  postMessageRequested,
  postMessageSucceeded,
  postMessageFailed,
  getConversationByIdRequested,
  getConversationByIdSucceeded,
  getConversationByIdFailed,
} = slice.actions;

function* getConversationsSagaRequested() {
  const query = yield* select((state) => state.messaging.query);
  try {
    const response = yield* call(() => Api.getConversations(query));
    yield* put(getConversationsSucceeded(response.data));
  } catch {
    yield* put(getConversationsFailed());
  }
}

function* getConversationByIdSagaRequested() {
  const selectedConversationId = yield* select(
    (state) => state.messaging.selectedConversationId
  );
  try {
    const response = yield* call(() =>
      Api.getConversationById(selectedConversationId)
    );
    yield* put(getConversationByIdSucceeded(response.data));
  } catch {
    yield* put(getConversationByIdFailed());
  }
}

function* postMessageSagaRequested(
  action: ReturnType<typeof postMessageRequested>
) {
  try {
    const response = yield* call(() => Api.postMessage(action.payload));
    yield* put(postMessageSucceeded(response.data));
  } catch {
    yield* put(postMessageFailed());
  }
}

export function* saga() {
  yield* takeLatest(getConversationsRequested, getConversationsSagaRequested);
  yield* takeLatest(postMessageRequested, postMessageSagaRequested);
  yield* takeLatest(
    getConversationByIdRequested,
    getConversationByIdSagaRequested
  );
}
