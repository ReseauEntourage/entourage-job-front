import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { getEthicsCharterSummaries } from '@/src/components/ui/EthicsCharter/EthicsCharter';
import { UserRoles } from '@/src/constants/users';
import { useIsMobile } from '@/src/hooks/utils';
import { getDisplayEthicsCharterBanner } from '../MessagingConversation';
import { MessagingEthicsCharterBanner } from './MessagingEthicsCharterBanner';

jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsMobile: jest.fn(),
}));

const mockedUseIsMobile = useIsMobile as jest.MockedFunction<
  typeof useIsMobile
>;

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

describe('getDisplayEthicsCharterBanner', () => {
  it('is true on a conversation being created', () => {
    expect(
      getDisplayEthicsCharterBanner({
        ...baseArgs,
        selectedConversation: null,
        selectedConversationId: 'new',
      })
    ).toBe(true);
  });

  it('is true on an existing conversation the current user has not answered', () => {
    expect(getDisplayEthicsCharterBanner(baseArgs)).toBe(true);
  });

  it('is false once the current user has sent a message', () => {
    expect(
      getDisplayEthicsCharterBanner({
        ...baseArgs,
        currentUserHasSentMessages: true,
      })
    ).toBe(false);
  });

  it('is false for an administrator', () => {
    expect(
      getDisplayEthicsCharterBanner({
        ...baseArgs,
        currentUserRole: UserRoles.ADMIN,
      })
    ).toBe(false);
  });

  it('is true for a referent, unlike the "Nouveau contact" banner', () => {
    expect(
      getDisplayEthicsCharterBanner({
        ...baseArgs,
        currentUserRole: UserRoles.REFERER,
      })
    ).toBe(true);
  });

  it('is false when another participant is an administrator', () => {
    expect(
      getDisplayEthicsCharterBanner({
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
      getDisplayEthicsCharterBanner({
        ...baseArgs,
        pinnedInfo: 'ADDRESSEE_UNAVAILABLE',
      })
    ).toBe(false);
  });

  it('is false while the loaded conversation does not match the selected one', () => {
    expect(
      getDisplayEthicsCharterBanner({
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

describe('MessagingEthicsCharterBanner', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('on desktop', () => {
    beforeEach(() => {
      mockedUseIsMobile.mockReturnValue(false);
    });

    it('renders the whole summary in place', () => {
      render(<MessagingEthicsCharterBanner />);

      expect(screen.getByText(TITLE)).toBeInTheDocument();
      expect(screen.getByText('Le respect avant tout')).toBeInTheDocument();
      expect(screen.getByText('Coachs et candidats')).toBeInTheDocument();
      expect(
        screen.queryByTestId('messaging-ethics-charter-bar')
      ).not.toBeInTheDocument();
    });

    it('renders the info icon at 22px', () => {
      // Alert ne retaille pas son icône par défaut (un DefaultAlertIcon, pas
      // un LucidIcon), qui retombe donc à 18px : le composant la fournit.
      const { container } = render(<MessagingEthicsCharterBanner />);

      expect(container.querySelector('svg')).toHaveAttribute('width', '22');
    });

    it('opens the full charter in a new tab', () => {
      render(<MessagingEthicsCharterBanner />);

      const link = screen.getByRole('link', {
        name: /Voir la charte complète/,
      });
      expect(link).toHaveAttribute('href', '/conseils-posture');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('closes the block on "J\'ai compris"', () => {
      render(<MessagingEthicsCharterBanner />);

      fireEvent.click(screen.getByRole('button', { name: "J'ai compris" }));

      expect(screen.queryByText(TITLE)).not.toBeInTheDocument();
    });
  });

  describe('on mobile', () => {
    beforeEach(() => {
      mockedUseIsMobile.mockReturnValue(true);
    });

    it('renders the collapsed bar only, without a close cross', () => {
      render(<MessagingEthicsCharterBanner />);

      expect(
        screen.getByTestId('messaging-ethics-charter-bar')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('messaging-ethics-charter-panel')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Le respect avant tout')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Fermer la charte' })
      ).not.toBeInTheDocument();
    });

    it('opens the full-screen panel when the bar is pressed', () => {
      render(<MessagingEthicsCharterBanner />);

      fireEvent.click(screen.getByTestId('messaging-ethics-charter-bar'));

      expect(
        screen.getByTestId('messaging-ethics-charter-panel')
      ).toBeInTheDocument();
      expect(screen.getByText('Le respect avant tout')).toBeInTheDocument();
      expect(screen.getByText('Coachs et candidats')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: "J'ai compris" })
      ).toBeInTheDocument();
    });

    it("closes the panel but keeps the reminder when the panel's cross is used", () => {
      render(<MessagingEthicsCharterBanner />);

      fireEvent.click(screen.getByTestId('messaging-ethics-charter-bar'));
      fireEvent.click(screen.getByRole('button', { name: 'Fermer la charte' }));

      expect(
        screen.queryByTestId('messaging-ethics-charter-panel')
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('messaging-ethics-charter-bar')
      ).toBeInTheDocument();
    });

    it('dismisses the reminder entirely on "J\'ai compris"', () => {
      render(<MessagingEthicsCharterBanner />);

      fireEvent.click(screen.getByTestId('messaging-ethics-charter-bar'));
      fireEvent.click(screen.getByRole('button', { name: "J'ai compris" }));

      expect(
        screen.queryByTestId('messaging-ethics-charter-panel')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('messaging-ethics-charter-bar')
      ).not.toBeInTheDocument();
    });

    it('closes the panel on Escape', () => {
      render(<MessagingEthicsCharterBanner />);

      fireEvent.click(screen.getByTestId('messaging-ethics-charter-bar'));
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(
        screen.queryByTestId('messaging-ethics-charter-panel')
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('messaging-ethics-charter-bar')
      ).toBeInTheDocument();
    });
  });

  it('shows the reminder again when remounted under a new conversation key', () => {
    mockedUseIsMobile.mockReturnValue(false);
    const { rerender } = render(
      <MessagingEthicsCharterBanner key="conversation-1" />
    );

    fireEvent.click(screen.getByRole('button', { name: "J'ai compris" }));
    expect(screen.queryByText(TITLE)).not.toBeInTheDocument();

    rerender(<MessagingEthicsCharterBanner key="conversation-2" />);

    expect(screen.getByText(TITLE)).toBeInTheDocument();
  });
});
