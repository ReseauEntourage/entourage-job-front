jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/components/ui/Navbar/NavbarLogo', () => ({
  NavbarLogo: () => <div data-testid="logo" />,
}));

const mockEmbedding: { current: any } = { current: null };
jest.mock('@/src/hooks/useEmbeddingStatus', () => ({
  useEmbeddingStatus: (opts: any) => {
    mockEmbedding.current = opts;
  },
}));
jest.mock('./WizardCompatibleProfileCard', () => ({
  WizardCompatibleProfileCard: ({ profile, locked, variant }: any) => (
    <div data-testid="profile-card">{`${profile.id}-${variant}-${locked}`}</div>
  ),
}));

import { act, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import {
  SEARCHING_LOADER_VARIANTS,
  WizardSearchingLoader,
} from '../components/WizardSearchingLoader';
import { WizardRecommendationsSidePanel } from './WizardRecommendationsSidePanel';
import { WizardRoleSelectionSidePanel } from './WizardRoleSelectionSidePanel';

const mockedApi = jest.mocked(Api);

describe('WizardRoleSelectionSidePanel', () => {
  it('shows the pitch and social proof without flow', () => {
    render(<WizardRoleSelectionSidePanel flow={null} />);

    expect(
      screen.getByText('Un monde où chacun a des gens sur qui compter.')
    ).toBeTruthy();
    expect(screen.getByText('1 700 candidats')).toBeTruthy();
    expect(screen.queryByText('Valérie')).toBeNull();
    expect(screen.queryByText('Murielle')).toBeNull();
  });

  it('shows the candidate testimonial', () => {
    render(<WizardRoleSelectionSidePanel flow={RegistrationFlow.CANDIDATE} />);

    expect(screen.getByText('Valérie')).toBeTruthy();
    expect(screen.getByText('soutenue par 11 coachs')).toBeTruthy();
  });

  it('shows the coach testimonial', () => {
    render(<WizardRoleSelectionSidePanel flow={RegistrationFlow.COACH} />);

    expect(screen.getByText('Murielle')).toBeTruthy();
    expect(screen.getByText('a soutenu 39 candidats')).toBeTruthy();
  });

  it('has no testimonial for the other flows', () => {
    render(<WizardRoleSelectionSidePanel flow={RegistrationFlow.REFERER} />);

    expect(screen.queryByText('Valérie')).toBeNull();
    expect(screen.queryByText('Murielle')).toBeNull();
  });
});

describe('WizardSearchingLoader', () => {
  it('shows the title and subtitle of the variant', () => {
    render(
      <WizardSearchingLoader {...SEARCHING_LOADER_VARIANTS.embeddingPending} />
    );

    expect(
      screen.getByText(
        'Nous analysons les modifications récentes de votre profil'
      )
    ).toBeTruthy();
    expect(screen.getByText('Encore quelques instants...')).toBeTruthy();
  });
});

describe('WizardRecommendationsSidePanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmbedding.current = null;
  });

  const recommendation = (id: string) => ({
    id,
    publicProfile: { id: `profile-${id}` },
  });

  it('shows the recommendations as locked compact cards once loaded', async () => {
    mockedApi.getProfilesRecommendations.mockResolvedValue({
      data: { recommendations: [recommendation('1'), recommendation('2')] },
    } as any);
    render(<WizardRecommendationsSidePanel />);
    await act(flushPromises);

    expect(mockedApi.getProfilesRecommendations).toHaveBeenCalledWith({
      limit: 3,
    });
    expect(
      screen.getAllByTestId('profile-card').map((n) => n.textContent)
    ).toEqual(['profile-1-compact-true', 'profile-2-compact-true']);
  });

  it('shows a loader while the profile embedding is pending, then fetches again when ready', async () => {
    mockedApi.getProfilesRecommendations
      .mockResolvedValueOnce({ data: { embeddingPending: true } } as any)
      .mockResolvedValueOnce({
        data: { recommendations: [recommendation('1')] },
      } as any);
    render(<WizardRecommendationsSidePanel />);
    await act(flushPromises);

    expect(
      screen.getByText(
        'Nous analysons les modifications récentes de votre profil'
      )
    ).toBeTruthy();
    expect(mockEmbedding.current.enabled).toBe(true);

    act(() => {
      mockEmbedding.current.onReady();
    });
    expect(screen.getByText('Selon votre profil')).toBeTruthy();
    await act(flushPromises);

    expect(mockedApi.getProfilesRecommendations).toHaveBeenCalledTimes(2);
    expect(screen.getAllByTestId('profile-card')).toHaveLength(1);
  });

  it('shows no card when the request fails', async () => {
    mockedApi.getProfilesRecommendations.mockRejectedValue(new Error('boom'));
    render(<WizardRecommendationsSidePanel />);
    await act(flushPromises);

    expect(screen.queryByTestId('profile-card')).toBeNull();
    expect(screen.queryByText(/Nous recherchons/)).toBeNull();
  });

  describe('compact mode', () => {
    it('shows a loading message first', () => {
      mockedApi.getProfilesRecommendations.mockReturnValue(
        new Promise(() => {}) as any
      );
      render(<WizardRecommendationsSidePanel mode="compact" />);

      expect(
        screen.getByText('Chargement de vos recommandations...')
      ).toBeTruthy();
    });

    it('pluralises the selected profiles count', async () => {
      mockedApi.getProfilesRecommendations.mockResolvedValue({
        data: { recommendations: [recommendation('1'), recommendation('2')] },
      } as any);
      render(<WizardRecommendationsSidePanel mode="compact" />);
      await act(flushPromises);

      expect(screen.getByText('2 profils sélectionnés pour vous')).toBeTruthy();
    });

    it('uses the singular for one profile', async () => {
      mockedApi.getProfilesRecommendations.mockResolvedValue({
        data: { recommendations: [recommendation('1')] },
      } as any);
      render(<WizardRecommendationsSidePanel mode="compact" />);
      await act(flushPromises);

      expect(screen.getByText('1 profil sélectionné pour vous')).toBeTruthy();
    });

    it('falls back to a generic label without recommendations', async () => {
      mockedApi.getProfilesRecommendations.mockResolvedValue({
        data: { recommendations: [] },
      } as any);
      render(<WizardRecommendationsSidePanel mode="compact" />);
      await act(flushPromises);

      expect(screen.getByText('Votre sélection personnalisée')).toBeTruthy();
    });
  });
});
