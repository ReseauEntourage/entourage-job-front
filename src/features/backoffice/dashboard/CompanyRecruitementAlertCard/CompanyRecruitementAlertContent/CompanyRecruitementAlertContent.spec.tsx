import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { RecruitementAlert } from '@/src/api/types';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { CompanyRecruitementAlertContent } from './CompanyRecruitementAlertContent';

jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock(
  '../CompanyRecruitementAlertModal/CompanyRecruitementAlertEditModal',
  () => ({
    CompanyRecruitementAlertEditModal: ({ isOpen }: { isOpen: boolean }) =>
      isOpen ? <div>edit-modal-open</div> : null,
  })
);

const alert = {
  id: 'alert-1',
  name: 'Vendeur',
  jobName: 'Vendeur polyvalent',
  department: 'Paris (75)',
  workingExperienceYears: null,
  contractType: 'cdi',
  companyId: 'c1',
  businessSectors: [],
  skills: [],
  createdAt: '',
  updatedAt: '',
} as unknown as RecruitementAlert;

const candidates = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `p${i}`,
    firstName: 'C',
    lastName: `${i}`,
    hasPicture: false,
  }));

const matching = (count: number) =>
  (Api.getRecruitementAlertMatching as jest.Mock).mockResolvedValue({
    data: candidates(count),
  });

describe('CompanyRecruitementAlertContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the title, the criteria badges and a message when nobody matches', async () => {
    matching(0);
    renderWithProviders(<CompanyRecruitementAlertContent alert={alert} />);
    expect(screen.getByText('Vendeur - CDI')).toBeInTheDocument();
    expect(screen.getByText('Vendeur polyvalent')).toBeInTheDocument();
    expect(screen.getByText('Paris (75)')).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByText('Aucun candidat ne correspond à votre recherche.')
      ).toBeInTheDocument()
    );
    expect(screen.queryByText('Voir les candidats')).toBeNull();
  });

  it('counts a single matching candidate in the singular', async () => {
    matching(1);
    renderWithProviders(<CompanyRecruitementAlertContent alert={alert} />);
    await waitFor(() =>
      expect(
        screen.getByText('1 candidat correspond à votre recherche.')
      ).toBeInTheDocument()
    );
  });

  it('counts several candidates in the plural, with the overflow beyond four avatars', async () => {
    matching(6);
    renderWithProviders(<CompanyRecruitementAlertContent alert={alert} />);
    await waitFor(() =>
      expect(
        screen.getByText('6 candidats correspondent à votre recherche.')
      ).toBeInTheDocument()
    );
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Voir les candidats' })
    ).toHaveAttribute('href', '/backoffice/alerte-candidats/alert-1');
  });

  it('shows no overflow with four candidates or fewer', async () => {
    matching(4);
    renderWithProviders(<CompanyRecruitementAlertContent alert={alert} />);
    await waitFor(() =>
      expect(screen.getByText(/4 candidats correspondent/)).toBeInTheDocument()
    );
    expect(screen.queryByText(/^\+\d/)).toBeNull();
  });

  it('opens the edit modal and deletes the alert from the header buttons', async () => {
    matching(0);
    (Api.deleteRecruitementAlert as jest.Mock).mockResolvedValue({});
    renderWithProviders(<CompanyRecruitementAlertContent alert={alert} />);
    const [editButton, deleteButton] = screen.getAllByRole('button');
    fireEvent.click(editButton);
    expect(screen.getByText('edit-modal-open')).toBeInTheDocument();
    fireEvent.click(deleteButton);
    await waitFor(() =>
      expect(Api.deleteRecruitementAlert).toHaveBeenCalledWith('alert-1')
    );
  });
});
