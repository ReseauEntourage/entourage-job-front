import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HelpGroupViewerPermissions } from '@/src/api/types';
import { ModalContext } from '@/src/features/modals/Modal/ModalContext';
import { ModalsListener } from '@/src/features/modals/Modal/openModal';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { HelpGroupContent } from '../HelpGroupContent';
import { HelpGroupDiscussionView } from '../HelpGroupDiscussion';
import { HelpGroupViewer } from '../HelpGroupMessage';
import { getMessageMenuActions, MessageMenu } from '../MessageMenu';
import {
  ModerationDeleteModal,
  ModerationToast,
  RevisionsModal,
} from '../ModerationModals';
import { ReactionPicker } from '../ReactionPicker';
import {
  buildAuthor,
  buildDiscussion,
  buildReply,
} from '../__fixtures__/help-groups.fixtures';

const mockCreateReply = jest.fn();
const mockSetReaction = jest.fn();
const mockDeleteMessage = jest.fn();
const mockFetchRevisions = jest.fn();
let mockRevisionsState: object = {};

jest.mock('@/src/use-cases/help-groups', () => ({
  ...jest.requireActual('@/src/use-cases/help-groups'),
  useCreateHelpGroupReplyMutation: () => [
    mockCreateReply,
    { isLoading: false },
  ],
  useSetHelpGroupReactionMutation: () => [mockSetReaction],
  useUpdateHelpGroupDiscussionMutation: () => [jest.fn(), {}],
  useUpdateHelpGroupReplyMutation: () => [jest.fn(), {}],
  useDeleteHelpGroupDiscussionMutation: () => [jest.fn()],
  useDeleteHelpGroupReplyMutation: () => [jest.fn()],
  useJoinHelpGroupMutation: () => [jest.fn(), { isLoading: false }],
  useDeleteHelpGroupMessageAsAdminMutation: () => [
    mockDeleteMessage,
    { isLoading: false },
  ],
  useLazyGetHelpGroupMessageRevisionsQuery: () => [
    mockFetchRevisions,
    mockRevisionsState,
  ],
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

beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

const member: HelpGroupViewer = {
  id: 'viewer-1',
  firstName: 'Julien',
  isAdmin: false,
};

const permissions = (
  props: Partial<HelpGroupViewerPermissions> = {}
): HelpGroupViewerPermissions => ({
  state: 'canWrite',
  charterAccepted: true,
  showWelcomeInvite: false,
  ...props,
});

const renderView = (
  props: Partial<Parameters<typeof HelpGroupDiscussionView>[0]> = {}
) =>
  renderWithProviders(
    <>
      <HelpGroupDiscussionView
        discussion={buildDiscussion({
          author: buildAuthor({ id: 'claire', firstName: 'Claire' }),
        })}
        replies={[]}
        highlightedReplyId={null}
        isLoadingReplies={false}
        viewer={member}
        viewerPermissions={permissions()}
        {...props}
      />
      <ModalsListener />
    </>
  );

const typeReply = (value: string) =>
  fireEvent.change(screen.getByTestId('reply-composer-content'), {
    target: { value },
  });

describe('Discussion participation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockRevisionsState = {};
  });

  describe('Reply area and invitations', () => {
    it('names the author in the reply area of a member', () => {
      renderView();
      expect(
        screen.getByPlaceholderText('Écrivez votre réponse à Claire…')
      ).toBeInTheDocument();
      expect(screen.getAllByTestId('reaction-toggle')).toHaveLength(1);
    });

    it('replaces the reply area and the reactions by the join invitation', () => {
      renderView({ viewerPermissions: permissions({ state: 'mustJoin' }) });
      expect(screen.queryByTestId('reply-composer')).not.toBeInTheDocument();
      expect(screen.getByTestId('write-invitation-join')).toBeInTheDocument();
      expect(screen.queryByTestId('reaction-toggle')).not.toBeInTheDocument();
    });

    it('invites a person without the eLearning to finish it', () => {
      renderView({
        viewerPermissions: permissions({ state: 'mustCompleteElearning' }),
      });
      expect(
        screen.getByTestId('write-invitation-elearning')
      ).toBeInTheDocument();
      expect(screen.queryByTestId('join-help-group')).not.toBeInTheDocument();
    });
  });

  describe('Replying', () => {
    it('clears the area and reports the reply once sent', async () => {
      const onReplied = jest.fn();
      mockCreateReply.mockResolvedValue({ data: buildReply({ id: 'r-9' }) });
      renderView({ onReplied });
      typeReply('  Ma réponse  ');
      fireEvent.click(screen.getByTestId('reply-composer-send'));
      await waitFor(() => expect(onReplied).toHaveBeenCalledWith('r-9'));
      expect(mockCreateReply).toHaveBeenCalledWith({
        slug: 'refaire-un-cv',
        discussionId: 'discussion-1',
        dto: { content: 'Ma réponse' },
      });
      expect(
        (screen.getByTestId('reply-composer-content') as HTMLTextAreaElement)
          .value
      ).toBe('');
    });

    it('keeps the text and shows an error when sending fails', async () => {
      mockCreateReply.mockResolvedValue({ error: 'FAILED' });
      renderView();
      typeReply('Ma réponse');
      fireEvent.click(screen.getByTestId('reply-composer-send'));
      expect(
        await screen.findByText(
          'Votre réponse n’a pas pu être envoyée. Réessayez.'
        )
      ).toBeInTheDocument();
      expect(
        (screen.getByTestId('reply-composer-content') as HTMLTextAreaElement)
          .value
      ).toBe('Ma réponse');
    });

    it('tells when the discussion was deleted in the meantime, keeping the text', async () => {
      const onDiscussionGone = jest.fn();
      mockCreateReply.mockResolvedValue({ error: 'DISCUSSION_NOT_FOUND' });
      renderView({ onDiscussionGone });
      typeReply('Ma réponse');
      fireEvent.click(screen.getByTestId('reply-composer-send'));
      await waitFor(() => expect(onDiscussionGone).toHaveBeenCalled());
      expect(
        screen.getByText('Cette discussion n’est plus disponible.')
      ).toBeInTheDocument();
    });

    it('does not send a blank reply', () => {
      renderView();
      typeReply('   ');
      expect(screen.getByTestId('reply-composer-send')).toBeDisabled();
    });

    it('restores the reply draft of this discussion', () => {
      localStorage.setItem(
        'help-groups:draft:viewer-1:discussion:discussion-1',
        JSON.stringify({ content: 'Brouillon' })
      );
      renderView();
      expect(
        (screen.getByTestId('reply-composer-content') as HTMLTextAreaElement)
          .value
      ).toBe('Brouillon');
    });
  });

  describe('First responder', () => {
    it('invites a member to answer a discussion without reply, naming its author', () => {
      renderView();
      expect(
        screen.getByText(
          'Soyez la première personne à répondre à Claire, même deux lignes suffisent.'
        )
      ).toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(
        /Personne n'a encore répondu|0 réponse|aucune activité/i
      );
    });

    it('does not invite the author of the discussion', () => {
      renderView({ viewer: { ...member, id: 'claire' } });
      expect(
        screen.queryByTestId('first-responder-invite')
      ).not.toBeInTheDocument();
    });

    it('does not invite while the replies of a discussion with replies are loading', () => {
      renderView({
        discussion: buildDiscussion({
          repliesCount: 2,
          author: buildAuthor({ id: 'claire', firstName: 'Claire' }),
        }),
        replies: [],
        isLoadingReplies: true,
      });
      expect(
        screen.queryByTestId('first-responder-invite')
      ).not.toBeInTheDocument();
    });

    it('disappears once a reply is published', () => {
      renderView({ replies: [buildReply()] });
      expect(
        screen.queryByTestId('first-responder-invite')
      ).not.toBeInTheDocument();
    });

    it('does not invite a non member', () => {
      renderView({ viewerPermissions: permissions({ state: 'mustJoin' }) });
      expect(
        screen.queryByTestId('first-responder-invite')
      ).not.toBeInTheDocument();
    });
  });

  describe('Edited mention', () => {
    it('flags an edited reply', () => {
      renderView({
        replies: [buildReply({ editedAt: '2026-09-03T10:00:00.000Z' })],
      });
      expect(screen.getByText('modifié')).toBeInTheDocument();
    });
  });

  describe('ReactionPicker', () => {
    const renderPicker = (viewerReaction: '💪' | null = null) => {
      const onChange = jest.fn();
      renderWithProviders(
        <ReactionPicker viewerReaction={viewerReaction} onChange={onChange} />
      );
      fireEvent.click(screen.getByTestId('reaction-toggle'));
      return onChange;
    };

    it('offers the closed palette, without thumb up', () => {
      renderPicker();
      const options = screen
        .getAllByRole('button')
        .filter((button) =>
          button.dataset.testid?.startsWith('reaction-option')
        )
        .map((button) => button.textContent);
      expect(options).toEqual(['💪', '❤️', '👏', '🙌', '🎉']);
    });

    it('adds a reaction', () => {
      expect(
        (() => {
          const onChange = renderPicker();
          fireEvent.click(screen.getByTestId('reaction-option-❤️'));
          return onChange;
        })()
      ).toHaveBeenCalledWith('❤️');
    });

    it('flags the active reaction and replaces it', () => {
      const onChange = renderPicker('💪');
      expect(screen.getByTestId('reaction-option-💪')).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      fireEvent.click(screen.getByTestId('reaction-option-🎉'));
      expect(onChange).toHaveBeenCalledWith('🎉');
    });

    it('removes the active reaction when chosen again', () => {
      const onChange = renderPicker('💪');
      fireEvent.click(screen.getByTestId('reaction-option-💪'));
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it('shows a discreet error when the reaction fails', async () => {
      mockSetReaction.mockResolvedValue({ error: 'FAILED' });
      const { store } = renderView();
      fireEvent.click(screen.getByTestId('reaction-toggle'));
      fireEvent.click(screen.getByTestId('reaction-option-💪'));
      await waitFor(() =>
        expect(
          (
            store.getState() as {
              notifications: { notifications: { message: string }[] };
            }
          ).notifications.notifications.map(({ message }) => message)
        ).toContain('Votre réaction n’a pas pu être enregistrée.')
      );
    });
  });

  describe('Message menu', () => {
    const profiles: [
      string,
      { isAuthor: boolean; isAdmin: boolean; isEdited: boolean },
      string[],
    ][] = [
      [
        'a member on someone else message',
        { isAuthor: false, isAdmin: false, isEdited: true },
        ['copyLink'],
      ],
      [
        'the author',
        { isAuthor: true, isAdmin: false, isEdited: false },
        ['copyLink', 'edit', 'delete'],
      ],
      [
        'an admin on an edited message of someone else',
        { isAuthor: false, isAdmin: true, isEdited: true },
        ['copyLink', 'revisions', 'moderate'],
      ],
      [
        'an admin on a non edited message of someone else',
        { isAuthor: false, isAdmin: true, isEdited: false },
        ['copyLink', 'moderate'],
      ],
    ];
    profiles.forEach(([label, profile, expected]) => {
      it(`gives ${label} its actions`, () => {
        expect(getMessageMenuActions(profile)).toEqual(expected);
      });
    });

    it('sets the moderation apart from the other actions', () => {
      renderWithProviders(
        <MessageMenu
          actions={['copyLink', 'revisions', 'moderate']}
          onAction={jest.fn()}
        />
      );
      fireEvent.click(screen.getByTestId('message-menu-toggle'));
      expect(
        screen.getByText('Voir les versions précédentes')
      ).toBeInTheDocument();
      expect(screen.getByText('Supprimer ce message')).toBeInTheDocument();
    });

    it('announces the removal of the replies when deleting a discussion', async () => {
      renderView({
        discussion: buildDiscussion({
          author: buildAuthor({ id: 'viewer-1', firstName: 'Julien' }),
        }),
      });
      fireEvent.click(screen.getAllByTestId('message-menu-toggle')[0]);
      fireEvent.click(screen.getByText('Supprimer'));
      expect(
        await screen.findByText(
          /toutes ses réponses, y compris celles des autres membres, seront retirées avec elle/
        )
      ).toBeInTheDocument();
    });

    it('copies the link of a reply, designating the reply', async () => {
      const writeText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { clipboard: { writeText } });
      renderView({ replies: [buildReply({ id: 'reply-7' })] });
      fireEvent.click(screen.getAllByTestId('message-menu-toggle')[1]);
      fireEvent.click(screen.getByText('Copier le lien du message'));
      await waitFor(() =>
        expect(writeText).toHaveBeenCalledWith(
          `${window.location.origin}/backoffice/groupes/refaire-un-cv/discussions/discussion-1?replyId=reply-7`
        )
      );
    });
  });

  describe('Moderation', () => {
    const renderInModal = (ui: React.ReactElement) =>
      renderWithProviders(
        <ModalContext.Provider value={{ onClose: jest.fn() }}>
          {ui}
        </ModalContext.Provider>
      );

    it('blocks the deletion until a motive is chosen', async () => {
      const onDeleted = jest.fn();
      mockDeleteMessage.mockResolvedValue({ data: undefined });
      renderInModal(
        <ModerationDeleteModal
          kind="replies"
          id="reply-1"
          slug="refaire-un-cv"
          discussionId="discussion-1"
          onDeleted={onDeleted}
        />
      );
      expect(screen.getByTestId('moderation-confirm')).toBeDisabled();
      fireEvent.click(screen.getByTestId('moderation-reason-PERSONAL_DATA'));
      fireEvent.change(screen.getByTestId('moderation-comment'), {
        target: { value: 'Téléphone' },
      });
      fireEvent.click(screen.getByTestId('moderation-confirm'));
      await waitFor(() => expect(onDeleted).toHaveBeenCalled());
      expect(mockDeleteMessage).toHaveBeenCalledWith({
        kind: 'replies',
        id: 'reply-1',
        slug: 'refaire-un-cv',
        discussionId: 'discussion-1',
        dto: { reason: 'PERSONAL_DATA', comment: 'Téléphone' },
      });
    });

    it('offers to write to the author, unless the account is deleted', () => {
      const { unmount } = renderWithProviders(
        <ModerationToast authorId="coach-1" onDismiss={jest.fn()} />
      );
      expect(
        screen.getByRole('link', { name: 'Écrire à l’auteur' })
      ).toHaveAttribute('href', '/backoffice/messaging?userId=coach-1');
      unmount();
      renderWithProviders(
        <ModerationToast authorId={null} onDismiss={jest.fn()} />
      );
      expect(screen.queryByText('Écrire à l’auteur')).not.toBeInTheDocument();
    });

    it('shows the current version first, then the previous ones', () => {
      mockRevisionsState = {
        data: {
          current: {
            title: null,
            content: 'Version 3',
            date: '2026-09-03T10:00:00.000Z',
          },
          previous: [
            {
              id: 'r2',
              title: null,
              content: 'Version 2',
              createdAt: '2026-09-02T10:00:00.000Z',
            },
            {
              id: 'r1',
              title: null,
              content: 'Version 1',
              createdAt: '2026-09-01T10:00:00.000Z',
            },
          ],
        },
      };
      renderInModal(<RevisionsModal kind="replies" id="reply-1" />);
      expect(mockFetchRevisions).toHaveBeenCalledWith({
        kind: 'replies',
        id: 'reply-1',
      });
      expect(
        screen
          .getAllByTestId('message-revision')
          .map((item) => item.textContent)
      ).toEqual([
        expect.stringContaining('Version 3'),
        expect.stringContaining('Version 2'),
        expect.stringContaining('Version 1'),
      ]);
      expect(
        screen.getAllByTestId('message-revision')[0].textContent
      ).toContain('Version actuelle');
    });
  });

  describe('External links', () => {
    const originalSafeDomains = process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS;
    beforeAll(() => {
      process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS = 'entourage-pro.fr';
    });
    afterAll(() => {
      process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS = originalSafeDomains;
    });

    const renderContent = (content: string, authorIsAdmin = false) =>
      renderWithProviders(
        <>
          <HelpGroupContent
            content={content}
            guardLinks
            authorIsAdmin={authorIsAdmin}
          />
          <ModalsListener />
        </>
      );

    it('asks for a confirmation before a non verified domain', async () => {
      renderContent('Voir https://example.com/offre');
      fireEvent.click(screen.getByRole('link'));
      expect(
        await screen.findByText('Vous quittez le réseau Entourage Pro')
      ).toBeInTheDocument();
    });

    it('opens a verified domain directly', () => {
      renderContent('Voir https://www.entourage-pro.fr/aide');
      fireEvent.click(screen.getByRole('link'));
      expect(
        screen.queryByText('Vous quittez le réseau Entourage Pro')
      ).not.toBeInTheDocument();
    });

    it('opens the link of an admin directly', () => {
      renderContent('Voir https://example.com/offre', true);
      fireEvent.click(screen.getByRole('link'));
      expect(
        screen.queryByText('Vous quittez le réseau Entourage Pro')
      ).not.toBeInTheDocument();
    });
  });
});
