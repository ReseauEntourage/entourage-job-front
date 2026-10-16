import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HelpGroupViewerPermissions } from '@/src/api/types';
import { COLORS } from '@/src/constants/styles';
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
let mockIsReacting = false;
const mockDeleteMessage = jest.fn();
const mockFetchRevisions = jest.fn();
let mockRevisionsState: object = {};

jest.mock('@/src/use-cases/help-groups', () => ({
  ...jest.requireActual('@/src/use-cases/help-groups'),
  useCreateHelpGroupReplyMutation: () => [
    mockCreateReply,
    { isLoading: false },
  ],
  useSetHelpGroupReactionMutation: () => [
    mockSetReaction,
    { isLoading: mockIsReacting },
  ],
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
// jsdom has no layout: a test may set the window width
let mockWindowWidth: number | undefined;
jest.mock('@react-hook/window-size', () => {
  const actual = jest.requireActual('@react-hook/window-size');
  return {
    ...actual,
    useWindowWidth: (...args: unknown[]) =>
      mockWindowWidth ?? actual.useWindowWidth(...args),
  };
});
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

const replyContent = () =>
  screen.getByTestId('reply-composer-content') as HTMLTextAreaElement;
// The compact reply area opens first when it has no text yet
const typeReply = (value: string) => {
  const bar = screen.queryByTestId('reply-composer-bar');
  if (bar) {
    fireEvent.click(bar);
  }
  fireEvent.change(replyContent(), { target: { value } });
};

describe('Discussion participation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockRevisionsState = {};
  });

  describe('Reply area and invitations', () => {
    it('names the author in the reply area of a member', () => {
      renderView();
      expect(screen.getByTestId('reply-composer-bar')).toHaveTextContent(
        'Écrivez votre réponse à Claire…'
      );
      // Inline palette under the original message, no toggle
      expect(screen.getByTestId('reaction-palette')).toBeInTheDocument();
      expect(screen.queryByTestId('reaction-toggle')).not.toBeInTheDocument();
    });

    it('replaces the reply area and the reactions by the join invitation', () => {
      renderView({ viewerPermissions: permissions({ state: 'mustJoin' }) });
      expect(screen.queryByTestId('reply-composer')).not.toBeInTheDocument();
      expect(screen.getByTestId('write-invitation-join')).toBeInTheDocument();
      expect(screen.queryByTestId('reaction-toggle')).not.toBeInTheDocument();
      expect(screen.queryByTestId('reaction-palette')).not.toBeInTheDocument();
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
      // Emptied, the area is compact again
      expect(
        screen.queryByTestId('reply-composer-content')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('reply-composer-bar')).toBeInTheDocument();
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
      expect(replyContent().value).toBe('Ma réponse');
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
      expect(replyContent().value).toBe('Brouillon');
    });
  });

  describe('Compact reply area', () => {
    const composer = () => within(screen.getByTestId('reply-composer'));

    afterEach(() => {
      mockWindowWidth = undefined;
    });

    it('is compact by default: avatar, field and an inactive « Répondre », without visibility nor counter', () => {
      mockWindowWidth = 1440;
      renderView();
      const bar = screen.getByTestId('reply-composer-bar');
      expect(bar).toHaveAccessibleName('Écrire une réponse');
      expect(composer().getByTestId('help-group-avatar')).toBeInTheDocument();
      expect(screen.getByTestId('reply-composer-send')).toBeDisabled();
      expect(screen.getByTestId('reply-composer-send')).toHaveTextContent(
        'Répondre'
      );
      expect(
        screen.queryByTestId('reply-composer-content')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Votre réponse sera visible/)
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/caractère\(s\) restant/)).toBeNull();
      expect(
        screen.queryByTestId('reply-composer-cancel')
      ).not.toBeInTheDocument();
    });

    it('keeps only the field and an inactive send icon below the desktop breakpoint', () => {
      mockWindowWidth = 390;
      renderView();
      expect(screen.getByTestId('reply-composer-bar')).toBeInTheDocument();
      expect(
        composer().queryByTestId('help-group-avatar')
      ).not.toBeInTheDocument();
      const send = screen.getByTestId('reply-composer-send');
      expect(send).toBeDisabled();
      expect(send).toHaveAccessibleName('Répondre');
    });

    it('opens when the field takes the focus, with the visibility, the counter, « Annuler » and « Répondre »', () => {
      renderView();
      fireEvent.focus(screen.getByTestId('reply-composer-bar'));
      expect(replyContent()).toHaveFocus();
      expect(replyContent()).toHaveAttribute('rows', '3');
      expect(
        composer().getByText(
          'Votre réponse sera visible par toutes les personnes inscrites sur Entourage Pro.'
        )
      ).toBeInTheDocument();
      expect(
        composer().getByText('5000 caractère(s) restant(s)')
      ).toBeInTheDocument();
      expect(screen.getByTestId('reply-composer-cancel')).toHaveTextContent(
        'Annuler'
      );
      expect(screen.getByTestId('reply-composer-send')).toHaveTextContent(
        'Répondre'
      );
    });

    it('opens with a restored draft', () => {
      localStorage.setItem(
        'help-groups:draft:viewer-1:discussion:discussion-1',
        JSON.stringify({ content: 'Brouillon' })
      );
      renderView();
      expect(
        screen.queryByTestId('reply-composer-bar')
      ).not.toBeInTheDocument();
      expect(replyContent().value).toBe('Brouillon');
      // A restored draft does not steal the focus
      expect(replyContent()).not.toHaveFocus();
    });

    it('stays open when the field loses the focus with a text', () => {
      renderView();
      typeReply('Ma réponse');
      fireEvent.blur(replyContent());
      expect(replyContent().value).toBe('Ma réponse');
      expect(
        screen.queryByTestId('reply-composer-bar')
      ).not.toBeInTheDocument();
    });

    it('empties the draft and closes on « Annuler »', async () => {
      renderView();
      typeReply('Ma réponse');
      fireEvent.click(screen.getByTestId('reply-composer-cancel'));
      expect(screen.getByTestId('reply-composer-bar')).toBeInTheDocument();
      expect(
        screen.queryByTestId('reply-composer-content')
      ).not.toBeInTheDocument();
      await waitFor(() =>
        expect(
          localStorage.getItem(
            'help-groups:draft:viewer-1:discussion:discussion-1'
          )
        ).toBeNull()
      );
      // Reopened, the field is empty
      fireEvent.click(screen.getByTestId('reply-composer-bar'));
      expect(replyContent().value).toBe('');
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

    it('disables the reaction of a message while its previous one is being saved', () => {
      mockIsReacting = true;
      renderView();
      expect(screen.getByTestId('reaction-option-💪')).toBeDisabled();
      mockIsReacting = false;
    });

    it('cannot be opened while the previous reaction is being saved', () => {
      renderWithProviders(
        <ReactionPicker viewerReaction={null} disabled onChange={jest.fn()} />
      );
      expect(screen.getByTestId('reaction-toggle')).toBeDisabled();
      fireEvent.click(screen.getByTestId('reaction-toggle'));
      expect(
        screen.queryByTestId('reaction-option-💪')
      ).not.toBeInTheDocument();
    });

    it('shows a discreet error when the reaction fails', async () => {
      mockSetReaction.mockResolvedValue({ error: 'FAILED' });
      const { store } = renderView();
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
        ['copyLink', 'report'],
      ],
      [
        'the author',
        { isAuthor: true, isAdmin: false, isEdited: false },
        ['copyLink', 'edit', 'delete'],
      ],
      [
        'an admin on an edited message of someone else',
        { isAuthor: false, isAdmin: true, isEdited: true },
        ['copyLink', 'revisions', 'report', 'moderate'],
      ],
      [
        'an admin on a non edited message of someone else',
        { isAuthor: false, isAdmin: true, isEdited: false },
        ['copyLink', 'report', 'moderate'],
      ],
    ];
    profiles.forEach(([label, profile, expected]) => {
      it(`gives ${label} its actions`, () => {
        expect(getMessageMenuActions(profile)).toEqual(expected);
      });
    });

    it('opens from a real button, reachable from the keyboard', () => {
      renderWithProviders(
        <MessageMenu actions={['copyLink']} onAction={jest.fn()} />
      );
      const toggle = screen.getByRole('button', {
        name: 'Actions sur le message',
      });
      toggle.focus();
      expect(document.activeElement).toBe(toggle);
      fireEvent.click(toggle);
      expect(screen.getByText('Copier le lien du message')).toBeInTheDocument();
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

    it('sets « Signaler ce message » apart, in the warning color, and keeps its action', () => {
      const onAction = jest.fn();
      renderWithProviders(
        <MessageMenu actions={['copyLink', 'report']} onAction={onAction} />
      );
      fireEvent.click(screen.getByTestId('message-menu-toggle'));
      const report = screen.getByTestId('message-menu-report');
      expect(report).toHaveTextContent('Signaler ce message');
      expect(report).toHaveStyle({ color: COLORS.warning });
      // After a separator, under the other actions
      const reportItem = report.closest('.dropdown-item') as HTMLElement;
      const copyItem = screen
        .getByText('Copier le lien du message')
        .closest('.dropdown-item') as HTMLElement;
      const separator = reportItem.previousElementSibling as HTMLElement;
      expect(separator).not.toBe(copyItem);
      expect(separator.previousElementSibling).toBe(copyItem);
      fireEvent.click(report);
      expect(onAction).toHaveBeenCalledWith('report');
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

    it('only offers to copy the link in an admin preview of an unpublished group', () => {
      renderView({
        viewer: { id: 'viewer-1', firstName: 'Claire', isAdmin: true },
        discussion: buildDiscussion({
          author: buildAuthor({ id: 'viewer-1', firstName: 'Claire' }),
          editedAt: '2026-09-03T10:00:00.000Z',
          group: {
            id: 'group-1',
            slug: 'refaire-un-cv',
            name: 'Refaire un CV',
            isPublished: false,
          },
        }),
        replies: [buildReply({ editedAt: '2026-09-03T10:00:00.000Z' })],
      });
      screen.getAllByTestId('message-menu-toggle').forEach((toggle) => {
        fireEvent.click(toggle);
      });
      expect(
        screen.getAllByText('Copier le lien du message').length
      ).toBeGreaterThan(0);
      [
        'Modifier',
        'Supprimer',
        'Voir les versions précédentes',
        'Supprimer ce message',
      ].forEach((label) => {
        expect(screen.queryByText(label)).not.toBeInTheDocument();
      });
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
