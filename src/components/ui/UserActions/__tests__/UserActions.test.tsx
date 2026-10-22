import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { UserActions } from '../UserActions';

const mockOpenCorrespondingModal = jest.fn();
const mockCurrentUserId = jest.fn();
jest.mock('@/src/features/headers/HeaderProfile/useHeaderProfile', () => ({
  useHeaderProfile: () => ({
    openCorrespondingModal: mockOpenCorrespondingModal,
  }),
}));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock(
  '@/src/features/backoffice/profile/ProfileReportUserModal/ProfileReportUserModal',
  () => ({ ProfileReportUserModal: () => null })
);
jest.mock('@/src/use-cases/current-user', () => ({
  ...jest.requireActual('@/src/use-cases/current-user'),
  selectCurrentUserId: () => mockCurrentUserId(),
}));

const renderActions = () =>
  renderWithProviders(
    <UserActions userId="u1" userRole={UserRoles.CANDIDATE} />
  );

describe('UserActions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lets users edit their own profile', () => {
    mockCurrentUserId.mockReturnValue('u1');
    renderActions();
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Éditer mes informations'));
    expect(mockOpenCorrespondingModal).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Signaler ce profil')).not.toBeInTheDocument();
  });

  it("lets users report someone else's profile", () => {
    mockCurrentUserId.mockReturnValue('other');
    renderActions();
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Signaler ce profil'));
    expect(openModal).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByText('Éditer mes informations')
    ).not.toBeInTheDocument();
  });
});
