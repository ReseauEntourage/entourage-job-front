import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { DashboardAlertWhatsapp } from './DashboardAlertWhatsapp';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({}),
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));

const mockUser = useAuthenticatedUser as jest.Mock;

describe('DashboardAlertWhatsapp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('invites a coach to talk with the coaches of their region', () => {
    mockUser.mockReturnValue({ role: UserRoles.COACH });
    render(<DashboardAlertWhatsapp />);
    expect(
      screen.getByText(/échanger avec les coachs de votre région/)
    ).toBeInTheDocument();
  });

  it('invites a candidate to talk with the candidates of their region', () => {
    mockUser.mockReturnValue({ role: UserRoles.CANDIDATE });
    render(<DashboardAlertWhatsapp />);
    expect(
      screen.getByText(/échanger avec les candidats de votre région/)
    ).toBeInTheDocument();
  });

  it('opens the join modal from the CTA', () => {
    mockUser.mockReturnValue({ role: UserRoles.CANDIDATE });
    render(<DashboardAlertWhatsapp />);
    fireEvent.click(screen.getByText('Rejoindre le groupe Whatsapp'));
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('hides the alert once closed', () => {
    mockUser.mockReturnValue({ role: UserRoles.CANDIDATE });
    render(<DashboardAlertWhatsapp />);
    const cta = screen.getByText('Rejoindre le groupe Whatsapp');
    expect(cta).toBeVisible();
    // The close button is the only icon button of the alert
    const closeButton = screen
      .getAllByRole('button')
      .find((button) => button !== cta.closest('button')) as HTMLElement;
    fireEvent.click(closeButton);
    expect(cta).not.toBeVisible();
  });
});
