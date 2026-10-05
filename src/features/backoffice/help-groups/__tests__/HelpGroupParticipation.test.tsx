import '@testing-library/jest-dom';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HelpGroupViewerPermissions } from '@/src/api/types';
import { ModalsListener } from '@/src/features/modals/Modal/openModal';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { HelpGroupPage } from '../HelpGroupPage';
import { buildGroupPage } from '../__fixtures__/help-groups.fixtures';

const mockJoin = jest.fn();
const mockLeave = jest.fn();
const mockCreateDiscussion = jest.fn();
const mockSuggestTitle = jest.fn();

jest.mock('@/src/use-cases/help-groups', () => ({
  ...jest.requireActual('@/src/use-cases/help-groups'),
  useGetHelpGroupQuery: jest.fn(),
  useGetHelpGroupDiscussionsInfiniteQuery: () => ({
    data: { pages: [{ items: [], nextCursor: null }] },
    isLoading: false,
    isFetching: false,
    isFetchingNextPage: false,
    isError: false,
    hasNextPage: false,
    fetchNextPage: jest.fn(),
    refetch: jest.fn(),
  }),
  useJoinHelpGroupMutation: () => [mockJoin, { isLoading: false }],
  useLeaveHelpGroupMutation: () => [mockLeave, { isLoading: false }],
  useCreateHelpGroupDiscussionMutation: () => [
    mockCreateDiscussion,
    { isLoading: false },
  ],
  useSuggestHelpGroupTitleMutation: () => [mockSuggestTitle],
}));
jest.mock('@/src/use-cases/current-user', () => ({
  ...jest.requireActual('@/src/use-cases/current-user'),
  selectCurrentUser: () => ({
    id: 'viewer-1',
    firstName: 'Julien',
    role: 'Candidat',
  }),
}));
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/backoffice/groupes/refaire-un-cv',
    push: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  }),
}));
jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

// eslint-disable-next-line import-x/order
import { useGetHelpGroupQuery } from '@/src/use-cases/help-groups';

// react-modal scrolls its content on open, which jsdom does not implement
beforeAll(() => {
  Element.prototype.scrollTo = jest.fn();
});

const renderPage = (
  permissions: Partial<HelpGroupViewerPermissions> = {},
  groupProps = {}
) => {
  (useGetHelpGroupQuery as jest.Mock).mockReturnValue({
    data: buildGroupPage({
      viewerPermissions: {
        state: 'canWrite',
        charterAccepted: true,
        showWelcomeInvite: false,
        ...permissions,
      },
      ...groupProps,
    }),
    isLoading: false,
  });
  return renderWithProviders(
    <>
      <HelpGroupPage slug="refaire-un-cv" />
      <ModalsListener />
    </>
  );
};

const longMessage =
  "J'ai arrêté de travailler deux ans pour m'occuper de mon père malade.";

const openComposer = () =>
  fireEvent.click(screen.getByTestId('discussion-composer-bar'));
const typeMessage = (value: string) =>
  fireEvent.change(screen.getByTestId('discussion-composer-message'), {
    target: { value },
  });
const blurMessage = () =>
  fireEvent.blur(screen.getByTestId('discussion-composer-message'));
const titleInput = () =>
  screen.getByTestId('discussion-composer-title') as HTMLInputElement;
const typeTitle = (value: string) =>
  fireEvent.change(titleInput(), { target: { value } });

