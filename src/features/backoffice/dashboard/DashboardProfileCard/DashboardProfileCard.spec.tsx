import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserAchievements } from '@/src/hooks/current-user/useCurrentUserAchievements';
import { useCurrentUserOrganization } from '@/src/hooks/current-user/useCurrentUserOrganization';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useCurrentUserExternalCv } from '@/src/hooks/useCurrentUserExternalCv';
import {
  createTestStore,
  TestStore,
} from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { DashboardProfileCard } from './DashboardProfileCard';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserAchievements', () => ({
  useCurrentUserAchievements: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserOrganization', () => ({
  useCurrentUserOrganization: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: jest.fn(),
}));
jest.mock('@/src/hooks/useCurrentUserExternalCv', () => ({
  useCurrentUserExternalCv: jest.fn(),
}));
jest.mock('@/src/components/ui/AvailabilityTag', () => ({
  AvailabilityTagEditable: ({ isAvailable }: { isAvailable: boolean }) => (
    <div>{isAvailable ? 'available' : 'unavailable'}</div>
  ),
}));
jest.mock(
  '@/src/features/headers/HeaderProfile/ProfileCompletion/ProfileCompletion',
  () => ({ ProfileCompletion: () => <div>completion-bar</div> })
);
jest.mock('@/src/features/profile/ProfileAchievementHighlighter', () => ({
  ProfileAchievementHighlighter: ({ achievement }: any) => (
    <div>achievement:{achievement.id}</div>
  ),
}));

const baseUser = {
  id: 'u1',
  role: UserRoles.CANDIDATE,
  firstName: 'awa',
  lastName: 'diallo',
  gender: 1,
};

const setup = (
  {
    user = baseUser,
    profile = {} as Record<string, unknown> | null,
    organization = null as any,
    achievements = [] as any[],
    externalCv = null as string | null,
    store = undefined as TestStore | undefined,
  } = {},
  preloadedCompletion?: number
) => {
  (useAuthenticatedUser as jest.Mock).mockReturnValue(user);
  (useCurrentUserProfile as jest.Mock).mockReturnValue(profile);
  (useCurrentUserOrganization as jest.Mock).mockReturnValue(organization);
  (useCurrentUserAchievements as jest.Mock).mockReturnValue(achievements);
  (useCurrentUserExternalCv as jest.Mock).mockReturnValue(externalCv);
  return renderWithProviders(<DashboardProfileCard />, {
    store,
    preloadedState:
      preloadedCompletion === undefined
        ? undefined
        : ({
            api: {
              queries: {
                'getProfileCompletion(undefined)': {
                  status: 'fulfilled',
                  endpointName: 'getProfileCompletion',
                  data: preloadedCompletion,
                  originalArgs: undefined,
                },
              },
            },
          } as any),
  });
};

describe('DashboardProfileCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a skeleton while the profile is not loaded', () => {
    setup({ profile: null });
    expect(screen.queryByTestId('dashboard-profile-card')).toBeNull();
  });

  it('shows the name with the last name initial, the organization and the department', () => {
    setup({
      profile: { department: 'Paris (75)' },
      organization: { name: 'Asso Solidaire' },
    });
    expect(screen.getByText('awa D.')).toBeInTheDocument();
    expect(screen.getByText('Asso Solidaire')).toBeInTheDocument();
    expect(screen.getByText('Paris (75)')).toBeInTheDocument();
  });

  it('reflects the availability of the user', () => {
    const { unmount } = setup({ profile: {} });
    expect(screen.getByText('available')).toBeInTheDocument();
    unmount();
    setup({ profile: { unavailableAt: '2026-01-01' } });
    expect(screen.getByText('unavailable')).toBeInTheDocument();
  });

  it('highlights the first achievement only', () => {
    setup({ achievements: [{ id: 'a1' }, { id: 'a2' }] });
    expect(screen.getByText('achievement:a1')).toBeInTheDocument();
    expect(screen.queryByText('achievement:a2')).toBeNull();
  });

  it('invites to write the presentation, pick nudges and import a CV when empty', () => {
    setup();
    expect(
      screen.getByText('Vous n’avez pas encore rédigé votre présentation')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Vous n’avez pas encore sélectionné les coups de pouces dont vous auriez besoin'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Vous n'avez pas importé de CV existant/)
    ).toBeInTheDocument();
  });

  it('words the empty nudges message for a coach', () => {
    setup({ user: { ...baseUser, role: UserRoles.COACH } });
    expect(
      screen.getByText(
        'Vous n’avez pas encore sélectionné de coups de pouces que vous souhaitez donner'
      )
    ).toBeInTheDocument();
  });

  it('shows the description once written', () => {
    setup({ profile: { description: 'Je cherche un poste de cuisinier' } });
    expect(
      screen.getByText('Je cherche un poste de cuisinier')
    ).toBeInTheDocument();
    expect(screen.queryByText(/pas encore rédigé/)).toBeNull();
  });

  it('shows at most three nudges, with the number of the others, worded for the role', () => {
    setup({
      profile: {
        nudges: [
          { value: 'tips' },
          { value: 'interview' },
          { value: 'cv' },
          { value: 'unknown-1' },
          { value: 'unknown-2' },
        ],
      },
    });
    expect(screen.getByText('Demander un conseil')).toBeInTheDocument();
    expect(screen.getByText('Préparer un entretien')).toBeInTheDocument();
    expect(screen.getByText('Créer mon CV')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('uses the coach wording of the nudges', () => {
    setup({
      user: { ...baseUser, role: UserRoles.COACH },
      profile: { nudges: [{ value: 'tips' }] },
    });
    expect(
      screen.getByText('Conseiller un(e) candidat(e)')
    ).toBeInTheDocument();
    expect(screen.queryByText(/^\+\d/)).toBeNull();
  });

  it('previews the imported CV and opens it in a new tab', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    setup({
      profile: { hasExternalCv: true },
      externalCv: 'https://cdn/cv.pdf',
    });
    expect(screen.queryByText(/pas importé de CV/)).toBeNull();
    fireEvent.click(screen.getByText('Votre CV'));
    expect(openSpy).toHaveBeenCalledWith('https://cdn/cv.pdf', '_blank');
  });

  it('does not open anything when the CV url is unknown', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    setup({ profile: { hasExternalCv: true }, externalCv: null });
    fireEvent.click(screen.getByText('Votre CV'));
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('requests the deletion of the CV through the store', () => {
    const store = createTestStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    setup({
      profile: { hasExternalCv: true },
      externalCv: 'https://cdn/cv.pdf',
      store,
    });
    fireEvent.click(
      screen.getByTestId('dashboard-profile-card-cv-preview-cv-delete')
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      currentUserActions.deleteExternalCvRequested()
    );
  });

  it('offers to complete the profile, then to edit it once complete', () => {
    const { unmount } = setup({}, 40);
    expect(screen.getByRole('link', { name: 'Compléter' })).toHaveAttribute(
      'href',
      '/backoffice/parametres'
    );
    unmount();
    setup({}, 100);
    expect(screen.getByRole('link', { name: 'Modifier' })).toHaveAttribute(
      'href',
      '/backoffice/parametres'
    );
  });
});
