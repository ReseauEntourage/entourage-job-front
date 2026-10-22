import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { Profile } from './Profile';
import { useSelectSelectedProfile } from './useSelectedProfile';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

let mockCurrentUser: { role: UserRoles } = { role: UserRoles.COACH };
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: () => mockCurrentUser,
}));
jest.mock('./useSelectedProfile', () => ({
  useSelectSelectedProfile: jest.fn(),
}));

function mockStub(name: string) {
  return () => <div data-testid="part">{name}</div>;
}
jest.mock('@/src/features/headers/HeaderProfile/HeaderProfile', () => ({
  HeaderProfile: ({ id, isAvailable }: any) => (
    <div data-testid="header">{`${id}|${isAvailable}`}</div>
  ),
}));
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
  '@/src/features/profile/ProfilePartCards/ProfileNudges/ProfileNudges',
  () => ({ ProfileNudges: mockStub('nudges') })
);
jest.mock(
  '@/src/features/profile/ProfilePartCards/ProfileProfessionalInformations/ProfileProfessionalInformations',
  () => ({ ProfileProfessionalInformations: mockStub('professional') })
);
jest.mock('../../profile/ProfilePartCards/ProfileContactCard', () => ({
  ProfileContactCard: mockStub('contact-card'),
}));
jest.mock('./ProfileShareNetwork/ProfileShareNetwork', () => ({
  ProfileShareNetwork: mockStub('share-network'),
}));

const BANNER = /présenté à titre indicatif/;

const profile = (overrides: Record<string, unknown> = {}) => ({
  id: 'p1',
  firstName: 'Jane',
  lastName: 'Doe',
  role: UserRoles.CANDIDATE,
  unavailableAt: null,
  customNudges: [],
  experiences: [],
  formations: [],
  contracts: [],
  interests: [],
  userProfileLanguages: [],
  nudges: [],
  skills: [],
  sectorOccupations: [],
  elearningCompletedAt: '2026-01-01',
  ...overrides,
});

const parts = () => screen.getAllByTestId('part').map((el) => el.textContent);

describe('Profile', () => {
  const setup = (selected: Record<string, unknown>, role = UserRoles.COACH) => {
    mockCurrentUser = { role };
    (useSelectSelectedProfile as jest.Mock).mockReturnValue(selected);
    return render(<Profile />);
  };

  it('shows the header with the availability derived from unavailableAt', () => {
    setup(profile({ unavailableAt: '2026-02-02' }));

    expect(screen.getByTestId('header')).toHaveTextContent('p1|false');
  });

  it('shows every card, including candidate-only ones, for a candidate profile', () => {
    setup(profile({ customNudges: [{ id: 'n' }] }));

    expect(parts()).toEqual([
      'professional',
      'custom-nudges',
      'experiences',
      'formations',
      'contact-card',
      'share-network',
      'contracts',
      'interests',
      'languages',
      'documents',
      'contact-preferences',
      'nudges',
    ]);
  });

  it('hides candidate-only cards and empty experiences/formations for a coach profile', () => {
    setup(profile({ role: UserRoles.COACH, customNudges: [{ id: 'n' }] }));

    expect(parts()).not.toContain('custom-nudges');
    expect(parts()).not.toContain('share-network');
    expect(parts()).not.toContain('contracts');
    expect(parts()).not.toContain('experiences');
    expect(parts()).not.toContain('formations');
  });

  it('shows experiences and formations of a coach when they have some', () => {
    setup(
      profile({
        role: UserRoles.COACH,
        experiences: [{ id: 'e' }],
        formations: [{ id: 'f' }],
      })
    );

    expect(parts()).toEqual(
      expect.arrayContaining(['experiences', 'formations'])
    );
  });

  it('shows the custom nudges of a candidate only when there are some', () => {
    setup(profile());

    expect(parts()).not.toContain('custom-nudges');
  });

  describe('admin exemption banner', () => {
    it('is shown to an admin looking at a profile without elearning completion', () => {
      setup(profile({ elearningCompletedAt: null }), UserRoles.ADMIN);

      expect(screen.getByText(BANNER)).toBeInTheDocument();
    });

    it('is hidden when the profile completed elearning', () => {
      setup(profile(), UserRoles.ADMIN);

      expect(screen.queryByText(BANNER)).not.toBeInTheDocument();
    });

    [UserRoles.COACH, UserRoles.CANDIDATE, UserRoles.REFERER].forEach(
      (role) => {
        it(`is hidden for a ${role}`, () => {
          setup(profile({ elearningCompletedAt: null }), role);

          expect(screen.queryByText(BANNER)).not.toBeInTheDocument();
        });
      }
    );
  });
});
