jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfileComplete', () => ({
  useCurrentUserProfileComplete: jest.fn(),
}));
jest.mock('@/src/features/backoffice/useContextualRole', () => ({
  useContextualRole: jest.fn(),
}));
jest.mock(
  '@/src/features/profile/CVExperienceOrFormation/CVExperienceOrFormation',
  () => ({
    CVExperienceOrFormation: ({ title, structure, skills }: any) => (
      <div data-testid="cv-item">
        {title}|{structure}|{skills.length}
      </div>
    ),
  })
);
jest.mock('./PillsSkeleton', () => ({
  PillsSkeleton: ({ count }: any) => <div data-testid="skeleton">{count}</div>,
}));

import { cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useContextualRole } from '@/src/features/backoffice/useContextualRole';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { ProfileLivePreview } from './ProfileLivePreview';
import { ProfileLivePreviewPanel } from './ProfileLivePreviewPanel';

function setup({
  user = {
    id: 'u1',
    firstName: 'Awa',
    lastName: 'Diop',
    role: UserRoles.CANDIDATE,
  },
  profile = null,
  complete = null,
  contextualRole = 'Candidat',
}: {
  user?: any;
  profile?: any;
  complete?: any;
  contextualRole?: string;
} = {}) {
  (useAuthenticatedUser as jest.Mock).mockReturnValue(user);
  (useCurrentUserProfile as jest.Mock).mockReturnValue(profile);
  (useCurrentUserProfileComplete as jest.Mock).mockReturnValue(complete);
  (useContextualRole as jest.Mock).mockReturnValue({ contextualRole });
  return renderWithProviders(<ProfileLivePreview />);
}

const skeletonCounts = () =>
  screen.getAllByTestId('skeleton').map((s) => s.textContent);

describe('ProfileLivePreview', () => {
  afterEach(() => cleanup());

  it('shows the identity of the user and skeletons for every empty block', () => {
    setup({ profile: { department: 'Paris (75)', hasPicture: false } });
    expect(screen.getByText('Awa D.')).toBeInTheDocument();
    expect(screen.getByText('Paris (75)')).toBeInTheDocument();
    expect(screen.getByText('Candidat')).toBeInTheDocument();
    expect(screen.getByText('Présentation')).toBeInTheDocument();
    expect(skeletonCounts()).toEqual(['3', '2', '2', '1', '2', '3']);
  });

  it('shows the administrator role as is', () => {
    setup({
      user: {
        id: 'u',
        firstName: 'Ad',
        lastName: 'Min',
        role: UserRoles.ADMIN,
      },
      contextualRole: 'Coach',
    });
    expect(screen.getByText(UserRoles.ADMIN)).toBeInTheDocument();
    expect(screen.queryByText('Coach')).toBeNull();
  });

  it('handles a user without last name', () => {
    setup({ user: { id: 'u', firstName: 'Awa', role: UserRoles.COACH } });
    expect(screen.getByText('Awa .')).toBeInTheDocument();
  });

  it('shows what the profile already contains instead of the skeletons', () => {
    setup({
      complete: {
        description: 'Ma présentation',
        currentJob: 'Cuisinier',
        sectorOccupations: [
          { businessSector: { name: 'Restauration' } },
          { businessSector: { name: 'Hôtellerie' } },
        ],
        experiences: [
          { id: 'e1', title: 'Chef', company: 'Resto', skills: [{}, {}] },
          { title: 'Plongeur', company: 'Bar' },
        ],
        formations: [{ id: 'f1', title: 'CAP', institution: 'Lycée' }],
        skills: [1, 2, 3, 4, 5].map((n) => ({ name: `skill-${n}` })),
        userProfileLanguages: [1, 2, 3].map((n) => ({
          language: { name: `lang-${n}` },
        })),
        interests: [1, 2, 3, 4].map((n) => ({ name: `int-${n}` })),
        nudges: [{ id: 'n1', nameRequest: 'Aide CV' }],
      },
    });
    expect(screen.queryAllByTestId('skeleton')).toHaveLength(0);
    expect(screen.getByText('Ma présentation')).toBeInTheDocument();
    expect(screen.getByText('Cuisinier')).toBeInTheDocument();
    // only the first sector is shown
    expect(screen.getByText('Restauration')).toBeInTheDocument();
    expect(screen.queryByText('Hôtellerie')).toBeNull();
    expect(screen.getAllByTestId('cv-item').map((i) => i.textContent)).toEqual([
      'Chef|Resto|2',
      'Plongeur|Bar|0',
      'CAP|Lycée|0',
    ]);
    // capped to 4 skills, 2 languages and 3 interests
    expect(screen.getByText('skill-4')).toBeInTheDocument();
    expect(screen.queryByText('skill-5')).toBeNull();
    expect(screen.getByText('lang-2')).toBeInTheDocument();
    expect(screen.queryByText('lang-3')).toBeNull();
    expect(screen.getByText('int-3')).toBeInTheDocument();
    expect(screen.queryByText('int-4')).toBeNull();
    expect(screen.getByText('Aide CV')).toBeInTheDocument();
  });

  it('shows the sector alone when the user has no current job yet', () => {
    setup({
      complete: { sectorOccupations: [{ businessSector: { name: 'Santé' } }] },
    });
    expect(screen.getByText('Santé')).toBeInTheDocument();
  });

  it('exposes the preview as a panel', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'u',
      firstName: 'Awa',
      lastName: 'Diop',
      role: UserRoles.CANDIDATE,
    });
    (useCurrentUserProfile as jest.Mock).mockReturnValue(null);
    (useCurrentUserProfileComplete as jest.Mock).mockReturnValue(null);
    (useContextualRole as jest.Mock).mockReturnValue({ contextualRole: 'X' });
    renderWithProviders(<ProfileLivePreviewPanel />);
    expect(screen.getByText('Awa D.')).toBeInTheDocument();
  });
});
