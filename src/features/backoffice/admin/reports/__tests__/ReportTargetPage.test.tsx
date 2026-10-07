import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ReportItem, ReportTargetDetail } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { ReportTargetPage } from '../ReportTargetPage';

const mockUseTarget = jest.fn();
const mockUseMessages = jest.fn();
const mockResolve = jest.fn();

jest.mock('@/src/use-cases/reports', () => ({
  ...jest.requireActual('@/src/use-cases/reports'),
  useGetAdminReportTargetQuery: () => mockUseTarget(),
  useGetAdminReportedConversationMessagesInfiniteQuery: (id: string) =>
    mockUseMessages(id),
  useResolveAdminReportTargetMutation: () => [
    mockResolve,
    { isLoading: false },
  ],
}));
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    asPath: '/',
    push: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  }),
}));

const jeanne = {
  id: 'user-1',
  firstName: 'Jeanne',
  lastName: 'Martin',
  role: UserRoles.CANDIDATE,
  zone: 'LYON' as const,
};
const paul = {
  id: 'user-2',
  firstName: 'Paul',
  lastName: 'Durand',
  role: UserRoles.COACH,
  zone: 'PARIS' as const,
};

const buildReport = (props: Partial<ReportItem> = {}): ReportItem => ({
  id: 'report-1',
  reporter: paul,
  reason: 'INSULTS',
  comment: 'Propos insultants',
  zone: 'LYON',
  status: 'PENDING',
  createdAt: '2026-10-02T10:00:00.000Z',
  resolution: null,
  resolvedAt: null,
  resolvedBy: null,
  resolutionNote: null,
  ...props,
});

const renderPage = (
  target: ReportTargetDetail,
  props: { openResolve?: boolean; onResolveOpened?: () => void } = {}
) => {
  mockUseTarget.mockReturnValue({ data: target, isLoading: false });
  return renderWithProviders(
    <ReportTargetPage
      targetType={target.targetType}
      targetId={target.targetId}
      {...props}
    />
  );
};

const notifications = (store: { getState: () => unknown }) =>
  (
    store.getState() as {
      notifications: { notifications: { message: string }[] };
    }
  ).notifications.notifications.map(({ message }) => message);

