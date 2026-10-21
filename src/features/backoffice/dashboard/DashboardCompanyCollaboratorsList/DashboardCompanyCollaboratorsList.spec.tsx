import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { openModal } from '@/src/features/modals/Modal';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { DashboardCompanyCollaboratorsList } from './DashboardCompanyCollaboratorsList';

jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({}),
}));
jest.mock(
  '@/src/features/modals/CompanyInviteCollaboratorsModal/CompanyInviteCollaboratorsModal',
  () => ({ CompanyInviteCollaboratorsModal: () => null })
);
jest.mock(
  '@/src/features/companies/CollaboratorSmallCard/CollaboratorSmallCard',
  () => ({
    CollaboratorSmallCard: ({ user, email }: any) => (
      <div data-testid="collab">
        {user ? user.firstName : `invited:${email}`}
      </div>
    ),
  })
);

const mockCompany = (data: unknown) =>
  (
    Api.getCompanyByIdWithUsersAndPendingInvitations as jest.Mock
  ).mockResolvedValue({ data });

const user = (id: string, isAdmin = false) => ({
  id,
  firstName: `User${id}`,
  companyUser: { isAdmin },
});

describe('DashboardCompanyCollaboratorsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('invites the referent to engage their collaborators when there is none', async () => {
    mockCompany({ users: [user('admin', true)], pendingInvitations: [] });
    renderWithProviders(<DashboardCompanyCollaboratorsList companyId="c1" />);
    await waitFor(() =>
      expect(
        screen.getByText('Vous souhaitez engager vos collaborateurs ?')
      ).toBeInTheDocument()
    );
    expect(
      Api.getCompanyByIdWithUsersAndPendingInvitations
    ).toHaveBeenCalledWith('c1');
    fireEvent.click(screen.getByText('Inviter mes collaborateurs'));
    expect(openModal).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('En savoir plus'));
    expect(openModal).toHaveBeenCalledTimes(2);
  });

  it('lists collaborators (admin excluded) then pending invitations', async () => {
    mockCompany({
      users: [user('admin', true), user('1'), user('2')],
      pendingInvitations: [{ email: 'new@acme.fr' }],
    });
    renderWithProviders(<DashboardCompanyCollaboratorsList companyId="c1" />);
    await waitFor(() =>
      expect(screen.getAllByTestId('collab')).toHaveLength(3)
    );
    expect(screen.getAllByTestId('collab').map((el) => el.textContent)).toEqual(
      ['User1', 'User2', 'invited:new@acme.fr']
    );
    expect(
      screen.getByText("Mes collaborateurs d'entreprise")
    ).toBeInTheDocument();
  });

  it('shows at most nine cards', async () => {
    mockCompany({
      users: Array.from({ length: 12 }, (_, i) => user(`${i}`)),
      pendingInvitations: [],
    });
    renderWithProviders(<DashboardCompanyCollaboratorsList companyId="c1" />);
    await waitFor(() =>
      expect(screen.getAllByTestId('collab')).toHaveLength(9)
    );
  });

  it('links to the whole list and opens the invitation modal', async () => {
    mockCompany({ users: [user('1')], pendingInvitations: [] });
    renderWithProviders(<DashboardCompanyCollaboratorsList companyId="c1" />);
    await waitFor(() =>
      expect(
        screen.getByText('Voir tous les collaborateurs')
      ).toBeInTheDocument()
    );
    expect(
      screen.getByRole('link', { name: 'Voir tous les collaborateurs' })
    ).toHaveAttribute('href', '/backoffice/companies/c1/collaborators');
    fireEvent.click(screen.getByText('Inviter des collaborateurs'));
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('notifies the user when the fetch fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (
      Api.getCompanyByIdWithUsersAndPendingInvitations as jest.Mock
    ).mockRejectedValue(new Error('x'));
    const { store } = renderWithProviders(
      <DashboardCompanyCollaboratorsList companyId="c1" />
    );
    await waitFor(() =>
      expect(store.getState().notifications.notifications).toHaveLength(1)
    );
    expect(store.getState().notifications.notifications[0]).toMatchObject({
      type: 'danger',
    });
  });
});
