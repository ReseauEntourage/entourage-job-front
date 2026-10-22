import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { ProfileContactPreferences } from '../ProfileContactPreferences/ProfileContactPreferences';
import { ProfileContracts } from '../ProfileContracts/ProfileContracts';
import { ProfileNotificationsPreferences } from '../ProfileNotificationsPreferences/ProfileNotificationsPreferences';
import { ProfileNudges } from '../ProfileNudges/ProfileNudges';

jest.mock('@/src/api');
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfileComplete', () => ({
  useCurrentUserProfileComplete: jest.fn(),
}));
jest.mock('@/src/hooks/useUpdateProfile', () => ({
  useUpdateProfile: jest.fn(),
}));

const mockedApi = Api as jest.Mocked<typeof Api>;
const updateUserProfile = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useAuthenticatedUser as jest.Mock).mockReturnValue({
    id: 'u1',
    role: UserRoles.CANDIDATE,
  });
  (useUpdateProfile as jest.Mock).mockReturnValue({ updateUserProfile });
  (useCurrentUserProfileComplete as jest.Mock).mockReturnValue(null);
});

describe('ProfileContactPreferences', () => {
  it('renders nothing when not editable and no preference is enabled', () => {
    const { container } = render(
      <ProfileContactPreferences userRole={UserRoles.CANDIDATE} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows only enabled preferences in read mode, worded for the role', () => {
    (useCurrentUserProfileComplete as jest.Mock).mockReturnValue({
      allowRemoteEvents: true,
      allowPhysicalEvents: false,
    });
    render(<ProfileContactPreferences userRole={UserRoles.COACH} />);
    expect(
      screen.getByText('Je préfère accompagner en visio')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Je préfère accompagner en présentiel')
    ).toBeNull();
  });

  it('uses the candidate wording', () => {
    (useCurrentUserProfileComplete as jest.Mock).mockReturnValue({
      allowPhysicalEvents: true,
    });
    render(<ProfileContactPreferences userRole={UserRoles.CANDIDATE} />);
    expect(
      screen.getByText('Je préfère être accompagné en présentiel')
    ).toBeInTheDocument();
  });

  it('saves the toggled preference when editable', () => {
    render(
      <ProfileContactPreferences userRole={UserRoles.CANDIDATE} isEditable />
    );
    const switches = screen.getAllByRole('switch');
    expect(switches).toHaveLength(2);
    fireEvent.click(switches[0]);
    expect(updateUserProfile).toHaveBeenCalledWith({
      allowRemoteEvents: true,
      allowPhysicalEvents: false,
    });
  });
});

describe('ProfileContracts', () => {
  const contracts = [
    { id: 'c1', name: 'CDI' },
    { id: 'c2', name: 'CDD' },
  ];

  it('renders nothing when not editable and no contract', () => {
    const { container } = render(<ProfileContracts contracts={[]} />);
    expect(container).toBeEmptyDOMElement();
    expect(mockedApi.getAllContracts).not.toHaveBeenCalled();
  });

  it('lists the user contracts in read mode without fetching', () => {
    render(<ProfileContracts contracts={contracts} />);
    expect(screen.getByText('CDI')).toBeInTheDocument();
    expect(screen.getByText('CDD')).toBeInTheDocument();
    expect(mockedApi.getAllContracts).not.toHaveBeenCalled();
  });

  it('fetches all contracts when editable and saves the selection', async () => {
    mockedApi.getAllContracts.mockResolvedValue({
      data: [...contracts, { id: 'c3', name: 'Stage' }],
    } as never);
    render(<ProfileContracts isEditable contracts={[contracts[0]]} />);
    await waitFor(() => expect(screen.getByText('Stage')).toBeInTheDocument());
    expect(mockedApi.getAllContracts).toHaveBeenCalledWith({
      limit: 50,
      offset: 0,
    });
    fireEvent.click(screen.getAllByRole('switch')[2]);
    expect(updateUserProfile).toHaveBeenCalledWith({
      contracts: [{ id: 'c1' }, { id: 'c3' }],
    });
  });

  it('survives a failing contracts fetch', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockedApi.getAllContracts.mockRejectedValue(new Error('boom'));
    render(<ProfileContracts isEditable contracts={[]} />);
    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    expect(screen.queryAllByRole('switch')).toHaveLength(0);
    consoleError.mockRestore();
  });
});

describe('ProfileNotificationsPreferences', () => {
  it('shows the candidate wording and saves the toggle', () => {
    render(
      <ProfileNotificationsPreferences
        userProfile={{ optInRecommendations: false }}
      />
    );
    expect(screen.getByText(/recommandations de coachs/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('switch'));
    expect(updateUserProfile).toHaveBeenCalledWith({
      optInRecommendations: true,
    });
  });

  it('shows the coach wording and the current opt-in value', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      id: 'u1',
      role: UserRoles.COACH,
    });
    render(
      <ProfileNotificationsPreferences
        userProfile={{ optInRecommendations: true }}
      />
    );
    expect(
      screen.getByText(/recommandations de candidats/)
    ).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('defaults to disabled without a profile', () => {
    render(<ProfileNotificationsPreferences userProfile={null} />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });
});

describe('ProfileNudges', () => {
  const allNudges = [
    { id: 'n1', value: 'tips', nameRequest: 'Demande 1', nameOffer: 'Offre 1' },
    { id: 'n2', value: 'cv', nameRequest: 'Demande 2', nameOffer: 'Offre 2' },
  ];

  it('renders nothing when not editable and empty', () => {
    const { container } = render(
      <ProfileNudges userRole={UserRoles.CANDIDATE} nudges={[]} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the request wording for a candidate in read mode', () => {
    render(
      <ProfileNudges
        userRole={UserRoles.CANDIDATE}
        nudges={[allNudges[0]] as never}
      />
    );
    expect(screen.getByText('Demandes de coup de pouce')).toBeInTheDocument();
    expect(screen.getByText('Demande 1')).toBeInTheDocument();
    expect(mockedApi.getAllNudges).not.toHaveBeenCalled();
  });

  it('shows the offer wording for a coach', () => {
    render(
      <ProfileNudges
        userRole={UserRoles.COACH}
        nudges={[allNudges[1]] as never}
      />
    );
    expect(screen.getByText('Offres de coup de pouce')).toBeInTheDocument();
    expect(screen.getByText('Offre 2')).toBeInTheDocument();
  });

  it('fetches every nudge when editable and saves the selection', async () => {
    mockedApi.getAllNudges.mockResolvedValue({ data: allNudges } as never);
    render(
      <ProfileNudges
        isEditable
        userRole={UserRoles.CANDIDATE}
        nudges={[allNudges[0]] as never}
      />
    );
    await waitFor(() =>
      expect(screen.getByText('Demande 2')).toBeInTheDocument()
    );
    await act(async () => {
      fireEvent.click(screen.getAllByRole('switch')[1]);
    });
    expect(updateUserProfile).toHaveBeenCalledWith({
      nudges: [{ id: 'n1' }, { id: 'n2' }],
    });
  });

  it('survives a failing nudges fetch', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockedApi.getAllNudges.mockRejectedValue(new Error('boom'));
    render(<ProfileNudges isEditable userRole={UserRoles.COACH} nudges={[]} />);
    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    consoleError.mockRestore();
  });
});
