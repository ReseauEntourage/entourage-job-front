jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('./AssistantMessageBubble/AssistantMessageBubble', () => ({
  AssistantMessageBubble: ({
    content,
    status,
    isStreaming,
    onUseSuggestion,
  }: any) => (
    <div data-testid="assistant-bubble">
      <span data-testid="assistant-content">{content}</span>
      <span data-testid="assistant-status">{status ?? ''}</span>
      <span data-testid="assistant-streaming">{String(isStreaming)}</span>
      <button onClick={() => onUseSuggestion('texte suggéré')}>utiliser</button>
    </div>
  ),
}));

import { TextDecoder, TextEncoder } from 'util';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { ConversationType } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { messagingActions, messagingApi } from '@/src/use-cases/messaging';
import { MessagingAIAssistant } from './MessagingAIAssistant';
import {
  getContextualQuickAction,
  QUICK_ACTIONS,
} from './MessagingAIAssistant.utils';

Object.assign(globalThis, { TextDecoder, TextEncoder });

const mockedApi = getMockedApi();
const push = jest.fn();

const sse = (data: unknown) =>
  `data: ${typeof data === 'string' ? data : JSON.stringify(data)}\n\n`;

const makeResponse = (packets: string[], ok = true, hasBody = true) => {
  const encoder = new TextEncoder();
  const queue = packets.map((p) => encoder.encode(p));
  const reader = {
    read: async () => {
      const value = queue.shift();
      return value
        ? { done: false as const, value }
        : { done: true as const, value: undefined };
    },
  };
  return {
    ok,
    status: ok ? 200 : 500,
    body: hasBody ? { getReader: () => reader } : null,
  } as any;
};

const settle = () =>
  act(async () => {
    await jest.advanceTimersByTimeAsync(10);
    await jest.advanceTimersByTimeAsync(10);
  });

const conversationWithMessages = (count: number) => ({
  id: 'conv1',
  type: ConversationType.DIRECT,
  participants: [],
  messages: Array.from({ length: count }, (_, i) => ({ id: `m${i}` })),
});

async function setup({
  selected = 'conv1' as string | null,
  history = 0,
  session,
}: {
  selected?: string | null;
  history?: number;
  session?: any;
} = {}) {
  const store = createTestStore();
  if (session === undefined) {
    mockedApi.getAISession.mockResolvedValue({ data: { messages: [] } } as any);
  } else if (session instanceof Error) {
    mockedApi.getAISession.mockRejectedValue(session);
  } else {
    mockedApi.getAISession.mockResolvedValue({ data: session } as any);
  }
  store.dispatch(messagingActions.selectConversation(selected));
  if (selected && history) {
    store.dispatch(
      messagingApi.util.upsertQueryData(
        'getSelectedConversation',
        selected,
        conversationWithMessages(history) as any
      ) as any
    );
  }
  const utils = renderWithProviders(<MessagingAIAssistant />, { store });
  await settle();
  return { ...utils, store };
}

const input = () => screen.getByPlaceholderText(/Posez une question|Limite/);

const type = (value: string) =>
  fireEvent.change(input(), { target: { value } });

const press = (key: string, shiftKey = false) =>
  fireEvent.keyDown(input(), { key, shiftKey });

const send = async (text: string) => {
  type(text);
  press('Enter');
  await settle();
};

