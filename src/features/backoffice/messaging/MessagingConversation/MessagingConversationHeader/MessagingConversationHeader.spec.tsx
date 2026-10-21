jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsMobile: jest.fn(),
  useIsDesktop: jest.fn(),
}));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock('./ActionList/ActionList', () => ({
  ActionList: () => <div data-testid="action-list" />,
}));
jest.mock(
  '../MessagingConversationReport/MessagingConversationReportModal',
  () => ({
    MessagingConversationReportModal: ({ conversationId }: any) => (
      <div data-testid="report-modal">{conversationId}</div>
    ),
  })
);

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { ConversationType } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { useIsDesktop, useIsMobile } from '@/src/hooks/utils';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { messagingActions, messagingApi } from '@/src/use-cases/messaging';
import { MessagingConversationHeader } from './MessagingConversationHeader';

const mockedApi = getMockedApi();
const push = jest.fn();

function setup({
  role = UserRoles.COACH,
  selected = 'conv1' as string | null,
  addressee = {},
  archivedAt = null as string | null,
}: {
  role?: UserRoles;
  selected?: string | null;
  addressee?: any;
  archivedAt?: string | null;
} = {}) {
  const store = createTestStore();
  store.dispatch(
    currentUserActions.fetchUserSucceeded({ id: 'me', role } as any)
  );
  store.dispatch(messagingActions.selectConversation(selected));
  if (selected) {
    store.dispatch(
      messagingApi.util.upsertQueryData('getSelectedConversation', selected, {
        id: selected,
        type: ConversationType.DIRECT,
        messages: [],
        archivedAt,
        participants: [
          { id: 'me', role, firstName: 'Moi', lastName: 'Même' },
          {
            id: 'other',
            role: UserRoles.CANDIDATE,
            firstName: 'Awa',
            lastName: 'Diop',
            elearningCompletedAt: '2026-01-01',
            userProfile: { hasPicture: false },
            ...addressee,
          },
        ],
      } as any) as any
    );
  }
  return {
    ...renderWithProviders(<MessagingConversationHeader />, { store }),
    store,
  };
}

describe('MessagingConversationHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useIsMobile as jest.Mock).mockReturnValue(false);
    (useIsDesktop as jest.Mock).mockReturnValue(true);
    mockedApi.archiveConversation.mockResolvedValue({} as any);
    mockedApi.unarchiveConversation.mockResolvedValue({} as any);
  });
  afterEach(() => cleanup());

  it('shows the name and role of the addressee, and the action list on desktop', async () => {
    setup();
    expect(await screen.findByText('Awa Diop')).toBeInTheDocument();
    expect(screen.getByText(UserRoles.CANDIDATE)).toBeInTheDocument();
    expect(screen.getAllByTestId('action-list')).toHaveLength(1);
    expect(screen.queryByText('EyeOff')).toBeNull();
  });

  it('renders nothing about an addressee and no menu without conversation', () => {
    setup({ selected: null });
    expect(screen.queryByText('Awa Diop')).toBeNull();
    expect(
      screen.queryByTestId('messaging-conversation-actions-button')
    ).toBeNull();
  });

  it('opens the profile of the addressee when clicking on their name', async () => {
    setup();
    fireEvent.click(await screen.findByText('Awa Diop'));
    expect(push).toHaveBeenCalledWith('/backoffice/profile/other');
  });

  it('shows the back button on mobile and goes back to the list', async () => {
    (useIsMobile as jest.Mock).mockReturnValue(true);
    (useIsDesktop as jest.Mock).mockReturnValue(false);
    const { store, container } = setup();
    await screen.findByText('Awa Diop');
    // the action list moves below the main infos on mobile
    expect(screen.getAllByTestId('action-list')).toHaveLength(1);
    const backButton = container.querySelector('button') as HTMLElement;
    fireEvent.click(backButton);
    expect(store.getState().messaging.selectedConversationId).toBeNull();
  });

  it('flags to admins that the addressee has not finished the e-learning', async () => {
    setup({
      role: UserRoles.ADMIN,
      addressee: { elearningCompletedAt: null },
    });
    await screen.findByText('Awa Diop');
    expect(
      screen.getByLabelText(
        'Formation non terminée - visible uniquement par les administrateurs.'
      )
    ).toBeInTheDocument();
  });

  it('does not flag the e-learning to other roles or when completed', async () => {
    setup({ addressee: { elearningCompletedAt: null } });
    await screen.findByText('Awa Diop');
    expect(screen.queryByLabelText(/Formation non terminée/)).toBeNull();
    cleanup();
    setup({ role: UserRoles.ADMIN });
    await screen.findByText('Awa Diop');
    expect(screen.queryByLabelText(/Formation non terminée/)).toBeNull();
  });

  describe('actions menu', () => {
    const openMenu = async () => {
      fireEvent.click(
        await screen.findByTestId('messaging-conversation-actions-button')
      );
    };

    it('archives the conversation', async () => {
      setup();
      await openMenu();
      fireEvent.click(screen.getByTestId('messaging-archive-button'));
      await act(async () => {
        await flushPromises();
      });
      expect(mockedApi.archiveConversation).toHaveBeenCalledWith('conv1');
      expect(mockedApi.unarchiveConversation).not.toHaveBeenCalled();
    });

    it('unarchives an archived conversation', async () => {
      setup({ archivedAt: '2026-01-01' });
      await openMenu();
      expect(screen.getByText('Désarchiver')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('messaging-unarchive-button'));
      await act(async () => {
        await flushPromises();
      });
      expect(mockedApi.unarchiveConversation).toHaveBeenCalledWith('conv1');
      expect(mockedApi.archiveConversation).not.toHaveBeenCalled();
    });

    it('opens the report modal for the conversation', async () => {
      setup();
      await openMenu();
      fireEvent.click(screen.getByTestId('messaging-report-button'));
      expect(openModal).toHaveBeenCalledTimes(1);
      const modal = (openModal as jest.Mock).mock.calls[0][0];
      expect(modal.props.conversationId).toBe('conv1');
    });
  });
});
