jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/hooks/useContactEligibility', () => ({
  useContactEligibility: jest.fn(),
}));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsDesktop: jest.fn(),
}));
jest.mock('./MessagingConversation/MessagingConversation', () => ({
  MessagingConversation: () => <div data-testid="conversation" />,
}));
jest.mock('./MessagingConversationsList/MessagingConversationList', () => ({
  MessagingConversationList: () => <div data-testid="conversation-list" />,
}));

import { act, cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { useContactEligibility } from '@/src/hooks/useContactEligibility';
import { useIsDesktop } from '@/src/hooks/utils';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { messagingActions, messagingApi } from '@/src/use-cases/messaging';
import { Messaging } from './Messaging';

const mockedApi = getMockedApi();

async function setup({
  query = {},
  isDesktop = true,
  eligible = true,
  conversations = [{ id: 'c1' }] as unknown[] | null,
  selected = null as string | null,
}: {
  query?: Record<string, unknown>;
  isDesktop?: boolean;
  eligible?: boolean;
  conversations?: unknown[] | null;
  selected?: string | null;
} = {}) {
  (useRouter as jest.Mock).mockReturnValue({ query });
  (useIsDesktop as jest.Mock).mockReturnValue(isDesktop);
  (useContactEligibility as jest.Mock).mockReturnValue({
    isEligibleToContact: eligible,
  });
  const store = createTestStore();
  if (conversations) {
    await store.dispatch(
      messagingApi.util.upsertQueryData(
        'getConversations',
        undefined,
        conversations as any
      ) as any
    );
  }
  store.dispatch(messagingActions.selectConversation(selected));
  return { ...renderWithProviders(<Messaging />, { store }), store };
}

describe('Messaging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi.getConversations.mockResolvedValue({ data: [] } as any);
  });
  afterEach(() => cleanup());

  describe('desktop', () => {
    it('shows the list and the conversation side by side', async () => {
      await setup();
      expect(screen.getByTestId('conversation-list')).toBeInTheDocument();
      expect(screen.getByTestId('conversation')).toBeInTheDocument();
    });

    it('shows the empty state when there is no conversation', async () => {
      await setup({ conversations: [] });
      expect(
        screen.getByText('Aucun message dans votre messagerie')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Contactez les membres de la communauté à partir du réseau d'entraide"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText("Accéder au réseau d'entraide").closest('a')
      ).toHaveAttribute('href', '/backoffice/annuaire');
      expect(screen.queryByTestId('conversation-list')).toBeNull();
    });

    it('keeps the messaging even without conversation when one is selected', async () => {
      await setup({ conversations: [], selected: 'new' });
      expect(screen.getByTestId('conversation-list')).toBeInTheDocument();
    });
  });

  describe('mobile', () => {
    it('only shows the list when no conversation is selected', async () => {
      await setup({ isDesktop: false });
      expect(screen.getByTestId('conversation-list')).toBeInTheDocument();
      expect(screen.queryByTestId('conversation')).toBeNull();
    });

    it('only shows the conversation once one is selected', async () => {
      await setup({ isDesktop: false, selected: 'c1' });
      expect(screen.getByTestId('conversation')).toBeInTheDocument();
      expect(screen.queryByTestId('conversation-list')).toBeNull();
    });

    it('shows the empty state when there is no conversation', async () => {
      await setup({ isDesktop: false, conversations: [] });
      expect(
        screen.getByText('Aucun message dans votre messagerie')
      ).toBeInTheDocument();
    });
  });

  describe('query parameters', () => {
    it('opens the existing direct conversation with the user given in the URL', async () => {
      mockedApi.getConversations.mockResolvedValue({
        data: [
          {
            id: 'c9',
            type: 'direct',
            participants: [{ id: 'u9' }],
            messages: [],
          },
        ],
      } as any);
      const { store } = await setup({ query: { userId: 'u9' } });
      await act(async () => {
        await flushPromises();
      });
      expect(store.getState().messaging.selectedConversationId).toBe('c9');
    });

    it('prepares a new conversation when none exists with the user given in the URL', async () => {
      mockedApi.getPublicUserProfile.mockResolvedValue({
        data: { id: 'u9', firstName: 'Awa', lastName: 'Diop', role: 'Coach' },
      } as any);
      const { store } = await setup({ query: { userId: 'u9' } });
      await act(async () => {
        await flushPromises();
      });
      expect(mockedApi.getPublicUserProfile).toHaveBeenCalledWith('u9');
      expect(store.getState().messaging.selectedConversationId).toBe('new');
      expect(
        store.getState().messaging.newConversationDraft?.[0].firstName
      ).toBe('Awa');
    });

    it('ignores the user given in the URL when not eligible to contact', async () => {
      const { store } = await setup({
        query: { userId: 'u9' },
        eligible: false,
      });
      await act(async () => {
        await flushPromises();
      });
      expect(mockedApi.getConversations).not.toHaveBeenCalled();
      expect(store.getState().messaging.selectedConversationId).toBeNull();
    });

    it('selects the conversation given in the URL', async () => {
      const { store } = await setup({
        query: { conversationId: 'c42' },
        isDesktop: false,
      });
      expect(store.getState().messaging.selectedConversationId).toBe('c42');
    });

    it('ignores non string query values', async () => {
      const { store } = await setup({
        query: { conversationId: ['a', 'b'], userId: ['x'] },
      });
      expect(store.getState().messaging.selectedConversationId).toBeNull();
      expect(mockedApi.getConversations).not.toHaveBeenCalled();
    });
  });
});
