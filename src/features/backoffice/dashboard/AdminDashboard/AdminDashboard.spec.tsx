import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ReduxRequestEvents } from '@/src/constants';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { AdminDashboard } from './AdminDashboard';

let mockDesktop = true;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => (mockDesktop ? 1280 : 400),
  useWindowSize: () => [mockDesktop ? 1280 : 400, 800],
}));

let mockConversations: unknown[] | null = [];
let mockStatus: string = 'SUCCEEDED';
jest.mock('@/src/use-cases/messaging', () => ({
  ...jest.requireActual('@/src/use-cases/messaging'),
  selectConversations: () => mockConversations,
  selectGetConversationsStatus: () => mockStatus,
}));

// The two shared cards are stubbed: this spec checks which cards the admin
// sees, in which order, and with which options for the profile card.
jest.mock('../DashboardProfileCard', () => ({
  DashboardProfileCard: ({
    hideNudges,
    hideExternalCv,
  }: {
    hideNudges?: boolean;
    hideExternalCv?: boolean;
  }) => (
    <div
      data-testid="stub-card"
      data-name="profile"
      data-hide-nudges={String(!!hideNudges)}
      data-hide-external-cv={String(!!hideExternalCv)}
    >
      profile
    </div>
  ),
}));
jest.mock('../DashboardMessagingConversation', () => ({
  DashboardMessagingConversation: () => (
    <div data-testid="stub-card" data-name="messages">
      messages
    </div>
  ),
}));

const getCardNames = () =>
  screen.getAllByTestId('stub-card').map((card) => card.dataset.name);

describe('AdminDashboard', () => {
  beforeEach(() => {
    mockDesktop = true;
    mockConversations = [{ id: 'c1' }];
    mockStatus = ReduxRequestEvents.SUCCEEDED;
  });

  it('shows the title of the dashboard', () => {
    renderWithProviders(<AdminDashboard />);
    expect(
      screen.getByRole('heading', {
        name: 'Bienvenue sur votre tableau de bord',
      })
    ).toBeInTheDocument();
  });

  it('shows the profile on the left and the messages on the right on desktop', () => {
    renderWithProviders(<AdminDashboard />);
    expect(getCardNames()).toEqual(['profile', 'messages']);
  });

  it('shows the messages before the profile on mobile', () => {
    mockDesktop = false;
    renderWithProviders(<AdminDashboard />);
    expect(getCardNames()).toEqual(['messages', 'profile']);
  });

  it('hides the nudges and the CV sections of the profile card', () => {
    renderWithProviders(<AdminDashboard />);
    const profile = screen
      .getAllByTestId('stub-card')
      .find((card) => card.dataset.name === 'profile');
    expect(profile).toHaveAttribute('data-hide-nudges', 'true');
    expect(profile).toHaveAttribute('data-hide-external-cv', 'true');
  });

  it('shows no other card than the profile and the messages', () => {
    renderWithProviders(<AdminDashboard />);
    expect(screen.getAllByTestId('stub-card')).toHaveLength(2);
    expect(screen.queryByText(/Guides et conseils/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Votre contact Entourage Pro/)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Whatsapp/i)).not.toBeInTheDocument();
  });

  describe('without any conversation', () => {
    beforeEach(() => {
      mockConversations = [];
    });

    it('welcomes the admin and links to the messaging, on the right', () => {
      renderWithProviders(<AdminDashboard />);
      expect(
        screen.getByText("Vous n'avez pas encore de messages")
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Accéder à la messagerie' })
      ).toHaveAttribute('href', '/backoffice/messaging');
    });

    it('keeps the profile card', () => {
      renderWithProviders(<AdminDashboard />);
      expect(getCardNames()).toContain('profile');
    });

    it('shows nothing while the conversations are loading', () => {
      mockConversations = null;
      mockStatus = ReduxRequestEvents.REQUESTED;
      renderWithProviders(<AdminDashboard />);
      expect(
        screen.queryByText("Vous n'avez pas encore de messages")
      ).not.toBeInTheDocument();
    });

    it('shows no welcome message when the conversations failed to load', () => {
      mockConversations = null;
      mockStatus = ReduxRequestEvents.FAILED;
      renderWithProviders(<AdminDashboard />);
      expect(
        screen.queryByText("Vous n'avez pas encore de messages")
      ).not.toBeInTheDocument();
    });
  });

  it('shows no welcome message when there are conversations', () => {
    renderWithProviders(<AdminDashboard />);
    expect(
      screen.queryByText("Vous n'avez pas encore de messages")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Accéder à la messagerie' })
    ).not.toBeInTheDocument();
  });
});
