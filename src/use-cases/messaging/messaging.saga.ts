import { call, put, select, take, takeLatest } from 'typed-redux-saga';
import { notificationsActions } from '../notifications';
import { Api } from 'src/api';
import { isMessagingDailyConversationLimitReachedError } from 'src/api/axiosErrors';
import { ConversationParticipant } from 'src/api/types';
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
  bindNewConversationRequested,
  bindNewConversationSucceeded,
  postFeedbackRequested,
  postFeedbackSucceeded,
  postFeedbackFailed,
} = slice.actions;

function* bindNewConversationSagaRequested(
  action: ReturnType<typeof bindNewConversationRequested>
) {
  const { payload: requiredConvUserId } = action;
  yield* put(getConversationsRequested());
  yield* take(getConversationsSucceeded.type);

  if (requiredConvUserId) {
    const response = yield* call(() =>
      Api.getPublicUserProfile(requiredConvUserId)
    );
    const profile = response.data;
    const user = {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.role,
      userProfile: profile,
    } as ConversationParticipant;

    yield* put(bindNewConversationSucceeded([user]));
  }
}

function* getConversationsSagaRequested() {
  try {
    const response = yield* call(() => Api.getConversations());
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
        isNewConversation: !action.payload.get('conversationId'),
      })
    );
  } catch (error: unknown) {
    yield* put(postMessageFailed());
    if (isMessagingDailyConversationLimitReachedError(error)) {
      yield* put(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Nous sommes désolés, vous avez déjà contacté le maximum de membres aujourd’hui. Laissez le temps aux membres de vous répondre ! Si besoin, vous pourrez en contacter plus à partir de demain !`,
        })
      );
    }
  }
}

function* postFeedbackSagaRequested(
  action: ReturnType<typeof postFeedbackRequested>
) {
  try {
    yield* call(() => Api.postConversationFeedback(action.payload));
    yield* put(postFeedbackSucceeded());
  } catch {
    yield* put(postFeedbackFailed());
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
  yield* takeLatest(
    bindNewConversationRequested,
    bindNewConversationSagaRequested
  );
  yield* takeLatest(postFeedbackRequested, postFeedbackSagaRequested);
}
