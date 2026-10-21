import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { openModal } from '@/src/features/modals/Modal';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { CompanyRecruitementAlertCard } from './CompanyRecruitementAlertCard';

jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({}),
}));
jest.mock('./CompanyRecruitementAlertModal', () => ({
  CompanyRecruitementAlertModal: () => null,
}));
jest.mock('./CompanyRecruitementAlertContent', () => ({
  CompanyRecruitementAlertContent: ({ alert }: any) => (
    <div data-testid="alert">{alert.name}</div>
  ),
}));

const alert = (id: string) => ({ id, name: `Alert ${id}` }) as any;

describe('CompanyRecruitementAlertCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('presents the feature and opens the creation modal when there is no alert', async () => {
    (Api.getRecruitementAlerts as jest.Mock).mockResolvedValue({ data: [] });
    renderWithProviders(<CompanyRecruitementAlertCard />);
    await waitFor(() =>
      expect(
        screen.getByText('Vous avez des besoins de recrutement ?')
      ).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText('Créer une alerte mail'));
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('fetches the alerts and lists them', async () => {
    (Api.getRecruitementAlerts as jest.Mock).mockResolvedValue({
      data: [alert('1'), alert('2')],
    });
    renderWithProviders(<CompanyRecruitementAlertCard />);
    await waitFor(() => expect(screen.getAllByTestId('alert')).toHaveLength(2));
    expect(screen.getByText('Vos alertes de recrutement')).toBeInTheDocument();
    expect(Api.getRecruitementAlerts).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Créer une alerte mail'));
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('does not refetch alerts already in the store', () => {
    const base = createTestStore().getState().recruitementAlerts;
    const store = createTestStore({
      recruitementAlerts: { ...base, recruitementAlerts: [alert('1')] },
    });
    renderWithProviders(<CompanyRecruitementAlertCard />, { store });
    expect(screen.getAllByTestId('alert')).toHaveLength(1);
    expect(Api.getRecruitementAlerts).not.toHaveBeenCalled();
  });

  it('shows a spinner while the alerts load', async () => {
    (Api.getRecruitementAlerts as jest.Mock).mockReturnValue(
      new Promise(() => {})
    );
    renderWithProviders(<CompanyRecruitementAlertCard />);
    await waitFor(() =>
      expect(screen.getByText('Vos alertes de recrutement')).toBeInTheDocument()
    );
    expect(screen.queryByText('Créer une alerte mail')).toBeNull();
    expect(
      screen.queryByText('Vous avez des besoins de recrutement ?')
    ).toBeNull();
  });
});
