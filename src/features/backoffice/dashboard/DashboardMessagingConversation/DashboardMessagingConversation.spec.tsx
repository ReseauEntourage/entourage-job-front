import '@testing-library/jest-dom';
import { fireEvent, screen, within } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import {
  Conversation,
  ConversationType,
  Message,
  MessageType,
} from '@/src/api/types';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { DashboardMessagingConversation } from './DashboardMessagingConversation';

let mockWindowWidth = 1280;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => mockWindowWidth,
  useWindowSize: () => [mockWindowWidth, 800],
}));
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const mockRefetch = jest.fn();
let mockConversations: Conversation[] | undefined;
let mockStatus = 'SUCCEEDED';
jest.mock('@/src/use-cases/messaging', () => ({
  ...jest.requireActual('@/src/use-cases/messaging'),
  selectConversations: () => mockConversations,
  selectGetConversationsStatus: () => mockStatus,
  useGetConversationsQuery: () => ({ refetch: mockRefetch }),
}));
jest.mock('@/src/use-cases/current-user', () => ({
  ...jest.requireActual('@/src/use-cases/current-user'),
  selectCurrentUserId: () => 'me',
}));

const buildMessage = (overrides: Partial<Message>): Message =>
  ({
    id: 'm',
    content: 'Bonjour',
    authorId: 'other',
    createdAt: '2026-10-01T10:00:00.000Z',
    type: MessageType.USER,
    ...overrides,
  }) as Message;

const buildConversation = (
  id: string,
  firstName: string,
  messages: Message[]
): Conversation => ({
  id,
  type: ConversationType.DIRECT,
  messages,
  seenAt: '2026-10-02T10:00:00.000Z',
  participants: [
    { id: 'me', firstName: 'Moi', lastName: 'Meme', userProfile: {} },
    {
      id: `user-${id}`,
      firstName,
      lastName: 'Nom',
      userProfile: { hasPicture: false },
    },
  ] as any,
});

describe('DashboardMessagingConversation', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockWindowWidth = 1280;
    mockStatus = 'SUCCEEDED';
    mockConversations = undefined;
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it('renders nothing without conversation', () => {
    mockConversations = [];
    const { container } = renderWithProviders(
      <DashboardMessagingConversation />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('lists at most the three latest conversations with the addressee name', () => {
    mockConversations = ['A', 'B', 'C', 'D'].map((name, i) =>
      buildConversation(`c${i}`, name, [
        buildMessage({ content: `Msg ${name}` }),
      ])
    );
    renderWithProviders(<DashboardMessagingConversation />);
    expect(screen.getByText('Mes derniers messages')).toBeInTheDocument();
    const items = screen.getAllByTestId('dashboard-messaging-widget-item');
    expect(items).toHaveLength(3);
    expect(within(items[0]).getByText('A Nom')).toBeInTheDocument();
    expect(screen.queryByText('D Nom')).toBeNull();
  });

  it('opens the messaging page from the CTA', () => {
    mockConversations = [buildConversation('c0', 'A', [buildMessage({})])];
    renderWithProviders(<DashboardMessagingConversation />);
    fireEvent.click(screen.getByText('Accéder à la messagerie'));
    expect(push).toHaveBeenCalledWith('/backoffice/messaging');
  });

  it('opens the conversation with the addressee when an item is clicked', () => {
    mockConversations = [buildConversation('c0', 'A', [buildMessage({})])];
    renderWithProviders(<DashboardMessagingConversation />);
    fireEvent.click(screen.getByTestId('dashboard-messaging-widget-item'));
    expect(push).toHaveBeenCalledWith('/backoffice/messaging?userId=user-c0');
  });

  it('retries the fetch when the previous one failed, and not otherwise', () => {
    renderWithProviders(<DashboardMessagingConversation />);
    expect(mockRefetch).not.toHaveBeenCalled();
    mockStatus = 'FAILED';
    mockConversations = [];
    renderWithProviders(<DashboardMessagingConversation />);
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('previews the last user message (not a service one) with its date, on desktop', () => {
    mockConversations = [
      buildConversation('c0', 'A', [
        buildMessage({ content: 'Service text', type: MessageType.SERVICE }),
        buildMessage({
          content: 'Hello there',
          createdAt: '2026-10-01T10:00:00.000Z',
        }),
      ]),
    ];
    renderWithProviders(<DashboardMessagingConversation />);
    expect(screen.getByText('Hello there')).toBeInTheDocument();
    expect(screen.queryByText('Service text')).toBeNull();
    expect(screen.getByText('01/10/2026')).toBeInTheDocument();
  });

  it('still previews the message on mobile', () => {
    mockWindowWidth = 400;
    mockConversations = [
      buildConversation('c0', 'A', [buildMessage({ content: 'Hello mobile' })]),
    ];
    renderWithProviders(<DashboardMessagingConversation />);
    expect(screen.getByText('Hello mobile')).toBeInTheDocument();
  });
});
