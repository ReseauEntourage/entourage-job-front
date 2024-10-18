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
  getSelectedConversationRequested,
  getSelectedConversationSucceeded,
  getSelectedConversationFailed,
  getUnseenConversationsCountRequested,
  getUnseenConversationsCountSucceeded,
  getUnseenConversationsCountFailed,
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

function* getUnseenConversationsCountSagaRequested() {
  try {
    const response = yield* call(() => Api.getUnseenConversationsCount());
    yield* put(getUnseenConversationsCountSucceeded(response.data));
  } catch {
    yield* put(getUnseenConversationsCountFailed());
  }
}

function* getSelectedConversationSagaRequested() {
  const selectedConversationId = yield* select(
    (state) => state.messaging.selectedConversationId
  );
  if (selectedConversationId) {
    try {
      const response = yield* call(() =>
        Api.getConversationById(selectedConversationId)
      );
      yield* put(getSelectedConversationSucceeded(response.data));
    } catch {
      yield* put(getSelectedConversationFailed());
    }
  } else {
    yield* put(getSelectedConversationFailed());
  }
}

function* postMessageSagaRequested(
  action: ReturnType<typeof postMessageRequested>
) {
  try {
    const response = yield* call(() => Api.postMessage(action.payload));
    yield* put(
      postMessageSucceeded({
        message: response.data,
        isNewConversation: !action.payload.conversationId,
      })
    );
  } catch {
    yield* put(postMessageFailed());
  }
}

export function* saga() {
  yield* takeLatest(getConversationsRequested, getConversationsSagaRequested);
  yield* takeLatest(postMessageRequested, postMessageSagaRequested);
  yield* takeLatest(
    getSelectedConversationRequested,
    getSelectedConversationSagaRequested
  );
  yield* takeLatest(
    getUnseenConversationsCountRequested,
    getUnseenConversationsCountSagaRequested
  );
}
