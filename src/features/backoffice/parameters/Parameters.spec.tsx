import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { selectNotifications } from '@/src/use-cases/notifications';
import { Parameters } from './Parameters';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: () => ({}),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfileComplete', () => ({
  useCurrentUserProfileComplete: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserAchievements', () => ({
  useCurrentUserAchievements: () => undefined,
}));
jest.mock('@/src/hooks/current-user/useCurrentUserStats', () => ({
  useCurrentUserStats: () => undefined,
}));
jest.mock('./useConfirmationToaster', () => ({
  useConfirmationToaster: jest.fn(),
}));
jest.mock('./AlertAI/AlertAI', () => ({
  AlertIA: () => <div data-testid="part">alert-ai</div>,
}));
jest.mock('../LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading" />,
}));
jest.mock('@/src/features/headers/HeaderProfile/HeaderProfile', () => ({
  HeaderProfile: ({ id, isAvailable }: any) => (
    <div data-testid="header">{`${id}|${isAvailable}`}</div>
  ),
}));

function mockStub(name: string) {
  return () => <div data-testid="part">{name}</div>;
}
jest.mock(
  '@/src/features/profile/ProfilePartCards/ParamProfessionalInformations/ParamProfessionalInformations',
  () => ({ ParamProfessionalInformations: mockStub('professional') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileChangePassword/ProfileChangePassword',
  () => ({ ProfileChangePassword: mockStub('password') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileContactPreferences/ProfileContactPreferences',
  () => ({ ProfileContactPreferences: mockStub('contact-preferences') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileContracts/ProfileContracts',
  () => ({ ProfileContracts: mockStub('contracts') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileCustomNudges/ProfileCustomNudges',
  () => ({ ProfileCustomNudges: mockStub('custom-nudges') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileDescription/ProfileDescription',
  () => ({ ProfileDescription: mockStub('description') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileDocuments/ProfileDocuments',
  () => ({ ProfileDocuments: mockStub('documents') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileExperiences/ProfileExperiences',
  () => ({ ProfileExperiences: mockStub('experiences') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileFormations/ProfileFormations',
  () => ({ ProfileFormations: mockStub('formations') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileInterests/ProfileInterests',
  () => ({ ProfileInterests: mockStub('interests') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileLanguages/ProfileLanguages',
  () => ({ ProfileLanguages: mockStub('languages') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileNotificationsPreferences/ProfileNotificationsPreferences',
  () => ({ ProfileNotificationsPreferences: mockStub('notifications') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileNudges/ProfileNudges',
  () => ({ ProfileNudges: mockStub('nudges') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileSkills/ProfileSkills',
  () => ({ ProfileSkills: mockStub('skills') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileDeleteAccount/ProfileDeleteAccount',
  () => ({ ProfileDeleteAccount: mockStub('delete-account') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileLinkedInConnect/ProfileLinkedInConnect',
  () => ({ ProfileLinkedInConnect: mockStub('linkedin') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/UserProfileAvailabilityCard',
  () => ({ UserProfileAvailabilityCard: mockStub('availability') })
);

const replace = jest.fn();

const setup = (
  query: Record<string, string> = {},
  role = UserRoles.CANDIDATE,
  complete: unknown = { unavailableAt: null }
) => {
  (useRouter as jest.Mock).mockReturnValue({ query, replace });
  (useAuthenticatedUser as jest.Mock).mockReturnValue({
    id: 'u1',
    firstName: 'Jane',
    role,
  });
  (useCurrentUserProfileComplete as jest.Mock).mockReturnValue(complete);
  const store = createTestStore();
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  return { dispatchSpy, ...renderWithProviders(<Parameters />, { store }) };
};

describe('Parameters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading screen until the complete profile is available', () => {
    setup({}, UserRoles.CANDIDATE, null);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
  });

  it('renders the editable profile cards for a candidate, including contracts', () => {
    setup();

    const parts = screen.getAllByTestId('part').map((el) => el.textContent);
    expect(parts).toEqual(
      expect.arrayContaining([
        'contracts',
        'professional',
        'password',
        'delete-account',
      ])
    );
    expect(screen.getByTestId('header')).toHaveTextContent('u1|true');
  });

  it('hides the contracts card for non-candidates', () => {
    setup({}, UserRoles.COACH);

    const parts = screen.getAllByTestId('part').map((el) => el.textContent);
    expect(parts).not.toContain('contracts');
  });

  it('marks the header as unavailable when the profile has an unavailableAt', () => {
    setup({}, UserRoles.COACH, { unavailableAt: '2026-01-01' });

    expect(screen.getByTestId('header')).toHaveTextContent('u1|false');
  });

  it('does nothing special without linkedin or reactivate query params', () => {
    const { dispatchSpy } = setup();

    expect(replace).not.toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('makes the profile available again and cleans the URL on reactivate=true', () => {
    const { dispatchSpy, store } = setup({ reactivate: 'true' });

    expect(dispatchSpy).toHaveBeenCalledWith(
      currentUserActions.updateProfileRequested({
        userId: 'u1',
        userProfile: { unavailableAt: null, unavailabilityReason: null },
      })
    );
    expect(selectNotifications(store.getState())[0]).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Votre profil est de nouveau disponible !',
      })
    );
    expect(replace).toHaveBeenCalledWith('/backoffice/parametres', undefined, {
      shallow: true,
    });
  });

  it('refreshes the user and notifies success on linkedin=connected', () => {
    const { dispatchSpy, store } = setup({ linkedin: 'connected' });

    expect(dispatchSpy).toHaveBeenCalledWith(
      currentUserActions.fetchUserRequested()
    );
    expect(selectNotifications(store.getState())[0]).toEqual(
      expect.objectContaining({
        type: 'success',
        message: 'Compte LinkedIn lié avec succès !',
      })
    );
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it('notifies an error on linkedin=error', () => {
    const { store } = setup({ linkedin: 'error' });

    expect(selectNotifications(store.getState())[0]).toEqual(
      expect.objectContaining({ type: 'danger' })
    );
    expect(replace).toHaveBeenCalledTimes(1);
  });

  it('ignores unknown linkedin values but still cleans the URL', () => {
    const { store } = setup({ linkedin: 'whatever' });

    expect(selectNotifications(store.getState())).toEqual([]);
    expect(replace).toHaveBeenCalledTimes(1);
  });
});
