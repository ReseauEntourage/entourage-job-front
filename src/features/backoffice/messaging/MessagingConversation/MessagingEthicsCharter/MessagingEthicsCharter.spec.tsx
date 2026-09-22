import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { getEthicsCharterSummaries } from '@/src/components/ui/EthicsCharter/EthicsCharter';
import { UserRoles } from '@/src/constants/users';
import { getDisplayEthicsCharter } from '../MessagingConversation';
import { MessagingEthicsCharter } from './MessagingEthicsCharter';

const CURRENT_USER_ID = 'current-user';
const TITLE = "Ici, on se parle d'égal à égal";

const conversationWith = (...participants: { id: string; role: string }[]) => ({
  id: 'conversation-1',
  participants: [
    { id: CURRENT_USER_ID, role: UserRoles.COACH },
    ...participants,
  ],
});

const baseArgs = {
  currentUserRole: UserRoles.COACH as string | undefined,
  currentUserId: CURRENT_USER_ID as string | undefined,
  pinnedInfo: null as unknown,
  selectedConversation: conversationWith({
    id: 'other',
    role: UserRoles.CANDIDATE,
  }),
  selectedConversationId: 'conversation-1' as string | null | undefined,
  currentUserHasSentMessages: false,
};

describe('getDisplayEthicsCharter', () => {
  it('is true on a conversation being created', () => {
    expect(
      getDisplayEthicsCharter({
        ...baseArgs,
        selectedConversation: null,
        selectedConversationId: 'new',
      })
    ).toBe(true);
  });

  it('is true on an existing conversation the current user has not answered', () => {
    expect(getDisplayEthicsCharter(baseArgs)).toBe(true);
  });

  it('is false once the current user has sent a message', () => {
    expect(
      getDisplayEthicsCharter({ ...baseArgs, currentUserHasSentMessages: true })
    ).toBe(false);
  });

  it('is false for an administrator', () => {
    expect(
      getDisplayEthicsCharter({ ...baseArgs, currentUserRole: UserRoles.ADMIN })
    ).toBe(false);
  });

  it('is true for a referent, unlike the "Nouveau contact" banner', () => {
    expect(
      getDisplayEthicsCharter({
        ...baseArgs,
        currentUserRole: UserRoles.REFERER,
      })
    ).toBe(true);
  });

  it('is false when another participant is an administrator', () => {
    expect(
      getDisplayEthicsCharter({
        ...baseArgs,
        selectedConversation: conversationWith({
          id: 'admin',
          role: UserRoles.ADMIN,
        }),
      })
    ).toBe(false);
  });

  it('is false when a pinned info is displayed (addressee unavailable or deleted)', () => {
    expect(
      getDisplayEthicsCharter({
        ...baseArgs,
        pinnedInfo: 'ADDRESSEE_UNAVAILABLE',
      })
    ).toBe(false);
  });

  it('is false while the loaded conversation does not match the selected one', () => {
    expect(
      getDisplayEthicsCharter({
        ...baseArgs,
        selectedConversationId: 'another-conversation',
      })
    ).toBe(false);
  });
});

describe('getEthicsCharterSummaries', () => {
  it('returns the five summarised sections in the expected reading order', () => {
    expect(getEthicsCharterSummaries().map((summary) => summary.title)).toEqual(
      [
        'Le respect avant tout',
        'Comportements interdits',
        'Consentement et données personnelles',
        "L'esprit d'entraide",
        'Coachs et candidats',
      ]
    );
  });

  it('carries a lucide icon name and at least one point per section', () => {
    getEthicsCharterSummaries().forEach((summary) => {
      expect(typeof summary.icon).toBe('string');
      expect(summary.points.length).toBeGreaterThan(0);
    });
  });
});

describe('MessagingEthicsCharter', () => {
  it('opens the modal as soon as the conversation is displayed', () => {
    render(<MessagingEthicsCharter />);

    expect(
      screen.getByTestId('messaging-ethics-charter-modal')
    ).toBeInTheDocument();
    expect(screen.getByText(TITLE)).toBeInTheDocument();
    expect(screen.getByText('Le respect avant tout')).toBeInTheDocument();
    expect(screen.getByText('Coachs et candidats')).toBeInTheDocument();
  });

  it('always shows the discreet note above the editor', () => {
    render(<MessagingEthicsCharter />);

    const note = screen.getByTestId('messaging-ethics-charter-note');
    expect(note).toHaveTextContent(
      "Vos échanges doivent suivre la charte éthique d'Entourage Pro"
    );
  });

  it('closes the modal on "J\'ai compris" but keeps the note', () => {
    render(<MessagingEthicsCharter />);

    fireEvent.click(screen.getByRole('button', { name: "J'ai compris" }));

    expect(
      screen.queryByTestId('messaging-ethics-charter-modal')
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId('messaging-ethics-charter-note')
    ).toBeInTheDocument();
  });

  it('closes the modal on its cross', () => {
    render(<MessagingEthicsCharter />);

    fireEvent.click(screen.getByRole('button', { name: 'Fermer la charte' }));

    expect(
      screen.queryByTestId('messaging-ethics-charter-modal')
    ).not.toBeInTheDocument();
  });

  it('closes the modal on Escape', () => {
    render(<MessagingEthicsCharter />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(
      screen.queryByTestId('messaging-ethics-charter-modal')
    ).not.toBeInTheDocument();
  });

  it('opens the full charter in a new tab, from the modal and from the note', () => {
    render(<MessagingEthicsCharter />);

    screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href') === '/conseils-posture')
      .forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });

    expect(
      screen.getByRole('link', { name: /Voir la charte complète/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'charte éthique' })
    ).toBeInTheDocument();
  });

  it('reopens the modal when remounted under a new conversation key', () => {
    const { rerender } = render(
      <MessagingEthicsCharter key="conversation-1" />
    );

    fireEvent.click(screen.getByRole('button', { name: "J'ai compris" }));
    expect(
      screen.queryByTestId('messaging-ethics-charter-modal')
    ).not.toBeInTheDocument();

    rerender(<MessagingEthicsCharter key="conversation-2" />);

    expect(
      screen.getByTestId('messaging-ethics-charter-modal')
    ).toBeInTheDocument();
  });
});