describe('ReportTargetPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMessages.mockReturnValue({
      data: {
        pages: [
          {
            messages: [
              {
                id: 'message-2',
                content: 'Deuxième message',
                createdAt: '2026-10-02T09:00:00.000Z',
                type: 'USER',
                author: jeanne,
                medias: [],
              },
              {
                id: 'message-1',
                content: 'Premier message',
                createdAt: '2026-10-01T09:00:00.000Z',
                type: 'USER',
                author: paul,
                medias: [],
              },
            ],
            nextCursor: 'cursor',
          },
        ],
      },
      isLoading: false,
      isError: false,
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });
  });

  it('shows the reports and the whole conversation, read only, oldest message first', () => {
    renderPage({
      targetType: 'CONVERSATION',
      targetId: 'conversation-1',
      label: 'Conversation entre Jeanne Martin et Paul Durand',
      status: 'PENDING',
      canResolve: true,
      reports: [buildReport(), buildReport({ id: 'report-2', comment: null })],
      context: { targetType: 'CONVERSATION', participants: [jeanne, paul] },
    });

    expect(mockUseMessages).toHaveBeenCalledWith('conversation-1');
    expect(screen.getByText('Signalements reçus (2)')).toBeInTheDocument();
    expect(screen.getByText('Aucun commentaire')).toBeInTheDocument();
    const messages = screen.getAllByTestId('report-conversation-message');
    expect(messages[0]).toHaveTextContent('Premier message');
    expect(messages[1]).toHaveTextContent('Deuxième message');
    expect(screen.getByTestId('report-conversation-older')).toBeInTheDocument();
    // Read only: nothing to write in the conversation
    expect(screen.queryByRole('textbox', { name: /message/i })).toBeNull();
    expect(screen.getByTestId('report-resolve-form')).toBeInTheDocument();
  });

  it('offers the admin page and « Écrire à… » for each person, and nothing for a deleted account', () => {
    renderPage({
      targetType: 'USER_PROFILE',
      targetId: 'user-1',
      label: 'Jeanne Martin',
      status: 'PENDING',
      canResolve: true,
      reports: [buildReport({ reporter: null })],
      context: { targetType: 'USER_PROFILE', user: jeanne },
    });

    expect(
      screen.getByTestId('report-person-profile-user-1').closest('a')
    ).toHaveAttribute('href', '/backoffice/admin/membres/user-1');
    expect(
      screen.getByTestId('report-person-write-user-1').closest('a')
    ).toHaveAttribute('href', '/backoffice/messaging?userId=user-1');
    expect(screen.getByText('Écrire à Jeanne')).toBeInTheDocument();
    expect(screen.getByText('Utilisateur supprimé')).toBeInTheDocument();
    expect(screen.getAllByText('Voir la fiche')).toHaveLength(1);
  });

  it('closes a profile with the note', async () => {
    mockResolve.mockResolvedValue({ data: { resolvedCount: 1 } });
    renderPage({
      targetType: 'USER_PROFILE',
      targetId: 'user-1',
      label: 'Jeanne Martin',
      status: 'PENDING',
      canResolve: true,
      reports: [buildReport()],
      context: { targetType: 'USER_PROFILE', user: jeanne },
    });

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '  Échange avec la personne, sans suite  ' },
    });
    fireEvent.click(screen.getByTestId('report-resolve-submit'));

    await waitFor(() =>
      expect(mockResolve).toHaveBeenCalledWith({
        targetType: 'USER_PROFILE',
        targetId: 'user-1',
        note: 'Échange avec la personne, sans suite',
      })
    );
  });

  describe('From « Marquer comme traité » in Slack', () => {
    const pendingProfile: ReportTargetDetail = {
      targetType: 'USER_PROFILE',
      targetId: 'user-1',
      label: 'Jeanne Martin',
      status: 'PENDING',
      canResolve: true,
      reports: [buildReport()],
      context: { targetType: 'USER_PROFILE', user: jeanne },
    };

    it('brings the closing form into view with its note focused, without closing', () => {
      const onResolveOpened = jest.fn();
      renderPage(pendingProfile, { openResolve: true, onResolveOpened });
      expect(screen.getByRole('textbox')).toHaveFocus();
      expect(onResolveOpened).toHaveBeenCalledTimes(1);
      expect(mockResolve).not.toHaveBeenCalled();
    });

    it('tells that the report was already handled, without closing form', () => {
      const onResolveOpened = jest.fn();
      const { store } = renderPage(
        {
          ...pendingProfile,
          status: 'RESOLVED',
          reports: [buildReport({ status: 'RESOLVED', resolution: 'MANUAL' })],
        },
        { openResolve: true, onResolveOpened }
      );
      expect(notifications(store)).toContain(
        'Ce signalement a déjà été traité.'
      );
      expect(onResolveOpened).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('report-resolve-form')).toBeNull();
    });

    it('focuses nothing without the action in the address', () => {
      renderPage(pendingProfile);
      expect(screen.getByRole('textbox')).not.toHaveFocus();
    });
  });

  it('shows the note and the admin of a handled report, without closing form', () => {
    renderPage({
      targetType: 'USER_PROFILE',
      targetId: 'user-1',
      label: 'Jeanne Martin',
      status: 'RESOLVED',
      canResolve: true,
      reports: [
        buildReport({
          status: 'RESOLVED',
          resolution: 'MANUAL',
          resolvedAt: '2026-10-03T10:00:00.000Z',
          resolvedBy: paul,
          resolutionNote: 'Sans suite',
        }),
      ],
      context: { targetType: 'USER_PROFILE', user: jeanne },
    });

    expect(screen.getByText(/Traité par Paul Durand le/)).toBeInTheDocument();
    expect(screen.getByText('Sans suite')).toBeInTheDocument();
    expect(screen.queryByTestId('report-resolve-form')).toBeNull();
  });

  it('shows a group message with its state and a link to its thread, without « Marquer comme traité »', () => {
    renderPage({
      targetType: 'POST_REPLY',
      targetId: 'reply-1',
      label: 'Refaire un CV — Une réponse signalée',
      status: 'PENDING',
      canResolve: false,
      reports: [buildReport()],
      context: {
        targetType: 'POST_REPLY',
        group: { id: 'group-1', name: 'Refaire un CV', slug: 'refaire-un-cv' },
        message: {
          discussionId: 'discussion-1',
          replyId: 'reply-1',
          title: null,
          content: 'Une réponse signalée',
          author: jeanne,
          state: 'HIDDEN',
          createdAt: '2026-10-01T10:00:00.000Z',
        },
      },
    });

    expect(screen.getByTestId('report-group-message-state')).toHaveTextContent(
      'Masqué'
    );
    expect(
      screen.getByTestId('report-group-message-link').closest('a')
    ).toHaveAttribute(
      'href',
      '/backoffice/groupes/refaire-un-cv/discussions/discussion-1?replyId=reply-1'
    );
    expect(screen.queryByTestId('report-resolve-form')).toBeNull();
    expect(screen.queryByText('Marquer comme traité')).toBeNull();
  });

  it('tells when the target was never reported', () => {
    mockUseTarget.mockReturnValue({ error: 'NOT_FOUND', isLoading: false });
    renderWithProviders(
      <ReportTargetPage targetType="CONVERSATION" targetId="conversation-9" />
    );
    expect(
      screen.getByText('Ce signalement est introuvable.')
    ).toBeInTheDocument();
  });
});
