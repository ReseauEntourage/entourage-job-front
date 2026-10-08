import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HelpGroupViewerPermissions } from '@/src/api/types';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import {
  getReplyTargetState,
  HelpGroupDiscussion,
  HelpGroupDiscussionView,
  MAX_REPLY_TARGET_PAGES,
} from '../HelpGroupDiscussion';
import {
  buildAuthor,
  buildDiscussion,
  buildGroupPage,
  buildReply,
  deletedAuthor,
} from '../__fixtures__/help-groups.fixtures';

type Callback = (payload?: unknown) => void;

const channelCallbacks: Record<string, Callback> = {};
const mockPusher = {
  subscribe: jest.fn(() => ({
    bind: jest.fn((event: string, callback: Callback) => {
      channelCallbacks[event] = callback;
    }),
    unbind_all: jest.fn(),
  })),
  unsubscribe: jest.fn(),
  connection: { state: 'connected', bind: jest.fn(), unbind: jest.fn() },
};
let mockIsDesktop = true;

jest.mock('@/src/api');
jest.mock('@/src/constants/pusher', () => ({
  ...jest.requireActual('@/src/constants/pusher'),
  getPusher: () => mockPusher,
}));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsDesktop: () => mockIsDesktop,
}));
jest.mock('@/src/use-cases/current-user', () => ({
  ...jest.requireActual('@/src/use-cases/current-user'),
  selectCurrentUser: () => ({ id: 'viewer-1', firstName: 'Julien' }),
}));
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
    push: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  }),
}));

const mockedApi = getMockedApi();

const canWrite: HelpGroupViewerPermissions = {
  state: 'canWrite',
  charterAccepted: true,
  showWelcomeInvite: false,
};

const defaultProps = {
  replies: [],
  highlightedReplyId: null,
  isLoadingReplies: false,
  viewer: { id: 'viewer-1', firstName: 'Julien', isAdmin: false },
};

describe('HelpGroupDiscussionView', () => {
  beforeEach(() => {
    mockIsDesktop = true;
  });

  it('shows the breadcrumb, the original message and its author card', () => {
    renderWithProviders(
      <HelpGroupDiscussionView
        {...defaultProps}
        discussion={buildDiscussion({
          author: buildAuthor({ department: 'Paris (75)' }),
        })}
      />
    );
    expect(screen.getByRole('link', { name: 'Groupes' })).toHaveAttribute(
      'href',
      '/backoffice/groupes'
    );
    expect(screen.getByRole('link', { name: 'Refaire un CV' })).toHaveAttribute(
      'href',
      '/backoffice/groupes/refaire-un-cv'
    );
    expect(screen.getByTestId('original-message')).toHaveTextContent(
      'Bonjour à tous'
    );
    expect(
      screen.getByRole('link', { name: 'Voir son profil' })
    ).toBeInTheDocument();
    // Without viewer permissions: no write action, only the message menu
    // (« Copier le lien du message » is offered to everyone)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByTestId('reaction-toggle')).not.toBeInTheDocument();
    expect(
      within(screen.getByTestId('discussion-panel'))
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label'))
    ).toEqual(['Actions sur le message']);
  });

  it('displays HTML as text and makes web addresses clickable in a new tab', () => {
    renderWithProviders(
      <HelpGroupDiscussionView
        {...defaultProps}
        discussion={buildDiscussion({
          content:
            '<b>gras</b> <script>alert(1)</script>\nVoir https://example.com/offre',
        })}
      />
    );
    const message = screen.getByTestId('original-message');
    expect(message).toHaveTextContent('<b>gras</b> <script>alert(1)</script>');
    expect(message.querySelector('b')).toBeNull();
    expect(message.querySelector('script')).toBeNull();
    const link = screen.getByRole('link', {
      name: 'https://example.com/offre',
    });
    expect(link).toHaveAttribute('href', 'https://example.com/offre');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer nofollow');
  });

  it('shows the replies count above chronological replies, and highlights the designated reply', () => {
    renderWithProviders(
      <HelpGroupDiscussionView
        {...defaultProps}
        discussion={buildDiscussion({ repliesCount: 2 })}
        replies={[
          buildReply({ id: 'reply-1', content: 'Première' }),
          buildReply({
            id: 'reply-2',
            content: 'Seconde',
            author: deletedAuthor,
          }),
        ]}
        highlightedReplyId="reply-2"
      />
    );
    expect(screen.getByText('2 réponses')).toBeInTheDocument();
    const replies = screen.getAllByTestId('discussion-reply');
    expect(replies.map((reply) => reply.id)).toEqual([
      'reply-reply-1',
      'reply-reply-2',
    ]);
    expect(replies[0]).toHaveAttribute('data-highlighted', 'false');
    expect(replies[1]).toHaveAttribute('data-highlighted', 'true');
    expect(replies[1]).toHaveTextContent('Utilisateur supprimé');
  });

  it('shows no replies count nor author card when there are none to show', () => {
    renderWithProviders(
      <HelpGroupDiscussionView
        {...defaultProps}
        discussion={buildDiscussion({ author: deletedAuthor })}
      />
    );
    expect(document.body.textContent).not.toMatch(/réponse/);
    expect(
      screen.queryByRole('link', { name: 'Voir son profil' })
    ).not.toBeInTheDocument();
  });

  it('flags an unpublished group in an admin preview', () => {
    renderWithProviders(
      <HelpGroupDiscussionView
        {...defaultProps}
        discussion={buildDiscussion({
          group: {
            id: 'group-1',
            slug: 'refaire-un-cv',
            name: 'Refaire un CV',
            isPublished: false,
          },
        })}
      />
    );
    expect(screen.getByText('Non publié')).toBeInTheDocument();
  });
});

