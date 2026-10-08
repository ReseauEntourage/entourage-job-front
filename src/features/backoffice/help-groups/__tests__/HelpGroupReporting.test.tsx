import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HelpGroupViewerPermissions } from '@/src/api/types';
import { ModalContext } from '@/src/features/modals/Modal/ModalContext';
import { ModalsListener } from '@/src/features/modals/Modal/openModal';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { HelpGroupDiscussionView } from '../HelpGroupDiscussion';
import { HelpGroupViewer } from '../HelpGroupMessage';
import { getMessageMenuActions } from '../MessageMenu';
import { HelpGroupReportModal } from '../ReportModal';
import {
  buildAuthor,
  buildDiscussion,
  buildHiddenDiscussion,
  buildHiddenReply,
  buildReply,
} from '../__fixtures__/help-groups.fixtures';

const mockReport = jest.fn();
const mockRestore = jest.fn();
let mockStaffContact: { name: string; email: string } | null = null;

jest.mock('@/src/use-cases/help-groups', () => ({
  ...jest.requireActual('@/src/use-cases/help-groups'),
  useReportHelpGroupMessageMutation: () => [mockReport, { isLoading: false }],
  useRestoreHelpGroupMessageMutation: () => [mockRestore, { isLoading: false }],
  useSetHelpGroupReactionMutation: () => [jest.fn(), { isLoading: false }],
  useUpdateHelpGroupDiscussionMutation: () => [jest.fn(), {}],
  useUpdateHelpGroupReplyMutation: () => [jest.fn(), {}],
  useDeleteHelpGroupDiscussionMutation: () => [jest.fn()],
  useDeleteHelpGroupReplyMutation: () => [jest.fn()],
  useDeleteHelpGroupMessageAsAdminMutation: () => [
    jest.fn(),
    { isLoading: false },
  ],
  useJoinHelpGroupMutation: () => [jest.fn(), { isLoading: false }],
  useCreateHelpGroupReplyMutation: () => [jest.fn(), { isLoading: false }],
}));
jest.mock('@/src/hooks/useCurrentUserStaffContact', () => ({
  useCurrentUserStaffContact: () => mockStaffContact,
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
const admin: HelpGroupViewer = {
  id: 'admin-1',
  firstName: 'Paul',
  isAdmin: true,
};

const permissions = (
  props: Partial<HelpGroupViewerPermissions> = {}
): HelpGroupViewerPermissions => ({
  state: 'canWrite',
  charterAccepted: true,
  ...props,
});

const claire = buildAuthor({ id: 'claire', firstName: 'Claire' });

const renderView = (
  props: Partial<Parameters<typeof HelpGroupDiscussionView>[0]> = {}
) =>
  renderWithProviders(
    <>
      <HelpGroupDiscussionView
        discussion={buildDiscussion({ author: claire })}
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

const notifications = (store: { getState: () => unknown }) =>
  (
    store.getState() as {
      notifications: { notifications: { message: string }[] };
    }
  ).notifications.notifications.map(({ message }) => message);

describe('Help group reporting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStaffContact = null;
  });

  describe('Report modal', () => {
    const onClose = jest.fn();
    const renderModal = (replyId?: string) =>
      renderWithProviders(
        <ModalContext.Provider value={{ onClose }}>
          <HelpGroupReportModal
            slug="refaire-un-cv"
            discussionId="discussion-1"
            replyId={replyId}
            author={{
              isDeleted: false,
              firstName: 'Malik',
              lastNameInitial: 'R.',
            }}
            content="Pareil pour moi !"
          />
        </ModalContext.Provider>
      );
    const chooseReason = (label: string) =>
      fireEvent.click(screen.getByLabelText(label));

    it('sends a report with a motive only, then confirms and closes', async () => {
      mockReport.mockResolvedValue({ data: { id: 'report-1' } });
      const { store } = renderModal('reply-7');
      expect(
        screen.getByText(/La personne signalée n’est pas prévenue/)
      ).toBeInTheDocument();
      chooseReason('Spam');
      fireEvent.click(screen.getByTestId('report-confirm'));
      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(mockReport).toHaveBeenCalledWith({
        slug: 'refaire-un-cv',
        discussionId: 'discussion-1',
        dto: { target: { replyId: 'reply-7' }, reason: 'SPAM' },
      });
      expect(notifications(store)).toContain('Merci, l’équipe a été prévenue');
    });

    it('reports the original message of the discussion, with a comment', async () => {
      mockReport.mockResolvedValue({ data: { id: 'report-1' } });
      renderModal();
      chooseReason('Arnaque');
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '  Demande de virement  ' },
      });
      fireEvent.click(screen.getByTestId('report-confirm'));
      await waitFor(() =>
        expect(mockReport).toHaveBeenCalledWith(
          expect.objectContaining({
            dto: {
              target: { discussionId: 'discussion-1' },
              reason: 'FRAUD',
              comment: 'Demande de virement',
            },
          })
        )
      );
    });

    it('recalls the author and the content of the reported message', () => {
      renderModal('reply-7');
      expect(screen.getByTestId('report-excerpt')).toHaveTextContent(
        'Malik R. · « Pareil pour moi ! »'
      );
    });

    it('blocks the sending and flags the motive while none is chosen', () => {
      renderModal();
      fireEvent.click(screen.getByTestId('report-confirm'));
      expect(mockReport).not.toHaveBeenCalled();
      expect(screen.getByText('Choisissez un motif.')).toBeInTheDocument();
    });

    it('always shows the same 3114 help box, whatever the motive', () => {
      renderModal();
      const helpText = () => screen.getByTestId('report-help').textContent;
      const initial = helpText();
      expect(initial).toContain(
        'Vous, ou la personne concernée, allez mal ? Le 3114 répond 24h/24, gratuitement.'
      );
      expect(screen.getByRole('link', { name: '3114' })).toHaveAttribute(
        'href',
        'tel:3114'
      );
      ['Spam', 'Arnaque', 'Propos déplacés', 'Mise en danger', 'Autre'].forEach(
        (label) => {
          chooseReason(label);
          expect(helpText()).toBe(initial);
        }
      );
    });

    it('offers to contact one’s referent when known', () => {
      mockStaffContact = { name: 'Clothilde', email: 'clothilde@test.fr' };
      renderModal();
      const referent = screen.getByTestId('report-referent');
      expect(referent).toHaveTextContent('Clothilde');
      expect(within(referent).getByRole('link')).toHaveAttribute(
        'href',
        'mailto:clothilde@test.fr'
      );
    });

    it('shows no referent when unknown', () => {
      renderModal();
      expect(screen.queryByTestId('report-referent')).not.toBeInTheDocument();
    });

    it('tells the person they already reported the message', async () => {
      mockReport.mockResolvedValue({ error: 'ALREADY_REPORTED' });
      renderModal('reply-7');
      chooseReason('Autre');
      fireEvent.click(screen.getByTestId('report-confirm'));
      expect(
        await screen.findByText(
          'Vous avez déjà signalé ce contenu, l’équipe s’en occupe'
        )
      ).toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Report action in the message menu', () => {
    it('offers the report to a non member on someone else reply', async () => {
      renderView({
        viewerPermissions: permissions({ state: 'mustJoin' }),
        replies: [buildReply({ id: 'reply-7', author: claire })],
      });
      fireEvent.click(screen.getAllByTestId('message-menu-toggle')[1]);
      fireEvent.click(screen.getByText('Signaler ce message'));
      expect(
        await screen.findByTestId('help-group-report-modal')
      ).toBeInTheDocument();
    });

    it('never offers the report on one’s own message', () => {
      renderView({
        replies: [
          buildReply({
            author: buildAuthor({ id: 'viewer-1', firstName: 'Julien' }),
          }),
        ],
      });
      fireEvent.click(screen.getAllByTestId('message-menu-toggle')[1]);
      expect(screen.queryByText('Signaler ce message')).not.toBeInTheDocument();
    });

    it('never offers the report on a message under review', () => {
      expect(
        getMessageMenuActions({
          isAuthor: false,
          isAdmin: false,
          isEdited: false,
          isUnderReview: true,
        })
      ).toEqual(['copyLink']);
      expect(
        getMessageMenuActions({
          isAuthor: false,
          isAdmin: false,
          isEdited: false,
        })
      ).toEqual(['copyLink', 'report']);
    });
  });

  describe('Message hidden after reports', () => {
    it('shows a neutral mention instead of a hidden reply, without author, reactions nor actions', () => {
      renderView({ replies: [buildHiddenReply('reply-7')] });
      const reply = screen.getByTestId('discussion-reply');
      expect(reply).toHaveTextContent(
        'Ce message est en cours de vérification par l’équipe'
      );
      expect(
        within(reply).queryByTestId('message-menu-toggle')
      ).not.toBeInTheDocument();
      expect(
        within(reply).queryByTestId('reaction-toggle')
      ).not.toBeInTheDocument();
    });

    it('shows their hidden reply to its author, with the mention', () => {
      renderView({
        replies: [
          buildReply({
            content: 'Mon message',
            isUnderReview: true,
            author: buildAuthor({ id: 'viewer-1', firstName: 'Julien' }),
          }),
        ],
      });
      const reply = screen.getByTestId('discussion-reply');
      expect(
        within(reply).getByTestId('under-review-mention')
      ).toHaveTextContent(
        'Ce message est en cours de vérification par l’équipe'
      );
      expect(reply).toHaveTextContent('Mon message');
    });

    it('shows a hidden reply to an admin with the banner, the motives and the decisions', async () => {
      mockRestore.mockResolvedValue({ data: undefined });
      renderView({
        viewer: admin,
        viewerPermissions: permissions({ state: 'mustJoin' }),
        replies: [
          buildReply({
            id: 'reply-7',
            content: 'Message signalé',
            author: claire,
            isUnderReview: true,
            reportReasons: ['INSULTS', 'SPAM'],
          }),
        ],
      });
      const banner = screen.getByTestId('hidden-by-reports-banner');
      expect(banner).toHaveTextContent('Masqué après signalements');
      expect(banner).toHaveTextContent('Motifs : Propos déplacés, Spam');
      expect(screen.getByTestId('discussion-reply')).toHaveTextContent(
        'Message signalé'
      );

      fireEvent.click(screen.getByTestId('restore-message'));
      await waitFor(() =>
        expect(mockRestore).toHaveBeenCalledWith({
          kind: 'replies',
          id: 'reply-7',
        })
      );

      fireEvent.click(screen.getByTestId('moderate-hidden-message'));
      expect(
        await screen.findByTestId('moderation-confirm')
      ).toBeInTheDocument();
    });

    it('gives the decision to an admin on their own hidden message', () => {
      renderView({
        viewer: admin,
        replies: [
          buildReply({
            author: buildAuthor({ id: 'admin-1', firstName: 'Paul' }),
            isUnderReview: true,
            reportReasons: ['SPAM'],
          }),
        ],
      });
      expect(
        screen.getByTestId('hidden-by-reports-banner')
      ).toBeInTheDocument();
      expect(screen.getByTestId('restore-message')).toBeInTheDocument();
      expect(
        screen.queryByTestId('under-review-mention')
      ).not.toBeInTheDocument();
    });

    it('replaces the title and message of a hidden discussion, its replies staying readable', () => {
      renderView({
        discussion: buildHiddenDiscussion({ repliesCount: 1 }),
        replies: [buildReply({ content: 'Une réponse lisible' })],
      });
      expect(screen.getByTestId('original-message')).toHaveTextContent(
        'Ce message est en cours de vérification par l’équipe'
      );
      expect(
        screen.queryByRole('link', { name: 'Voir son profil' })
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('discussion-reply')).toHaveTextContent(
        'Une réponse lisible'
      );
    });
  });
});
