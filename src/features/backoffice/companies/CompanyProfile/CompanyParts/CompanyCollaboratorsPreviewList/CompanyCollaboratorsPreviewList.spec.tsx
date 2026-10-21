import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { Api } from '@/src/api';
import { openModal } from '@/src/features/modals/Modal';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { CompanyCollaboratorsPreviewList } from './CompanyCollaboratorsPreviewList';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
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
jest.mock('swiper/react', () => ({
  Swiper: ({ children }: any) => <div>{children}</div>,
  SwiperSlide: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('swiper/css', () => ({}));
jest.mock('swiper/css/navigation', () => ({}));
jest.mock('swiper/css/pagination', () => ({}));
jest.mock('swiper/modules', () => ({ Navigation: {}, Pagination: {} }));
jest.mock('@/src/components/ui/Cards/EntityCards/ProfileCard', () => ({
  ProfileCard: ({ firstName }: { firstName: string }) => (
    <div data-testid="profile-card">{firstName}</div>
  ),
}));

const push = jest.fn();

describe('CompanyCollaboratorsPreviewList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it('shows an editor the invitation fallback when there is no collaborator', async () => {
    (
      Api.getCompanyByIdWithUsersAndPendingInvitations as jest.Mock
    ).mockResolvedValue({ data: { users: [] } });
    renderWithProviders(
      <CompanyCollaboratorsPreviewList companyId="c1" isEditable />
    );
    await waitFor(() =>
      expect(
        screen.getByText(/Vous n’avez pas encore de collaborateurs/)
      ).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText('Inviter des collaborateurs'));
    expect(openModal).toHaveBeenCalledTimes(1);
    expect(
      Api.getCompanyByIdWithUsersAndPendingInvitations
    ).toHaveBeenCalledWith('c1');
  });

  it('shows visitors a neutral fallback, without call to action', async () => {
    (
      Api.getCompanyByIdWithUsersAndPendingInvitations as jest.Mock
    ).mockResolvedValue({ data: { users: [] } });
    renderWithProviders(<CompanyCollaboratorsPreviewList companyId="c1" />);
    await waitFor(() =>
      expect(
        screen.getByText(/Cette entreprise n’a pas encore de collaborateurs/)
      ).toBeInTheDocument()
    );
    expect(screen.queryByText('Inviter des collaborateurs')).toBeNull();
  });

  it('lists the collaborators and lets an editor open the full list', async () => {
    (
      Api.getCompanyByIdWithUsersAndPendingInvitations as jest.Mock
    ).mockResolvedValue({
      data: {
        users: [
          { id: 'u1', firstName: 'Jeanne', userProfile: null },
          { id: 'u2', firstName: 'Paul', userProfile: { hasPicture: true } },
        ],
      },
    });
    renderWithProviders(
      <CompanyCollaboratorsPreviewList companyId="c1" isEditable />
    );
    await waitFor(() =>
      expect(screen.getAllByTestId('profile-card')).toHaveLength(2)
    );
    fireEvent.click(screen.getByText('Voir tous les collaborateurs'));
    expect(push).toHaveBeenCalledWith('/backoffice/companies/c1/collaborators');
    expect(openModal).not.toHaveBeenCalled();
  });

  it('notifies the user when the collaborators cannot be fetched', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (
      Api.getCompanyByIdWithUsersAndPendingInvitations as jest.Mock
    ).mockRejectedValue(new Error('x'));
    const { store } = renderWithProviders(
      <CompanyCollaboratorsPreviewList companyId="c1" />
    );
    await waitFor(() =>
      expect(store.getState().notifications.notifications).toHaveLength(1)
    );
    expect(store.getState().notifications.notifications[0].message).toContain(
      'récupération des collaborateurs'
    );
  });
});
