import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { DashboardJoinWhatsappModal } from './DashboardJoinWhatsappModal';

jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
const mockOnClose = jest.fn();
jest.mock('@/src/features/modals/Modal', () => ({
  useModalContext: () => ({ onClose: mockOnClose }),
}));
jest.mock('@/src/features/modals/Modal/ModalGeneric', () => ({
  ModalGeneric: ({ title, children }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/components/ui/Skeleton/Skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

describe('DashboardJoinWhatsappModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.spyOn(console, 'error').mockImplementation();
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.COACH,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const loaded = async () => {
    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
  };

  it('shows a skeleton while loading, then the QR code of the zone group', async () => {
    (Api.getCurrentWhatsappZone as jest.Mock).mockResolvedValue({
      data: {
        name: 'Paris',
        qr: '/qr.png',
        url: 'https://chat.whatsapp.com/x',
      },
    });
    render(<DashboardJoinWhatsappModal />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.getByText('Chargement...')).toBeInTheDocument();

    await loaded();

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    expect(screen.getByAltText('QR code Whatsapp')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(
      screen.getByAltText('QR code Whatsapp').closest('a')
    ).toHaveAttribute('href', 'https://chat.whatsapp.com/x');
  });

  it('speaks of coachs to a coach and of candidats to a candidate', async () => {
    (Api.getCurrentWhatsappZone as jest.Mock).mockResolvedValue({ data: null });
    const { unmount } = render(<DashboardJoinWhatsappModal />);
    expect(
      screen.getByText(/avec les coachs de votre région/)
    ).toBeInTheDocument();
    unmount();

    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.CANDIDATE,
    });
    render(<DashboardJoinWhatsappModal />);
    expect(
      screen.getByText(/avec les candidats de votre région/)
    ).toBeInTheDocument();
  });

  it('shows no QR code when the zone cannot be fetched', async () => {
    (Api.getCurrentWhatsappZone as jest.Mock).mockRejectedValue(new Error('x'));
    render(<DashboardJoinWhatsappModal />);
    await loaded();

    expect(screen.queryByAltText('QR code Whatsapp')).not.toBeInTheDocument();
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
  });

  it('closes through the Fermer button', async () => {
    (Api.getCurrentWhatsappZone as jest.Mock).mockResolvedValue({ data: null });
    render(<DashboardJoinWhatsappModal />);
    fireEvent.click(screen.getByText('Fermer'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
