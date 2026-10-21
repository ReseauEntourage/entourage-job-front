jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsMobile: jest.fn(),
}));
jest.mock('../MessagingShareNetwork/MessagingShareNetwork', () => ({
  MessagingShareNetwork: ({ profileId, firstName }: any) => (
    <div data-testid="share-network">
      {profileId}:{firstName}
    </div>
  ),
}));

import { cleanup, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ConversationType } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { useIsMobile } from '@/src/hooks/utils';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { messagingActions, messagingApi } from '@/src/use-cases/messaging';
import { ActionList } from './ActionList';

const mockUseIsMobile = useIsMobile as jest.Mock;

function setup({
  role,
  addresseeRole,
  type = ConversationType.DIRECT,
}: {
  role: UserRoles;
  addresseeRole: UserRoles;
  type?: ConversationType;
}) {
  const store = createTestStore();
  store.dispatch(
    currentUserActions.fetchUserSucceeded({ id: 'me', role } as any)
  );
  store.dispatch(messagingActions.selectConversation('conv1'));
  store.dispatch(
    messagingApi.util.upsertQueryData('getSelectedConversation', 'conv1', {
      id: 'conv1',
      type,
      messages: [],
      participants: [
        { id: 'me', role, firstName: 'Moi' },
        { id: 'other', role: addresseeRole, firstName: 'Awa' },
      ],
    } as any) as any
  );
  return { ...renderWithProviders(<ActionList />, { store }), store };
}

describe('ActionList', () => {
  beforeEach(() => {
    mockUseIsMobile.mockReturnValue(false);
  });
  afterEach(() => cleanup());

  it('offers both profile sharing and the AI assistant to a coach talking to a candidate', async () => {
    setup({ role: UserRoles.COACH, addresseeRole: UserRoles.CANDIDATE });
    expect(await screen.findByTestId('share-network')).toHaveTextContent(
      'other:Awa'
    );
    expect(screen.getByText(/Assistant/)).toHaveTextContent('Assistant Coach');
  });

  it('shortens the assistant label on mobile', async () => {
    mockUseIsMobile.mockReturnValue(true);
    setup({ role: UserRoles.COACH, addresseeRole: UserRoles.COACH });
    expect(
      (await screen.findByTestId('messaging-ai-assistant-toggle')).textContent
    ).not.toContain('Coach');
  });

  it('only offers profile sharing to a candidate', async () => {
    setup({ role: UserRoles.CANDIDATE, addresseeRole: UserRoles.CANDIDATE });
    expect(await screen.findByTestId('share-network')).toBeInTheDocument();
    expect(screen.queryByTestId('messaging-ai-assistant-toggle')).toBeNull();
  });

  it('does not offer profile sharing in group conversations or for non candidate addressees', async () => {
    setup({
      role: UserRoles.COACH,
      addresseeRole: UserRoles.CANDIDATE,
      type: ConversationType.GROUP,
    });
    expect(
      await screen.findByTestId('messaging-ai-assistant-toggle')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('share-network')).toBeNull();
    cleanup();
    setup({ role: UserRoles.COACH, addresseeRole: UserRoles.COACH });
    expect(screen.queryByTestId('share-network')).toBeNull();
  });

  it('renders nothing when there is nothing to offer', () => {
    const { container } = setup({
      role: UserRoles.CANDIDATE,
      addresseeRole: UserRoles.COACH,
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('opens the AI panel, then closes it on a second click', async () => {
    const { store } = setup({
      role: UserRoles.COACH,
      addresseeRole: UserRoles.CANDIDATE,
    });
    const toggle = await screen.findByTestId('messaging-ai-assistant-toggle');
    expect(store.getState().messaging.isAIPanelOpen).toBe(false);
    fireEvent.click(toggle);
    expect(store.getState().messaging.isAIPanelOpen).toBe(true);
    expect(store.getState().messaging.activePanelView).toBe('ai');
    fireEvent.click(toggle);
    expect(store.getState().messaging.isAIPanelOpen).toBe(false);
  });
});