describe('Help group participation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockSuggestTitle.mockResolvedValue({
      data: { title: 'Comment expliquer deux ans sans emploi ?' },
    });
    mockCreateDiscussion.mockResolvedValue({ data: { id: 'discussion-1' } });
    mockJoin.mockResolvedValue({ data: { isMember: true } });
    mockLeave.mockResolvedValue({ data: { isMember: false } });
  });

  describe('Invitations', () => {
    it('shows the composer bar and the leave action to a member', () => {
      renderPage();
      expect(screen.getByTestId('discussion-composer-bar')).toBeInTheDocument();
      expect(screen.getByTestId('leave-help-group')).toBeInTheDocument();
      expect(
        screen.queryByTestId('write-invitation-join')
      ).not.toBeInTheDocument();
    });

    it('invites an eligible non member to join, instead of the composer', async () => {
      renderPage({ state: 'mustJoin' });
      expect(
        screen.getByText(/Pour publier une discussion, y répondre ou réagir/)
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('discussion-composer-bar')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('leave-help-group')).not.toBeInTheDocument();
    });

    it('offers the write actions right after joining, with « Vous venez de rejoindre »', async () => {
      const { rerender } = renderPage({ state: 'mustJoin' });
      fireEvent.click(screen.getByTestId('join-help-group'));
      await waitFor(() =>
        expect(mockJoin).toHaveBeenCalledWith('refaire-un-cv')
      );
      // The join invalidates the group page, which comes back as a member
      (useGetHelpGroupQuery as jest.Mock).mockReturnValue({
        data: buildGroupPage(),
        isLoading: false,
      });
      rerender(
        <>
          <HelpGroupPage slug="refaire-un-cv" />
          <ModalsListener />
        </>
      );
      expect(screen.getByText('Vous venez de rejoindre')).toBeInTheDocument();
      expect(screen.getByTestId('discussion-composer-bar')).toBeInTheDocument();
    });

    it('invites a person without the eLearning to finish it, without join button', () => {
      renderPage({ state: 'mustCompleteElearning' });
      expect(
        screen.getByText('Terminez votre formation pour participer aux groupes')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Accéder à mes formations' })
      ).toHaveAttribute('href', '/backoffice/ressources/formations');
      expect(screen.queryByTestId('join-help-group')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('discussion-composer-bar')
      ).not.toBeInTheDocument();
    });

    it('shows no write action at all in an unpublished group', () => {
      renderPage({}, { isPublished: false });
      expect(
        screen.queryByTestId('discussion-composer-bar')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('write-invitation-join')
      ).not.toBeInTheDocument();
    });

    it('never shows a disabled write action', () => {
      ['canWrite', 'mustJoin', 'mustCompleteElearning'].forEach((state) => {
        const { unmount } = renderPage({
          state: state as HelpGroupViewerPermissions['state'],
        });
        document.querySelectorAll('button').forEach((button) => {
          expect(button).not.toBeDisabled();
        });
        unmount();
      });
    });

    it('leaves the group after a confirmation saying it can be joined again', async () => {
      renderPage();
      fireEvent.click(screen.getByTestId('leave-help-group'));
      expect(
        await screen.findByText(
          /Vous pourrez rejoindre ce groupe à tout moment/
        )
      ).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('modal-confirm-confirm'));
      await waitFor(() =>
        expect(mockLeave).toHaveBeenCalledWith('refaire-un-cv')
      );
    });

    it('stays member when the leave confirmation is cancelled', async () => {
      renderPage();
      fireEvent.click(screen.getByTestId('leave-help-group'));
      fireEvent.click(await screen.findByTestId('modal-confirm-cancel'));
      expect(mockLeave).not.toHaveBeenCalled();
    });
  });

  describe('Welcome', () => {
    it('invites a new member by their first name, and opens the composer', () => {
      renderPage({ showWelcomeInvite: true });
      expect(
        screen.getByText(
          'Bienvenue, Julien. Présentez-vous en deux lignes : où vous en êtes, et ce qui vous amène ici.'
        )
      ).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('welcome-invite'));
      expect(screen.getByTestId('discussion-composer')).toBeInTheDocument();
    });

    it('does not invite when the back does not ask for it', () => {
      renderPage({ showWelcomeInvite: false });
      expect(screen.queryByTestId('welcome-invite')).not.toBeInTheDocument();
    });
  });

  describe('Composer', () => {
    it('opens in place, message first, with the visibility mention', () => {
      renderPage();
      openComposer();
      expect(screen.getByTestId('discussion-composer')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(
        screen.getByText(
          'Votre message sera visible par toutes les personnes inscrites sur Entourage Pro.'
        )
      ).toBeInTheDocument();
      const message = screen.getByTestId('discussion-composer-message');
      expect(
        message.compareDocumentPosition(titleInput()) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it('proposes a title when leaving a long enough message', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      blurMessage();
      await waitFor(() =>
        expect(titleInput().value).toBe(
          'Comment expliquer deux ans sans emploi ?'
        )
      );
      expect(
        screen.getByText('Proposé pour vous, modifiable')
      ).toBeInTheDocument();
      expect(mockSuggestTitle).toHaveBeenCalledWith({
        slug: 'refaire-un-cv',
        content: longMessage,
        previousTitles: [],
      });
    });

    it('does not propose a title for a message shorter than 30 characters', () => {
      renderPage();
      openComposer();
      typeMessage('Trop court');
      blurMessage();
      expect(mockSuggestTitle).not.toHaveBeenCalled();
    });

    it('replaces an untouched proposal when the message changes, never a retouched title', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      blurMessage();
      await waitFor(() => expect(titleInput().value).not.toBe(''));

      mockSuggestTitle.mockResolvedValue({ data: { title: 'Nouveau titre' } });
      typeMessage(`${longMessage} Encore.`);
      blurMessage();
      await waitFor(() => expect(titleInput().value).toBe('Nouveau titre'));

      typeTitle('Mon titre retouché');
      typeMessage(`${longMessage} Encore plus.`);
      blurMessage();
      expect(mockSuggestTitle).toHaveBeenCalledTimes(2);
      expect(titleInput().value).toBe('Mon titre retouché');
    });

    it('never overwrites a title typed during the generation', async () => {
      let resolve: (value: unknown) => void = () => undefined;
      mockSuggestTitle.mockReturnValue(
        new Promise((res) => {
          resolve = res;
        })
      );
      renderPage();
      openComposer();
      typeMessage(longMessage);
      blurMessage();
      typeTitle('Mon titre');
      await act(async () => {
        resolve({ data: { title: 'Titre proposé' } });
      });
      expect(titleInput().value).toBe('Mon titre');
    });

    it('leaves the title empty when the proposal fails', async () => {
      mockSuggestTitle.mockResolvedValue({ data: { title: null } });
      renderPage();
      openComposer();
      typeMessage(longMessage);
      blurMessage();
      await waitFor(() => expect(mockSuggestTitle).toHaveBeenCalled());
      expect(titleInput().value).toBe('');
      expect(titleInput().placeholder).toBe('Écrivez votre titre');
    });

    it('proposes another title, different from the previous ones, 5 times at most', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      blurMessage();
      for (let index = 1; index <= 5; index += 1) {
        mockSuggestTitle.mockResolvedValueOnce({
          data: { title: `Titre ${index}` },
        });
        fireEvent.click(
          await screen.findByTestId('discussion-composer-retry-title')
        );
        await waitFor(() => expect(titleInput().value).toBe(`Titre ${index}`));
      }
      expect(mockSuggestTitle).toHaveBeenLastCalledWith(
        expect.objectContaining({
          previousTitles: [
            'Comment expliquer deux ans sans emploi ?',
            'Titre 1',
            'Titre 2',
            'Titre 3',
            'Titre 4',
          ],
        })
      );
      expect(
        screen.queryByTestId('discussion-composer-retry-title')
      ).not.toBeInTheDocument();
      expect(titleInput()).not.toBeDisabled();
    });

    it('empties the title on « Écrire le mien »', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      blurMessage();
      await waitFor(() => expect(titleInput().value).not.toBe(''));
      fireEvent.click(screen.getByTestId('discussion-composer-own-title'));
      expect(titleInput().value).toBe('');
    });

    it('publishes exactly the displayed title with its source', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      blurMessage();
      await waitFor(() => expect(titleInput().value).not.toBe(''));
      typeTitle('Comment expliquer deux ans sans emploi sur mon CV ?');
      fireEvent.click(screen.getByTestId('discussion-composer-publish'));
      await waitFor(() =>
        expect(mockCreateDiscussion).toHaveBeenCalledWith({
          slug: 'refaire-un-cv',
          dto: {
            title: 'Comment expliquer deux ans sans emploi sur mon CV ?',
            content: longMessage,
            titleSource: 'AI_EDITED',
          },
        })
      );
    });

    it('flags a missing title and does not publish', () => {
      renderPage();
      openComposer();
      typeMessage('Un message');
      fireEvent.click(screen.getByTestId('discussion-composer-publish'));
      expect(screen.getByText('Le titre est obligatoire.')).toBeInTheDocument();
      expect(mockCreateDiscussion).not.toHaveBeenCalled();
    });

    it('refuses a message over 5000 characters', () => {
      renderPage();
      openComposer();
      typeMessage('a'.repeat(5001));
      typeTitle('Titre');
      fireEvent.click(screen.getByTestId('discussion-composer-publish'));
      expect(screen.getByText('5000 caractères maximum.')).toBeInTheDocument();
      expect(mockCreateDiscussion).not.toHaveBeenCalled();
    });

    it('restores the draft when coming back, and erases it after publishing', async () => {
      const { unmount } = renderPage();
      openComposer();
      typeMessage('Mon brouillon');
      typeTitle('Mon titre');
      await waitFor(() =>
        expect(
          localStorage.getItem('help-groups:draft:viewer-1:group:group-1')
        ).not.toBeNull()
      );
      unmount();

      renderPage();
      expect(
        (
          screen.getByTestId(
            'discussion-composer-message'
          ) as HTMLTextAreaElement
        ).value
      ).toBe('Mon brouillon');
      expect(titleInput().value).toBe('Mon titre');

      fireEvent.click(screen.getByTestId('discussion-composer-publish'));
      await waitFor(() => expect(mockCreateDiscussion).toHaveBeenCalled());
      await waitFor(() =>
        expect(
          localStorage.getItem('help-groups:draft:viewer-1:group:group-1')
        ).toBeNull()
      );
    });
  });

  describe('Charter', () => {
    const fillAndPublish = () => {
      openComposer();
      typeMessage('Mon message');
      typeTitle('Mon titre');
      fireEvent.click(screen.getByTestId('discussion-composer-publish'));
    };

    it('publishes directly once the charter is accepted', async () => {
      renderPage({ charterAccepted: true });
      fillAndPublish();
      await waitFor(() => expect(mockCreateDiscussion).toHaveBeenCalled());
      expect(
        screen.queryByText('Avant votre première publication')
      ).not.toBeInTheDocument();
    });

    it('presents the charter first, and publishes with its acceptance', async () => {
      renderPage({ charterAccepted: false });
      fillAndPublish();
      expect(
        await screen.findByText('Avant votre première publication')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Ces règles valent pour tous les groupes. Elles ne vous seront pas redemandées.'
        )
      ).toBeInTheDocument();
      expect(mockCreateDiscussion).not.toHaveBeenCalled();
      const accept = screen.getByTestId('charter-modal-accept');
      expect(accept).toBeDisabled();

      fireEvent.click(
        screen.getByLabelText('J’ai lu ce cadre et je m’engage à le respecter')
      );
      expect(accept).not.toBeDisabled();
      fireEvent.click(accept);
      await waitFor(() =>
        expect(mockCreateDiscussion).toHaveBeenCalledWith(
          expect.objectContaining({
            dto: expect.objectContaining({ acceptCharter: true }),
          })
        )
      );
    });

    it('keeps the text and publishes nothing when the charter is cancelled', async () => {
      renderPage({ charterAccepted: false });
      fillAndPublish();
      fireEvent.click(await screen.findByTestId('charter-modal-cancel'));
      expect(mockCreateDiscussion).not.toHaveBeenCalled();
      expect(
        (
          screen.getByTestId(
            'discussion-composer-message'
          ) as HTMLTextAreaElement
        ).value
      ).toBe('Mon message');
    });

    it('presents the charter when the back asks for it (409)', async () => {
      mockCreateDiscussion.mockResolvedValueOnce({
        error: 'CHARTER_NOT_ACCEPTED',
      });
      renderPage({ charterAccepted: true });
      fillAndPublish();
      expect(
        await screen.findByText('Avant votre première publication')
      ).toBeInTheDocument();
    });
  });
});
