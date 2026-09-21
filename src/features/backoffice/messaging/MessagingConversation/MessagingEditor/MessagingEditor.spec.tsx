jest.mock('@/src/api');

import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import {
  createTestStore,
  TestStore,
} from '@/src/store/testUtils/createTestStore';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { messagingActions, messagingApi } from '@/src/use-cases/messaging';
import { MessagingEditor } from './MessagingEditor';

// The component barrel (@/src/components/ui) transitively imports the
// ESM-only @react-hook/window-size (cf. MessagingWaitingReplyBanner.spec.tsx).
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const mockedApi = getMockedApi();

// Far beyond any plausible `keepUnusedDataFor`, and deliberately not
// hard-coding the library's default so the test survives a change to it.
const WELL_PAST_CACHE_GC = 10 * 60 * 1000;

const ADDRESSEE = {
  id: 'coach-42',
  firstName: 'Jane',
  lastName: 'Doe',
  role: 'Coach',
} as any;

const renderEditor = (store: TestStore) =>
  render(
    <Provider store={store}>
      <MessagingEditor />
    </Provider>
  );

const clickSend = () => {
  fireEvent.click(screen.getByTestId('messaging-send-button'));
};

describe('MessagingEditor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Before the fix, the addressee lived in the RTK Query cache under the
   * `'new'` key with no subscriber, so it was garbage-collected after
   * `keepUnusedDataFor`. Past that delay the send silently did nothing: no
   * request, no error, no trace. Anyone taking more than a minute to write
   * their first message simply could not send it.
   */
  it('sends a first message written long after the cache would have been collected', () => {
    jest.useFakeTimers();
    try {
      const store = createTestStore();
      store.dispatch(messagingActions.setNewConversationDraft([ADDRESSEE]));
      store.dispatch(messagingActions.selectConversation('new'));
      store.dispatch(messagingActions.setNewMessage('Bonjour, je vous écris…'));

      renderEditor(store);
      jest.advanceTimersByTime(WELL_PAST_CACHE_GC);

      clickSend();

      expect(mockedApi.postMessage).toHaveBeenCalledTimes(1);
      const formData = mockedApi.postMessage.mock.calls[0][0] as FormData;
      expect(formData.getAll('participantIds[]')).toEqual(['coach-42']);
      expect(formData.get('content')).toBe('Bonjour, je vous écris…');
    } finally {
      jest.useRealTimers();
    }
  });

  it('sends on an existing conversation using its id', async () => {
    const store = createTestStore();
    store.dispatch(messagingActions.selectConversation('conversation-7'));
    store.dispatch(messagingActions.setNewMessage('Merci !'));
    // Seeds the cache entry the editor reads for a real conversation.
    await store.dispatch(
      messagingApi.util.upsertQueryData(
        'getSelectedConversation',
        'conversation-7',
        {
          id: 'conversation-7',
          type: 'direct',
          messages: [],
          participants: [ADDRESSEE],
        } as any
      )
    );

    renderEditor(store);
    clickSend();

    expect(mockedApi.postMessage).toHaveBeenCalledTimes(1);
    const formData = mockedApi.postMessage.mock.calls[0][0] as FormData;
    expect(formData.get('conversationId')).toBe('conversation-7');
  });

  /**
   * A click on "send" must always produce something the user can see.
   * Returning quietly is what made a lost message indistinguishable from a
   * broken button, and left nothing to investigate server-side.
   */
  it('reports an error and keeps the typed text when the draft is missing', () => {
    const store = createTestStore();
    store.dispatch(messagingActions.selectConversation('new'));
    store.dispatch(messagingActions.setNewMessage('Message à ne pas perdre'));

    renderEditor(store);
    clickSend();

    expect(mockedApi.postMessage).not.toHaveBeenCalled();
    expect(store.getState().notifications.notifications).toHaveLength(1);
    expect(store.getState().notifications.notifications[0]).toMatchObject({
      type: 'danger',
    });
    // The text the user wrote survives the failure.
    expect(store.getState().messaging.newMessage).toBe(
      'Message à ne pas perdre'
    );
  });
});
