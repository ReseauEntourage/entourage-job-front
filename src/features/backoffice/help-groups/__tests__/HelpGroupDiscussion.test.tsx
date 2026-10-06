import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import {
  getReplyTargetState,
  HelpGroupDiscussionView,
  MAX_REPLY_TARGET_PAGES,
} from '../HelpGroupDiscussion';
import {
  buildAuthor,
  buildDiscussion,
  buildReply,
  deletedAuthor,
} from '../__fixtures__/help-groups.fixtures';

const defaultProps = {
  replies: [],
  highlightedReplyId: null,
  isLoadingReplies: false,
};

describe('HelpGroupDiscussionView', () => {
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
    // Read only: no write action
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
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
