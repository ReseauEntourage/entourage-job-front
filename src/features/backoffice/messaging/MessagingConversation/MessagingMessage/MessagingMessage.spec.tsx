import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import '@testing-library/jest-dom';
import {
  Message,
  MessageType,
  ServiceMessageKind,
  User,
} from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { MessagingMessage } from './MessagingMessage';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(() => 'current-user-id'),
}));

jest.mock('@/src/features/modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({}),
}));

// The component barrel (@/src/components/ui) transitively imports the
// ESM-only @react-hook/window-size (cf. useEmailConfirmationPhase.spec.tsx).
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const TRAPPED_CONTENT = 'Regarde http://example.com/"onmouseover="alert(1)';

const buildMessage = (overrides: Partial<Message> = {}): Message => ({
  id: 'message-id',
  content: 'Bonjour',
  authorId: 'author-id',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
  conversationId: 'conversation-id',
  type: MessageType.USER,
  serviceMessageKind: null,
  metadata: null,
  author: { id: 'author-id', role: UserRoles.CANDIDATE } as User,
  medias: [],
  ...overrides,
});

const buildCheckinNote = (quotedText: string, withMetadata = true): Message =>
  buildMessage({
    type: MessageType.SERVICE,
    serviceMessageKind: ServiceMessageKind.CHECKIN_NOTE,
    content: `💬 Awa vous a laissé un mot suite à son bilan de conversation :\n\n« ${quotedText} »`,
    metadata: withMetadata ? { authorFirstName: 'Awa', quotedText } : null,
    author: null,
    authorId: null,
  });

const hasEventHandlerAttribute = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('*')).some((element) =>
    Array.from(element.attributes).some((attribute) =>
      attribute.name.toLowerCase().startsWith('on')
    )
  );

describe('MessagingMessage', () => {
  const initialSafeDomains = process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS = 'entourage-pro.fr';
    (openModal as jest.Mock).mockClear();
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS = initialSafeDomains;
  });

  (
    [
      ['a user message', buildMessage({ content: TRAPPED_CONTENT })],
      ['a check-in note', buildCheckinNote(TRAPPED_CONTENT)],
      [
        'a check-in note without metadata',
        buildCheckinNote(TRAPPED_CONTENT, false),
      ],
    ] as const
  ).forEach(([label, message]) => {
    describe(`in ${label}`, () => {
      it('shows booby-trapped content as plain text', () => {
        const { container } = render(<MessagingMessage message={message} />);

        expect(screen.getByTestId('messaging-message')).toHaveTextContent(
          'http://example.com/"onmouseover="alert(1)'
        );
        expect(hasEventHandlerAttribute(container)).toBe(false);
      });

      it('opens the warning modal for an unverified domain', () => {
        render(<MessagingMessage message={message} />);

        const notPrevented = fireEvent.click(screen.getByRole('link'));

        expect(notPrevented).toBe(false);
        expect(openModal).toHaveBeenCalledTimes(1);
      });
    });
  });

  it('opens a verified domain directly', () => {
    render(
      <MessagingMessage
        message={buildMessage({ content: 'https://www.entourage-pro.fr' })}
      />
    );

    fireEvent.click(screen.getByRole('link'));

    expect(openModal).not.toHaveBeenCalled();
  });

  it('opens links of a message sent by an admin directly', () => {
    render(
      <MessagingMessage
        message={buildMessage({
          content: 'https://example.com',
          author: { id: 'admin-id', role: UserRoles.ADMIN } as User,
        })}
      />
    );

    fireEvent.click(screen.getByRole('link'));

    expect(openModal).not.toHaveBeenCalled();
  });
});