describe('HelpGroupDiscussionView layout', () => {
  beforeEach(() => {
    mockIsDesktop = true;
  });

  it('shows the original message as a card with a level 1 title, then the replies', () => {
    renderWithProviders(
      <HelpGroupDiscussionView
        {...defaultProps}
        discussion={buildDiscussion({ repliesCount: 1 })}
        replies={[buildReply({ content: 'Une réponse' })]}
      />
    );
    const original = screen.getByTestId('original-message');
    expect(
      within(original).getByRole('heading', { level: 1 })
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId('discussion-reply')).queryByRole('heading')
    ).not.toBeInTheDocument();
  });

  it('places the reply area at the end of the thread', () => {
    renderWithProviders(
      <HelpGroupDiscussionView
        {...defaultProps}
        discussion={buildDiscussion()}
        viewerPermissions={canWrite}
        hasNewReply
      />
    );
    const bottom = screen.getByTestId('discussion-bottom');
    expect(within(bottom).getByTestId('reply-composer')).toBeInTheDocument();
    // The "new reply" pill stays at the bottom of the viewport, apart from it
    expect(
      within(bottom).queryByTestId('new-reply-pill')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('new-reply-pill')).toBeInTheDocument();
    // The reply area comes after the thread, in the page flow
    expect(
      screen.getByTestId('discussion-thread').compareDocumentPosition(bottom) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('places the write invitation at the end of the thread', () => {
    renderWithProviders(
      <HelpGroupDiscussionView
        {...defaultProps}
        discussion={buildDiscussion()}
        viewerPermissions={{ ...canWrite, state: 'mustJoin' }}
      />
    );
    expect(
      within(screen.getByTestId('discussion-bottom')).getByTestId(
        'write-invitation-join'
      )
    ).toBeInTheDocument();
  });

  it('displays the reactions palette inline under the original message, flagging the viewer reaction', () => {
    renderWithProviders(
      <HelpGroupDiscussionView
        {...defaultProps}
        discussion={buildDiscussion({ viewerReaction: '❤️' })}
        viewerPermissions={canWrite}
      />
    );
    const palette = within(screen.getByTestId('original-message')).getByTestId(
      'reaction-palette'
    );
    expect(within(palette).getByTestId('reaction-option-❤️')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(within(palette).getByTestId('reaction-option-💪')).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('shows the author card on desktop, without author details in the message header', () => {
    renderWithProviders(
      <HelpGroupDiscussionView
        {...defaultProps}
        discussion={buildDiscussion({
          author: buildAuthor({ department: 'Paris (75)' }),
        })}
      />
    );
    expect(
      screen.getByRole('complementary', { name: 'Auteur de la discussion' })
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('message-author-details')
    ).not.toBeInTheDocument();
  });

  describe('below the desktop breakpoint', () => {
    beforeEach(() => {
      mockIsDesktop = false;
    });

    it('gives the location and the profile link in the original message header, without author card', () => {
      renderWithProviders(
        <HelpGroupDiscussionView
          {...defaultProps}
          discussion={buildDiscussion({
            author: buildAuthor({ department: 'Paris (75)' }),
          })}
        />
      );
      expect(
        screen.queryByRole('complementary', {
          name: 'Auteur de la discussion',
        })
      ).not.toBeInTheDocument();
      const details = within(
        screen.getByTestId('original-message')
      ).getByTestId('message-author-details');
      expect(details).toHaveTextContent('Paris (75)');
      expect(
        within(details).getByRole('link', { name: 'Voir son profil' })
      ).toHaveAttribute('href', '/backoffice/profile/author-1');
    });

    it('shows neither location nor profile link for a deleted account', () => {
      renderWithProviders(
        <HelpGroupDiscussionView
          {...defaultProps}
          discussion={buildDiscussion({ author: deletedAuthor })}
        />
      );
      expect(
        screen.queryByTestId('message-author-details')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Voir son profil' })
      ).not.toBeInTheDocument();
    });

    it('shows neither location nor profile link for a profile the reader cannot view', () => {
      renderWithProviders(
        <HelpGroupDiscussionView
          {...defaultProps}
          discussion={buildDiscussion({
            author: buildAuthor({ profileLinkable: false }),
          })}
        />
      );
      expect(
        screen.queryByTestId('message-author-details')
      ).not.toBeInTheDocument();
    });

    it('never shows the author details in a reply header', () => {
      renderWithProviders(
        <HelpGroupDiscussionView
          {...defaultProps}
          discussion={buildDiscussion({ repliesCount: 1 })}
          replies={[buildReply()]}
        />
      );
      expect(
        within(screen.getByTestId('discussion-reply')).queryByTestId(
          'message-author-details'
        )
      ).not.toBeInTheDocument();
    });
  });
});

describe('HelpGroupDiscussion page scroll', () => {
  const PAGE_HEIGHT = 3000;
  const windowScrollTo = jest.fn();
  const scrollIntoView = jest.fn();

  // The page is the only scroll: simulate its position
  const setPageScroll = (scrollY: number) => {
    Object.defineProperty(window, 'scrollY', {
      value: scrollY,
      configurable: true,
      writable: true,
    });
  };
  const scrollPage = (scrollY: number) =>
    act(() => {
      setPageScroll(scrollY);
      window.dispatchEvent(new Event('scroll'));
    });
  const bottomScrollY = () => PAGE_HEIGHT - window.innerHeight;

  const renderDiscussion = () =>
    renderWithProviders(
      <HelpGroupDiscussion
        slug="refaire-un-cv"
        discussionId="discussion-1"
        replyId={null}
      />
    );

  const announceReply = (replyId: string) =>
    act(async () => {
      channelCallbacks['reply-created']({
        discussionId: 'discussion-1',
        replyId,
      });
    });

  beforeAll(() => {
    Element.prototype.scrollTo = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    window.scrollTo = windowScrollTo as unknown as typeof window.scrollTo;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockIsDesktop = true;
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: PAGE_HEIGHT,
      configurable: true,
    });
    setPageScroll(0);
    mockedApi.getHelpGroup.mockResolvedValue({
      data: buildGroupPage(),
    } as never);
    mockedApi.getHelpGroupDiscussion.mockResolvedValue({
      data: buildDiscussion({
        author: buildAuthor({ id: 'claire', firstName: 'Claire' }),
        repliesCount: 1,
      }),
    } as never);
    mockedApi.getHelpGroupDiscussionReplies
      .mockResolvedValueOnce({
        data: {
          items: [buildReply({ id: 'reply-1', content: 'Première' })],
          nextCursor: null,
        },
      } as never)
      .mockResolvedValue({
        data: {
          items: [
            buildReply({ id: 'reply-1', content: 'Première' }),
            buildReply({ id: 'reply-2', content: 'Nouvelle' }),
          ],
          nextCursor: null,
        },
      } as never);
  });

  afterAll(() => {
    delete (document.documentElement as unknown as Record<string, unknown>)
      .scrollHeight;
    setPageScroll(0);
  });

  it('opens on top of the page', async () => {
    renderDiscussion();
    expect(await screen.findByText('Première')).toBeInTheDocument();
    expect(windowScrollTo).toHaveBeenCalledWith({ top: 0 });
  });

  it('does not move a reader reading higher up, and shows the pill until the bottom of the page is reached', async () => {
    renderDiscussion();
    expect(await screen.findByText('Première')).toBeInTheDocument();
    setPageScroll(200);
    windowScrollTo.mockClear();

    await announceReply('reply-2');

    expect(await screen.findByText('Nouvelle')).toBeInTheDocument();
    expect(screen.getByTestId('new-reply-pill')).toBeInTheDocument();
    expect(windowScrollTo).not.toHaveBeenCalled();

    scrollPage(bottomScrollY());
    expect(screen.queryByTestId('new-reply-pill')).not.toBeInTheDocument();
  });

  it('brings the new reply into view from the pill', async () => {
    renderDiscussion();
    expect(await screen.findByText('Première')).toBeInTheDocument();
    setPageScroll(200);
    await announceReply('reply-2');
    expect(await screen.findByText('Nouvelle')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('new-reply-pill'));

    expect(windowScrollTo).toHaveBeenCalledWith({ top: PAGE_HEIGHT });
    expect(screen.queryByTestId('new-reply-pill')).not.toBeInTheDocument();
  });

  it('follows a new reply when the reader is at the bottom of the page', async () => {
    renderDiscussion();
    expect(await screen.findByText('Première')).toBeInTheDocument();
    setPageScroll(bottomScrollY());

    await announceReply('reply-2');

    expect(await screen.findByText('Nouvelle')).toBeInTheDocument();
    expect(windowScrollTo).toHaveBeenCalledWith({ top: PAGE_HEIGHT });
    expect(screen.queryByTestId('new-reply-pill')).not.toBeInTheDocument();
  });

  it('scrolls to one own published reply, above the sticky reply area', async () => {
    mockedApi.postHelpGroupReply.mockResolvedValue({
      data: buildReply({ id: 'reply-mine', content: 'Ma réponse' }),
    } as never);
    renderDiscussion();
    expect(await screen.findByText('Première')).toBeInTheDocument();
    setPageScroll(200);

    fireEvent.change(await screen.findByTestId('reply-composer-content'), {
      target: { value: 'Ma réponse' },
    });
    fireEvent.click(screen.getByTestId('reply-composer-send'));

    expect(await screen.findByText('Ma réponse')).toBeInTheDocument();
    await waitFor(() =>
      expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center' })
    );
    expect(scrollIntoView.mock.contexts.at(-1)).toHaveAttribute(
      'id',
      'reply-reply-mine'
    );
  });
});

describe('getReplyTargetState', () => {
  const base = {
    replyId: 'reply-9',
    loadedReplyIds: ['reply-1', 'reply-2'],
    loadedPagesCount: 1,
    hasNextPage: true,
  };

  it('opens on top of the original message without designated reply', () => {
    expect(getReplyTargetState({ ...base, replyId: null })).toBe('none');
  });

  it('targets a loaded reply', () => {
    expect(getReplyTargetState({ ...base, replyId: 'reply-2' })).toBe('found');
  });

  it('loads more pages while the reply is not found', () => {
    expect(getReplyTargetState(base)).toBe('loadMore');
  });

  it('falls back on top of the original message when the reply cannot be found', () => {
    // Deleted or unknown reply: every page is loaded
    expect(getReplyTargetState({ ...base, hasNextPage: false })).toBe(
      'notFound'
    );
    // Beyond the pages cap
    expect(
      getReplyTargetState({
        ...base,
        loadedPagesCount: MAX_REPLY_TARGET_PAGES,
      })
    ).toBe('notFound');
  });
});