describe('MessagingAIAssistant', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    HTMLElement.prototype.scrollTo = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  describe('session', () => {
    it('shows the empty state when the conversation has no AI session yet', async () => {
      await setup();
      expect(mockedApi.getAISession).toHaveBeenCalledWith('conv1');
      expect(
        screen.getByText(/Posez une question ou utilisez une suggestion/)
      ).toBeInTheDocument();
    });

    it('restores the messages of an existing session', async () => {
      await setup({
        session: {
          messages: [
            { id: 'u1', role: 'user', content: 'Salut' },
            { id: 'a1', role: 'assistant', content: 'Bonjour !' },
          ],
        },
      });
      expect(screen.getByText('Salut')).toBeInTheDocument();
      expect(screen.getByTestId('assistant-content')).toHaveTextContent(
        'Bonjour !'
      );
      expect(screen.queryByText(/Posez une question ou utilisez/)).toBeNull();
    });

    it('starts fresh when the session cannot be fetched', async () => {
      await setup({ session: new Error('404') });
      expect(
        screen.getByText(/Posez une question ou utilisez une suggestion/)
      ).toBeInTheDocument();
    });

    it('does not fetch anything without a selected conversation', async () => {
      await setup({ selected: null });
      expect(mockedApi.getAISession).not.toHaveBeenCalled();
    });

    it('clears the discussion when another conversation is selected', async () => {
      const { store } = await setup({
        session: { messages: [{ id: 'u1', role: 'user', content: 'Salut' }] },
      });
      expect(screen.getByText('Salut')).toBeInTheDocument();
      mockedApi.getAISession.mockResolvedValue({
        data: { messages: [] },
      } as any);
      act(() => {
        store.dispatch(messagingActions.selectConversation('conv2'));
      });
      await settle();
      expect(mockedApi.getAISession).toHaveBeenLastCalledWith('conv2');
      expect(screen.queryByText('Salut')).toBeNull();
    });
  });

  describe('sending a message', () => {
    it('streams the answer into an assistant bubble', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([
          sse({ content: 'Bon' }),
          sse({ content: 'jour' }),
          sse('[DONE]'),
        ])
      );
      await setup();
      await send('  Aide-moi  ');

      expect(mockedApi.streamAIMessage).toHaveBeenCalledWith(
        'conv1',
        'Aide-moi'
      );
      expect(screen.getByText('Aide-moi')).toBeInTheDocument();
      expect(screen.getByTestId('assistant-content')).toHaveTextContent(
        'Bonjour'
      );
      expect(screen.getByTestId('assistant-streaming')).toHaveTextContent(
        'false'
      );
      expect(input()).toHaveValue('');
      expect(input()).not.toBeDisabled();
    });

    it('sends with the send button and ignores empty or shift+enter submissions', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([sse({ content: 'ok' }), sse('[DONE]')])
      );
      await setup();

      type('   ');
      press('Enter');
      expect(screen.getByTestId('messaging-ai-send-button')).toBeDisabled();
      expect(mockedApi.streamAIMessage).not.toHaveBeenCalled();

      type('Question');
      press('Enter', true);
      press('a');
      expect(mockedApi.streamAIMessage).not.toHaveBeenCalled();

      fireEvent.click(screen.getByTestId('messaging-ai-send-button'));
      await settle();
      expect(mockedApi.streamAIMessage).toHaveBeenCalledWith(
        'conv1',
        'Question'
      );
    });

    it('shows a loading state and locks the input while waiting for the stream', async () => {
      let resolveStream: (value: any) => void = () => {};
      mockedApi.streamAIMessage.mockReturnValue(
        new Promise((resolve) => {
          resolveStream = resolve;
        }) as any
      );
      await setup();
      await send('Question');
      expect(input()).toBeDisabled();
      expect(screen.getByTestId('assistant-streaming')).toHaveTextContent(
        'true'
      );
      // a second send is ignored while loading
      expect(screen.getByTestId('messaging-ai-reset-button')).toBeDisabled();

      resolveStream(makeResponse([sse({ content: 'fin' }), sse('[DONE]')]));
      await settle();
      expect(input()).not.toBeDisabled();
    });

    it('replaces the answer with a generic error when the request fails', async () => {
      mockedApi.streamAIMessage.mockRejectedValue(new Error('network'));
      await setup();
      await send('Question');
      expect(screen.getByTestId('assistant-content')).toHaveTextContent(
        'Une erreur est survenue. Veuillez réessayer.'
      );
    });

    it('shows the generic error on an HTTP error or a missing stream body', async () => {
      mockedApi.streamAIMessage.mockResolvedValueOnce(makeResponse([], false));
      await setup();
      await send('Un');
      expect(screen.getByTestId('assistant-content')).toHaveTextContent(
        'Une erreur est survenue. Veuillez réessayer.'
      );

      mockedApi.streamAIMessage.mockResolvedValueOnce(
        makeResponse([], true, false)
      );
      await send('Deux');
      expect(screen.getAllByTestId('assistant-content')[1]).toHaveTextContent(
        'Une erreur est survenue. Veuillez réessayer.'
      );
    });

    it('marks the answer as interrupted when the connection closes before the end', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([sse({ content: 'Début' })])
      );
      await setup();
      await send('Question');
      expect(screen.getByTestId('assistant-content')).toHaveTextContent(
        'Début'
      );
      expect(screen.getByTestId('assistant-status')).toHaveTextContent(
        'interrupted'
      );
    });

    it('keeps the partial answer when the stream fails after some content', async () => {
      const encoder = new TextEncoder();
      let calls = 0;
      mockedApi.streamAIMessage.mockResolvedValue({
        ok: true,
        status: 200,
        body: {
          getReader: () => ({
            read: async () => {
              calls += 1;
              if (calls === 1) {
                return {
                  done: false,
                  value: encoder.encode(sse({ content: 'Partiel' })),
                };
              }
              throw new Error('cut');
            },
          }),
        },
      } as any);
      await setup();
      await send('Question');
      expect(screen.getByTestId('assistant-content')).toHaveTextContent(
        'Partiel'
      );
      expect(screen.getByTestId('assistant-status')).toHaveTextContent(
        'interrupted'
      );
    });

    it('keeps the truncated status reported by the server', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([
          sse({ content: 'Long' }),
          sse({ type: 'truncated' }),
          sse('[DONE]'),
        ])
      );
      await setup();
      await send('Question');
      expect(screen.getByTestId('assistant-status')).toHaveTextContent(
        'truncated'
      );
    });

    it('shows the error sent by the server instead of the answer', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([sse({ error: 'Service indisponible' })])
      );
      await setup();
      await send('Question');
      expect(screen.getByTestId('assistant-content')).toHaveTextContent(
        'Service indisponible'
      );
    });

    it('turns a suggestion of the assistant into the draft message of the conversation', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([sse({ content: 'Voici' }), sse('[DONE]')])
      );
      const { store } = await setup();
      await send('Question');
      fireEvent.click(screen.getByText('utiliser'));
      expect(store.getState().messaging.newMessage).toBe('texte suggéré');
    });
  });

  describe('quick actions', () => {
    it('offers "start the discussion" when there is no history and sends the matching prompt', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([sse('[DONE]')])
      );
      await setup();
      const action = getContextualQuickAction(false);
      fireEvent.click(screen.getByText(action.label));
      await settle();
      expect(mockedApi.streamAIMessage).toHaveBeenCalledWith(
        'conv1',
        action.prompt
      );
    });

    it('offers "suggest a response" when the conversation has messages', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([sse('[DONE]')])
      );
      await setup({ history: 2 });
      expect(screen.queryByText('Démarrer la discussion')).toBeNull();
      const action = getContextualQuickAction(true);
      fireEvent.click(screen.getByText(action.label));
      await settle();
      expect(mockedApi.streamAIMessage).toHaveBeenCalledWith(
        'conv1',
        action.prompt
      );
    });

    it('sends the prompt of each fixed quick action', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([sse('[DONE]')])
      );
      await setup();
      fireEvent.click(screen.getByText(QUICK_ACTIONS[0].label));
      await settle();
      expect(mockedApi.streamAIMessage).toHaveBeenCalledWith(
        'conv1',
        QUICK_ACTIONS[0].prompt
      );
    });

    it('collapses and expands the quick actions', async () => {
      await setup();
      expect(screen.getByText(QUICK_ACTIONS[0].label)).toBeInTheDocument();
      fireEvent.click(screen.getByText('Suggestions rapides'));
      expect(screen.queryByText(QUICK_ACTIONS[0].label)).toBeNull();
      fireEvent.click(screen.getByText('Suggestions rapides'));
      expect(screen.getByText(QUICK_ACTIONS[0].label)).toBeInTheDocument();
    });
  });

  describe('escalation', () => {
    it('offers to contact the referent and opens the messaging with them', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([
          sse({
            type: 'escalate',
            referentUserId: 'ref1',
            referentName: 'Camille',
          }),
          sse('[DONE]'),
        ])
      );
      await setup();
      await send('Situation grave');
      expect(
        screen.getByTestId('messaging-ai-escalate-card')
      ).toHaveTextContent('Camille');
      fireEvent.click(screen.getByText('Contacter le référent'));
      expect(push).toHaveBeenCalledWith('/backoffice/messaging?userId=ref1');
    });
  });

  describe('rate limit', () => {
    it('warns when few messages remain, with plural and singular forms, and can be dismissed', async () => {
      mockedApi.streamAIMessage.mockResolvedValueOnce(
        makeResponse([
          sse({ type: 'rate_limit_info', remaining: 2 }),
          sse('[DONE]'),
        ])
      );
      await setup();
      await send('Un');
      expect(screen.getByText('2 messages')).toBeInTheDocument();
      expect(
        screen.getByText(/restants avant d'atteindre la limite horaire/)
      ).toBeInTheDocument();

      mockedApi.streamAIMessage.mockResolvedValueOnce(
        makeResponse([
          sse({ type: 'rate_limit_info', remaining: 1 }),
          sse('[DONE]'),
        ])
      );
      await send('Deux');
      expect(screen.getByText('1 message')).toBeInTheDocument();
      expect(
        screen.getByText(/restant avant d'atteindre la limite horaire/)
      ).toBeInTheDocument();
    });

    it('does not warn while plenty of messages remain', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([
          sse({ type: 'rate_limit_info', remaining: 8 }),
          sse('[DONE]'),
        ])
      );
      await setup();
      await send('Un');
      expect(
        screen.queryByText(/avant d'atteindre la limite horaire/)
      ).toBeNull();
    });

    it('blocks the input once the hourly limit is hit and unblocks it after the delay', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([sse({ type: 'rate_limit', resetInSeconds: 120 })])
      );
      await setup();
      await send('Un');

      expect(screen.getByTestId('assistant-content')).toHaveTextContent(
        'Limite horaire atteinte. Vous pourrez envoyer un nouveau message dans environ 2 minute(s).'
      );
      expect(
        screen.getByTestId('messaging-ai-rate-limit-alert')
      ).toHaveTextContent('Réessayez dans environ 2 minutes');
      expect(input()).toBeDisabled();
      expect(input()).toHaveAttribute(
        'placeholder',
        'Limite horaire atteinte...'
      );
      expect(screen.getByTestId('messaging-ai-send-button')).toBeDisabled();

      await act(async () => {
        await jest.advanceTimersByTimeAsync(121 * 1000);
      });
      expect(screen.queryByTestId('messaging-ai-rate-limit-alert')).toBeNull();
      expect(input()).not.toBeDisabled();
    });

    it('uses the singular form when less than a minute remains', async () => {
      mockedApi.streamAIMessage.mockResolvedValue(
        makeResponse([sse({ type: 'rate_limit', resetInSeconds: 30 })])
      );
      await setup();
      await send('Un');
      expect(
        screen.getByTestId('messaging-ai-rate-limit-alert')
      ).toHaveTextContent('Réessayez dans environ 1 minute.');
    });
  });

  describe('new discussion', () => {
    it('is disabled while there is nothing to reset', async () => {
      await setup();
      expect(screen.getByTestId('messaging-ai-reset-button')).toBeDisabled();
    });

    it('resets the session on the server and clears the messages', async () => {
      mockedApi.resetAISession.mockResolvedValue({} as any);
      await setup({
        session: { messages: [{ id: 'u1', role: 'user', content: 'Salut' }] },
      });
      fireEvent.click(screen.getByTestId('messaging-ai-reset-button'));
      await settle();
      expect(mockedApi.resetAISession).toHaveBeenCalledWith('conv1');
      expect(screen.queryByText('Salut')).toBeNull();
    });

    it('clears the messages locally even if the server reset fails', async () => {
      mockedApi.resetAISession.mockRejectedValue(new Error('500'));
      await setup({
        session: { messages: [{ id: 'u1', role: 'user', content: 'Salut' }] },
      });
      fireEvent.click(screen.getByTestId('messaging-ai-reset-button'));
      await settle();
      expect(screen.queryByText('Salut')).toBeNull();
    });
  });
});
