import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { MessagingConversationReportModal } from '@/src/features/backoffice/messaging/MessagingConversation/MessagingConversationReport/MessagingConversationReportModal';
import { ProfileReportUserModal } from '@/src/features/backoffice/profile/ProfileReportUserModal/ProfileReportUserModal';
import { ModalContext } from '@/src/features/modals/Modal/ModalContext';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { ReportModal } from '../ReportModal';
import { ReportSubmitResult } from '../ReportModal.types';

jest.mock('@/src/api');
jest.mock('@/src/hooks/useCurrentUserStaffContact', () => ({
  useCurrentUserStaffContact: () => null,
}));

const mockedApi = Api as jest.Mocked<typeof Api>;

beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

const notifications = (store: { getState: () => unknown }) =>
  (
    store.getState() as {
      notifications: { notifications: { message: string }[] };
    }
  ).notifications.notifications.map(({ message }) => message);

const HELP_TEXT =
  'Vous, ou la personne concernée, allez mal ? Le 3114 répond 24h/24, gratuitement.';

describe('ReportModal', () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  const renderInModal = (node: React.ReactElement) =>
    renderWithProviders(
      <ModalContext.Provider value={{ onClose }}>{node}</ModalContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends a report without comment, then confirms and closes', async () => {
    onSubmit.mockResolvedValue(ReportSubmitResult.SENT);
    const { store } = renderInModal(
      <ReportModal title="Signaler ce profil" onSubmit={onSubmit} />
    );

    fireEvent.click(screen.getByLabelText('Arnaque'));
    fireEvent.click(screen.getByTestId('report-confirm'));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onSubmit).toHaveBeenCalledWith({ reason: 'FRAUD' });
    expect(notifications(store)).toContain('Merci, l’équipe a été prévenue');
  });

  it('blocks the sending and flags the motive while none is chosen', () => {
    renderInModal(
      <ReportModal title="Signaler ce profil" onSubmit={onSubmit} />
    );

    fireEvent.click(screen.getByTestId('report-confirm'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Choisissez un motif.')).toBeInTheDocument();
  });

  it('tells that the content was already reported on a 409, and stays open', async () => {
    onSubmit.mockResolvedValue(ReportSubmitResult.ALREADY_REPORTED);
    renderInModal(
      <ReportModal title="Signaler ce profil" onSubmit={onSubmit} />
    );

    fireEvent.click(screen.getByLabelText('Spam'));
    fireEvent.click(screen.getByTestId('report-confirm'));

    expect(
      await screen.findByText(
        'Vous avez déjà signalé ce contenu, l’équipe s’en occupe'
      )
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('sends the trimmed comment', async () => {
    onSubmit.mockResolvedValue(ReportSubmitResult.SENT);
    renderInModal(
      <ReportModal title="Signaler ce profil" onSubmit={onSubmit} />
    );

    fireEvent.click(screen.getByLabelText('Autre'));
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '  Un commentaire  ' },
    });
    fireEvent.click(screen.getByTestId('report-confirm'));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        reason: 'OTHER',
        comment: 'Un commentaire',
      })
    );
  });

  it('cuts a long pre-filled comment to the 1000 characters the back accepts', () => {
    renderInModal(
      <ReportModal
        title="Signaler cette conversation"
        onSubmit={onSubmit}
        defaultComment={'a'.repeat(1500)}
      />
    );
    expect(
      (screen.getByRole('textbox') as HTMLTextAreaElement).value
    ).toHaveLength(1000);
  });

  describe('Contexts', () => {
    it('reports a conversation with its own title and the help box, the comment pre-filled from a suspicious message', async () => {
      mockedApi.reportMessage.mockResolvedValue({
        data: { id: 'report-1' },
      } as never);
      renderInModal(
        <MessagingConversationReportModal
          conversationId="conversation-1"
          content="Message suspect"
        />
      );

      expect(
        screen.getByText('Signaler cette conversation')
      ).toBeInTheDocument();
      expect(screen.getByTestId('report-help').textContent).toBe(HELP_TEXT);
      expect(screen.getByRole('textbox')).toHaveValue('Message suspect');

      fireEvent.click(screen.getByLabelText('Mise en danger'));
      fireEvent.click(screen.getByTestId('report-confirm'));

      await waitFor(() => expect(onClose).toHaveBeenCalled());
      expect(mockedApi.reportMessage).toHaveBeenCalledWith('conversation-1', {
        reason: 'IN_DANGER',
        comment: 'Message suspect',
      });
    });

    it('reports a profile with its own title and the help box, and maps a 409', async () => {
      mockedApi.postProfileUserAbuse.mockRejectedValue({
        isAxiosError: true,
        response: { status: 409 },
      });
      renderInModal(<ProfileReportUserModal userId="user-1" />);

      expect(screen.getByText('Signaler ce profil')).toBeInTheDocument();
      expect(screen.getByTestId('report-help').textContent).toBe(HELP_TEXT);
      expect(screen.getByRole('link', { name: '3114' })).toHaveAttribute(
        'href',
        'tel:3114'
      );

      fireEvent.click(screen.getByLabelText('Spam'));
      fireEvent.click(screen.getByTestId('report-confirm'));

      expect(
        await screen.findByText(
          'Vous avez déjà signalé ce contenu, l’équipe s’en occupe'
        )
      ).toBeInTheDocument();
      expect(mockedApi.postProfileUserAbuse).toHaveBeenCalledWith('user-1', {
        reason: 'SPAM',
      });
    });
  });
});
