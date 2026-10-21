jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock(
  '@/src/features/profile/CVExperienceOrFormation/CVExperienceOrFormation',
  () => ({
    CVExperienceOrFormation: ({ title, structure }: any) => (
      <div data-testid="cv-item">{`${title}@${structure}`}</div>
    ),
  })
);

import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { renderWithProviders as render } from '@/src/store/testUtils/renderWithProviders';
import {
  WizardCompatibleProfileCard,
  WizardCompatibleProfileCardSkeleton,
} from './WizardCompatibleProfileCard';

const baseProfile: any = {
  id: 'p1',
  firstName: 'Jeanne',
  lastName: 'Dupont',
  role: UserRoles.COACH,
  unavailableAt: null,
  hasPicture: false,
  currentJob: 'Développeuse',
  sectorOccupations: [
    {
      id: 'so1',
      businessSector: { name: 'Informatique' },
      occupation: { name: 'Développeur' },
    },
    { id: 'so2', businessSector: { name: 'Bâtiment' }, occupation: undefined },
  ],
  nudges: [
    { id: 'n1', nameRequest: 'Refaire son CV', nameOffer: 'Aide au CV' },
  ],
  experiences: [
    { id: 'e1', title: 'Exp 1', company: 'Acme' },
    { id: 'e2', title: 'Exp 2', company: 'Beta' },
    { id: 'e3', title: 'Exp 3', company: 'Gamma' },
  ],
  formations: [
    { id: 'f1', title: 'Master', institution: 'Univ' },
    { id: 'f2', title: 'Licence', institution: 'Univ2' },
  ],
};

describe('WizardCompatibleProfileCard (compact)', () => {
  it('abbreviates the last name and shows the occupations as the job', () => {
    render(
      <WizardCompatibleProfileCard
        profile={baseProfile}
        variant="compact"
        subtitleContext="sectors"
      />
    );

    expect(screen.getByText('Jeanne D.')).toBeTruthy();
    expect(screen.getByText('Développeur')).toBeTruthy();
  });

  it('shows sector badges in the sectors context only', () => {
    const { unmount } = render(
      <WizardCompatibleProfileCard
        profile={baseProfile}
        variant="compact"
        subtitleContext="sectors"
      />
    );
    expect(screen.getByText('Informatique')).toBeTruthy();
    expect(screen.getByText('Bâtiment')).toBeTruthy();
    expect(screen.queryByText('Aide au CV')).toBeNull();
    unmount();

    render(
      <WizardCompatibleProfileCard
        profile={baseProfile}
        variant="compact"
        subtitleContext="nudges"
      />
    );
    expect(screen.queryByText('Informatique')).toBeNull();
    expect(screen.getByText('Aide au CV')).toBeTruthy();
  });

  it('uses the request wording of the nudges for a candidate', () => {
    render(
      <WizardCompatibleProfileCard
        profile={{ ...baseProfile, role: UserRoles.CANDIDATE }}
        variant="compact"
        subtitleContext="nudges"
      />
    );

    expect(screen.getByText('Refaire son CV')).toBeTruthy();
  });

  it('falls back to the current job when there is no occupation', () => {
    render(
      <WizardCompatibleProfileCard
        profile={{ ...baseProfile, sectorOccupations: [] }}
        variant="compact"
        subtitleContext="sectors"
      />
    );

    expect(screen.getByText('Développeuse')).toBeTruthy();
  });

  it('survives a profile without optional data', () => {
    render(
      <WizardCompatibleProfileCard
        profile={
          {
            id: 'p',
            firstName: 'A',
            lastName: 'B',
            role: UserRoles.COACH,
          } as never
        }
        variant="compact"
        subtitleContext="sectors"
      />
    );

    expect(screen.getByText('A B.')).toBeTruthy();
  });

  it('shows the locked contact button only when locked', () => {
    const { unmount } = render(
      <WizardCompatibleProfileCard
        profile={baseProfile}
        variant="compact"
        subtitleContext="sectors"
        locked
      />
    );
    expect(screen.getByText(/Contacter/).closest('button')?.disabled).toBe(
      true
    );
    unmount();

    render(
      <WizardCompatibleProfileCard
        profile={baseProfile}
        variant="compact"
        subtitleContext="sectors"
      />
    );
    expect(screen.queryByText(/Contacter/)).toBeNull();
  });
});

describe('WizardCompatibleProfileCard (full)', () => {
  it('shows the badge, the sector lines and limits experiences and formations', () => {
    render(
      <WizardCompatibleProfileCard
        profile={baseProfile}
        variant="full"
        badgeLabel="Coach"
        locked
      />
    );

    expect(screen.getByText('Coach')).toBeTruthy();
    expect(screen.getByText('Informatique - Développeur')).toBeTruthy();
    expect(screen.getByText('Bâtiment')).toBeTruthy();
    expect(screen.getAllByTestId('cv-item').map((n) => n.textContent)).toEqual([
      'Exp 1@Acme',
      'Exp 2@Beta',
      'Master@Univ',
    ]);
    expect(screen.getByText(/Contacter/)).toBeTruthy();
  });

  it('shows the current job line when there is no occupation', () => {
    render(
      <WizardCompatibleProfileCard
        profile={{ ...baseProfile, sectorOccupations: [] }}
        variant="full"
        badgeLabel="Coach"
      />
    );

    expect(screen.getByText('Développeuse')).toBeTruthy();
    expect(screen.queryByText(/Contacter/)).toBeNull();
  });
});

describe('WizardCompatibleProfileCardSkeleton', () => {
  it('renders without content', () => {
    const { container } = render(<WizardCompatibleProfileCardSkeleton />);

    expect(container.textContent).toBe('');
    expect(container.firstChild).toBeTruthy();
  });
});
