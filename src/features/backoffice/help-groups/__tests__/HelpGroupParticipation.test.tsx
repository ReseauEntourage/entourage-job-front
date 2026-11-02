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
  useGetHelpGroupMembersQuery: () => ({
    data: { members: [], total: 0 },
    currentData: { members: [], total: 0 },
    isFetching: false,
    isError: false,
    refetch: jest.fn(),
  }),
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
// jsdom has no layout: the window width is set by each test
let mockWindowWidth = 1440;
jest.mock('@react-hook/window-size', () => ({
  ...jest.requireActual('@react-hook/window-size'),
  useWindowWidth: () => mockWindowWidth,
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
const requestButton = () =>
  screen.queryByTestId('discussion-composer-request-title');
const requestTitle = () =>
  fireEvent.click(screen.getByTestId('discussion-composer-request-title'));
const FAILED_MESSAGE =
  "Aucune proposition pour l'instant. Écrivez votre titre.";

describe('Help group participation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockWindowWidth = 1440;
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
        screen.getByText(/Rejoignez le groupe pour participer à la discussion/)
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('discussion-composer-bar')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('leave-help-group')).not.toBeInTheDocument();
    });

    it('offers the write actions right after joining, with « Vous venez de rejoindre »', async () => {
      const { rerender } = renderPage({ state: 'mustJoin' });
      fireEvent.click(
        within(screen.getByTestId('write-invitation-join')).getByTestId(
          'join-help-group'
        )
      );
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

  describe('Layout', () => {
    const header = () => within(screen.getByTestId('help-group-header'));
    const isBefore = (first: Element, second: Element) =>
      !!(
        first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING
      );

    it('shows the full description in the full-width header', () => {
      renderPage({}, { description: 'Première ligne\nDeuxième ligne' });
      expect(
        header().getByText(/Première ligne\s+Deuxième ligne/)
      ).toBeInTheDocument();
      expect(
        header().getByRole('heading', { level: 1, name: 'Refaire un CV' })
      ).toBeInTheDocument();
      expect(
        screen.queryByText('À propos de ce groupe')
      ).not.toBeInTheDocument();
    });

    it('offers « Rejoindre le groupe » both in the header and in the invitation of the main column to an eligible non member', () => {
      renderPage({ state: 'mustJoin' });
      const invitation = screen.getByTestId('write-invitation-join');
      expect(invitation).toHaveTextContent(
        'Rejoignez le groupe pour participer à la discussion, y répondre ou réagir.'
      );
      expect(
        within(invitation).getByTestId('join-help-group')
      ).toHaveTextContent('Rejoindre le groupe');
      expect(header().getByTestId('join-help-group')).toHaveTextContent(
        'Rejoindre le groupe'
      );
      expect(header().queryByTestId('leave-help-group')).toBeNull();
    });

    it('offers no adhesion action to a person without the eLearning', () => {
      renderPage({ state: 'mustCompleteElearning' });
      expect(
        screen.getByTestId('write-invitation-elearning')
      ).toBeInTheDocument();
      expect(header().queryByTestId('help-group-adhesion')).toBeNull();
      expect(header().queryByTestId('join-help-group')).toBeNull();
      expect(header().queryByTestId('leave-help-group')).toBeNull();
    });

    it('offers « Quitter le groupe » in the header to a member, and no « Publier une discussion »', () => {
      renderPage();
      expect(header().getByTestId('help-group-member-badge')).toHaveTextContent(
        'Vous êtes membre'
      );
      expect(header().getByTestId('leave-help-group')).toHaveTextContent(
        'Quitter le groupe'
      );
      expect(
        screen.queryByTestId('write-invitation-join')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Publier une discussion')).toBeNull();
      expect(screen.queryByTestId('publish-discussion')).toBeNull();
    });

    it('offers no adhesion action in the preview of an unpublished group', () => {
      renderPage({}, { isPublished: false });
      expect(header().getByText('Non publié')).toBeInTheDocument();
      expect(header().queryByTestId('help-group-adhesion')).toBeNull();
      expect(header().queryByTestId('join-help-group')).toBeNull();
      expect(header().queryByTestId('leave-help-group')).toBeNull();
    });

    it('puts the composer and the discussions on the left, « Les membres », « Le cadre » then the emails on the right', () => {
      renderPage();
      const headerBlock = screen.getByTestId('help-group-header');
      const composerBar = screen.getByTestId('discussion-composer-bar');
      const discussions = screen.getByTestId('help-group-no-discussion');
      const members = screen.getByTestId('help-group-members');
      const charter = screen.getByTestId('help-group-charter');
      const emails = screen.getByTestId('emails-setting');
      [headerBlock, composerBar, discussions].reduce((previous, block) => {
        expect(isBefore(previous, block)).toBe(true);
        return block;
      });
      [members, charter, emails].reduce((previous, block) => {
        expect(isBefore(previous, block)).toBe(true);
        return block;
      });
      const aside = charter.closest('aside');
      expect(aside).not.toBeNull();
      expect(aside).toContainElement(members);
      expect(aside).toContainElement(emails);
      expect(aside).not.toContainElement(composerBar);
      expect(headerBlock).not.toContainElement(charter);
    });

    it('shows no invitation to introduce oneself to a new member', () => {
      renderPage();
      expect(screen.queryByText(/Bienvenue/)).not.toBeInTheDocument();
      expect(screen.queryByText('Me présenter')).not.toBeInTheDocument();
    });

    describe('below the desktop breakpoint', () => {
      beforeEach(() => {
        mockWindowWidth = 390;
      });

      it('offers « Quitter le groupe » only in the « ⋯ » menu next to the name', async () => {
        renderPage();
        expect(
          screen.queryByTestId('leave-help-group')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Quitter le groupe')).not.toBeInTheDocument();
        const toggle = header().getByRole('button', {
          name: "Plus d'actions sur le groupe",
        });
        fireEvent.click(toggle);
        const leave = header().getByTestId('leave-help-group');
        expect(leave).toHaveTextContent('Quitter le groupe');
        fireEvent.click(leave);
        fireEvent.click(await screen.findByTestId('modal-confirm-confirm'));
        await waitFor(() =>
          expect(mockLeave).toHaveBeenCalledWith('refaire-un-cv')
        );
      });

      it('offers « Voir les N membres » first in the « ⋯ » menu, opening the members list', async () => {
        renderPage();
        fireEvent.click(
          header().getByRole('button', { name: "Plus d'actions sur le groupe" })
        );
        const seeMembers = header().getByTestId('help-group-menu-see-members');
        expect(
          isBefore(seeMembers, header().getByTestId('leave-help-group'))
        ).toBe(true);
        expect(seeMembers).toHaveTextContent(/^Voir les \d+ membres$/);
        fireEvent.click(seeMembers);
        expect(
          await screen.findByTestId('help-group-members-list')
        ).toBeInTheDocument();
      });

      it('collapses « Le cadre » under the description, and chains the blocks in a single column', () => {
        renderPage();
        const headerBlock = screen.getByTestId('help-group-header');
        const charter = screen.getByTestId('help-group-charter');
        expect(charter.tagName).toBe('DETAILS');
        expect(charter).not.toHaveAttribute('open');
        expect(headerBlock).toContainElement(charter);
        expect(
          isBefore(
            header().getByText('Échanger sur la rédaction de son CV'),
            charter
          )
        ).toBe(true);
        expect(document.querySelector('aside')).toBeNull();
        // No « Les membres » block: the full list is in the « ⋯ » menu
        expect(
          screen.queryByTestId('help-group-members')
        ).not.toBeInTheDocument();
        const blocks = [
          headerBlock,
          screen.getByTestId('discussion-composer-bar'),
          screen.getByTestId('help-group-no-discussion'),
          screen.getByTestId('emails-setting'),
        ];
        blocks.reduce((previous, block) => {
          expect(isBefore(previous, block)).toBe(true);
          return block;
        });
      });
    });
  });

  describe('Composer', () => {
    const messageInput = () =>
      screen.getByTestId('discussion-composer-message') as HTMLTextAreaElement;

    it('is closed by default, on one line with the viewer avatar and the invitation', () => {
      renderPage();
      const bar = screen.getByTestId('discussion-composer-bar');
      expect(bar).toHaveTextContent(
        'Posez une question, partagez une situation, proposez votre aide…'
      );
      expect(bar).toHaveAccessibleName('Écrire une nouvelle discussion');
      expect(
        within(bar.parentElement as HTMLElement).getByTestId(
          'help-group-avatar'
        )
      ).toHaveTextContent('J');
      expect(
        screen.queryByTestId('discussion-composer')
      ).not.toBeInTheDocument();
    });

    it('opens as soon as the bar takes the focus, the message taking it', () => {
      renderPage();
      fireEvent.focus(screen.getByTestId('discussion-composer-bar'));
      expect(screen.getByTestId('discussion-composer')).toBeInTheDocument();
      expect(messageInput()).toHaveFocus();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens with a draft restored when coming back', () => {
      localStorage.setItem(
        'help-groups:draft:viewer-1:group:group-1',
        JSON.stringify({
          content: 'Mon brouillon',
          title: '',
          titleOrigin: 'none',
        })
      );
      renderPage();
      expect(
        screen.queryByTestId('discussion-composer-bar')
      ).not.toBeInTheDocument();
      expect(messageInput().value).toBe('Mon brouillon');
      expect(messageInput()).not.toHaveFocus();
    });

    it('stays open when the message loses the focus with a text', () => {
      renderPage();
      openComposer();
      typeMessage('Trop court');
      blurMessage();
      fireEvent.mouseDown(document.body);
      fireEvent.click(document.body);
      expect(screen.getByTestId('discussion-composer')).toBeInTheDocument();
      expect(messageInput().value).toBe('Trop court');
    });

    it('closes only on « Annuler », which erases the draft', async () => {
      const { unmount } = renderPage();
      openComposer();
      typeMessage('Mon brouillon');
      await waitFor(() =>
        expect(
          localStorage.getItem('help-groups:draft:viewer-1:group:group-1')
        ).not.toBeNull()
      );
      fireEvent.click(screen.getByTestId('discussion-composer-cancel'));
      expect(screen.getByTestId('discussion-composer-bar')).toBeInTheDocument();
      expect(
        localStorage.getItem('help-groups:draft:viewer-1:group:group-1')
      ).toBeNull();
      unmount();
      renderPage();
      expect(screen.getByTestId('discussion-composer-bar')).toBeInTheDocument();
    });

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

    it('proposes nothing when leaving the message, however long', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      blurMessage();
      await act(async () => undefined);
      expect(mockSuggestTitle).not.toHaveBeenCalled();
      expect(titleInput().value).toBe('');
      expect(titleInput().placeholder).toBe('Écrivez votre titre');
      expect(requestButton()).toBeInTheDocument();
    });

    it("offers the proposal from 30 characters on, with « Proposer un titre avec l'IA »", () => {
      renderPage();
      openComposer();
      expect(requestButton()).not.toBeInTheDocument();
      typeMessage('Trop court');
      expect(requestButton()).not.toBeInTheDocument();
      expect(titleInput().placeholder).toBe('Écrivez votre titre');
      typeMessage(longMessage);
      expect(requestButton()).toHaveTextContent("Proposer un titre avec l'IA");
    });

    it('proposes a title on request, with the mention, then the focus goes to the title', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      requestTitle();
      await waitFor(() =>
        expect(titleInput().value).toBe(
          'Comment expliquer deux ans sans emploi ?'
        )
      );
      expect(
        screen.getByTestId('discussion-composer-suggested-title')
      ).toHaveTextContent(
        "Proposé par l'IA. Vérifiez, ajustez sa proposition."
      );
      expect(mockSuggestTitle).toHaveBeenCalledWith({
        slug: 'refaire-un-cv',
        content: longMessage,
        previousTitles: [],
      });
      expect(requestButton()).toHaveTextContent('Proposer un autre titre');
      await waitFor(() => expect(titleInput()).toHaveFocus());
    });

    it('shows the wait in the title field and below it, without the button', async () => {
      let resolve: (value: unknown) => void = () => undefined;
      mockSuggestTitle.mockReturnValue(
        new Promise((res) => {
          resolve = res;
        })
      );
      renderPage();
      openComposer();
      typeMessage(longMessage);
      requestTitle();
      expect(titleInput().placeholder).toBe('Proposition d’un titre…');
      expect(screen.getByText('Proposition d’un titre…')).toBeInTheDocument();
      expect(requestButton()).not.toBeInTheDocument();
      await act(async () => {
        resolve({ data: { title: 'Titre proposé' } });
      });
      expect(titleInput().value).toBe('Titre proposé');
      expect(screen.queryByText('Proposition d’un titre…')).toBeNull();
    });

    it('replaces a title the member wrote, then a retouched proposal, on request', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      typeTitle('Mon propre titre');
      requestTitle();
      await waitFor(() =>
        expect(titleInput().value).toBe(
          'Comment expliquer deux ans sans emploi ?'
        )
      );
      expect(
        screen.getByTestId('discussion-composer-suggested-title')
      ).toBeInTheDocument();

      typeTitle('Mon titre retouché');
      expect(
        screen.queryByTestId('discussion-composer-suggested-title')
      ).not.toBeInTheDocument();
      mockSuggestTitle.mockResolvedValue({ data: { title: 'Nouveau titre' } });
      requestTitle();
      await waitFor(() => expect(titleInput().value).toBe('Nouveau titre'));
    });

    it('never changes the title when the message is rewritten', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      requestTitle();
      await waitFor(() => expect(titleInput().value).not.toBe(''));
      typeMessage(`${longMessage} Encore.`);
      blurMessage();
      await act(async () => undefined);
      expect(mockSuggestTitle).toHaveBeenCalledTimes(1);
      expect(titleInput().value).toBe(
        'Comment expliquer deux ans sans emploi ?'
      );
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
      requestTitle();
      typeTitle('Mon titre');
      await act(async () => {
        resolve({ data: { title: 'Titre proposé' } });
      });
      expect(titleInput().value).toBe('Mon titre');
      expect(screen.queryByText(FAILED_MESSAGE)).toBeNull();
    });

    it('proposes another title, different from the previous ones, 5 times at most', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      requestTitle();
      await waitFor(() => expect(titleInput().value).not.toBe(''));
      for (let index = 1; index <= 5; index += 1) {
        mockSuggestTitle.mockResolvedValueOnce({
          data: { title: `Titre ${index}` },
        });
        requestTitle();
        await waitFor(() => expect(titleInput().value).toBe(`Titre ${index}`));
      }
      expect(mockSuggestTitle).toHaveBeenCalledTimes(6);
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
      expect(requestButton()).not.toBeInTheDocument();
      expect(titleInput()).not.toBeDisabled();
    });

    it('after a failure: a discreet message, the title untouched, no more proposal even when the message changes', async () => {
      mockSuggestTitle.mockResolvedValue({ data: { title: null } });
      renderPage();
      openComposer();
      typeMessage(longMessage);
      requestTitle();
      expect(await screen.findByText(FAILED_MESSAGE)).toBeInTheDocument();
      expect(titleInput().value).toBe('');
      expect(titleInput().placeholder).toBe('Écrivez votre titre');
      expect(requestButton()).not.toBeInTheDocument();
      await waitFor(() => expect(titleInput()).toHaveFocus());

      typeMessage(`${longMessage} Encore une phrase.`);
      expect(screen.queryByText(FAILED_MESSAGE)).toBeNull();
      expect(requestButton()).not.toBeInTheDocument();
      expect(mockSuggestTitle).toHaveBeenCalledTimes(1);
    });

    it('clears the discreet message at the first keystroke in the title, the member can publish', async () => {
      mockSuggestTitle.mockResolvedValue({ data: { title: null } });
      renderPage();
      openComposer();
      typeMessage(longMessage);
      requestTitle();
      expect(await screen.findByText(FAILED_MESSAGE)).toBeInTheDocument();
      typeTitle('Mon titre');
      expect(screen.queryByText(FAILED_MESSAGE)).toBeNull();
      expect(requestButton()).not.toBeInTheDocument();
      fireEvent.click(screen.getByTestId('discussion-composer-publish'));
      await waitFor(() =>
        expect(mockCreateDiscussion).toHaveBeenCalledWith({
          slug: 'refaire-un-cv',
          dto: {
            title: 'Mon titre',
            content: longMessage,
            titleSource: 'MANUAL',
          },
        })
      );
    });

    it('treats a refused request (quota exceeded, error) as a failure', async () => {
      mockSuggestTitle.mockResolvedValue({ error: 'TOO_MANY_REQUESTS' });
      renderPage();
      openComposer();
      typeMessage(longMessage);
      requestTitle();
      expect(await screen.findByText(FAILED_MESSAGE)).toBeInTheDocument();
      expect(titleInput().value).toBe('');
      expect(requestButton()).not.toBeInTheDocument();
    });

    it('offers the proposal again on a new writing, after « Annuler »', async () => {
      mockSuggestTitle.mockResolvedValue({ data: { title: null } });
      renderPage();
      openComposer();
      typeMessage(longMessage);
      requestTitle();
      expect(await screen.findByText(FAILED_MESSAGE)).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('discussion-composer-cancel'));
      expect(screen.queryByText(FAILED_MESSAGE)).toBeNull();

      openComposer();
      typeMessage(longMessage);
      expect(requestButton()).toHaveTextContent("Proposer un titre avec l'IA");
    });

    it('keeps the proposals history with the draft: retries still counted, a draft saved before still readable', async () => {
      localStorage.setItem(
        'help-groups:draft:viewer-1:group:group-1',
        JSON.stringify({
          content: longMessage,
          title: 'Titre 5',
          titleOrigin: 'suggested',
          suggestionHistory: {
            previousTitles: ['T0', 'T1', 'T2', 'T3', 'T4', 'Titre 5'],
            retriesCount: 5,
            // Field of the drafts saved before the proposals became explicit
            lastSuggestedContent: longMessage,
          },
        })
      );
      renderPage();
      expect(mockSuggestTitle).not.toHaveBeenCalled();
      expect(titleInput().value).toBe('Titre 5');
      expect(requestButton()).not.toBeInTheDocument();
    });

    it('puts the request button on the right of the title label and the mention under the field', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      const label = document.querySelector(
        'label[for="discussion-composer-title"]'
      );
      const button = screen.getByTestId('discussion-composer-request-title');
      expect(button.parentElement).toBe(label?.parentElement);
      requestTitle();
      const mention = await screen.findByTestId(
        'discussion-composer-suggested-title'
      );
      // The mention comes after the field, in the live region
      expect(
        titleInput().compareDocumentPosition(mention) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      expect(mention.parentElement).toHaveAttribute('role', 'status');
      expect(screen.queryByText('Écrire le mien')).not.toBeInTheDocument();
    });

    it('publishes exactly the displayed title with its source', async () => {
      renderPage();
      openComposer();
      typeMessage(longMessage);
      requestTitle();
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
