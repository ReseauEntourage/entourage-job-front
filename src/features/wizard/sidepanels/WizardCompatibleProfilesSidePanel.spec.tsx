jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('./WizardCompatibleProfileCard', () => ({
  WizardCompatibleProfileCard: ({ profile, subtitleContext }: any) => (
    <div data-testid="profile-card">{`${profile.id}-${subtitleContext}`}</div>
  ),
  WizardCompatibleProfileCardSkeleton: () => <div data-testid="skeleton" />,
}));

import { act, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { slice } from '@/src/use-cases/registration/registration.slice';
import { WizardCompatibleProfilesSidePanel } from './WizardCompatibleProfilesSidePanel';

const mockedApi = getMockedApi();

const stateWith = (overrides: Record<string, unknown>) =>
  createTestStore({
    registration: { ...slice.getInitialState(), ...overrides },
  } as any);

const prefs = (nudgeIds: string[], businessSectorIds: string[] = []) => ({
  preRegistrationPreferences: {
    nudgeIds,
    businessSectorIds,
    sectorOccupations: [],
  },
});

const settle = async () => {
  await act(async () => {
    jest.advanceTimersByTime(300);
    await Promise.resolve();
    await Promise.resolve();
  });
};

describe('WizardCompatibleProfilesSidePanel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  afterEach(() => jest.useRealTimers());

  describe('without criteria', () => {
    it('invites the candidate to answer and shows skeleton cards', () => {
      renderWithProviders(
        <WizardCompatibleProfilesSidePanel subtitleContext="nudges" />,
        { store: stateWith({}) }
      );

      expect(
        screen.getByText('Répondez à la première question pour voir vos coachs')
      ).toBeTruthy();
      expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
      expect(
        mockedApi.getPreRegistrationCompatibleProfiles
      ).not.toHaveBeenCalled();
    });

    it('compact mode asks to answer, per role', () => {
      const { unmount } = renderWithProviders(
        <WizardCompatibleProfilesSidePanel
          subtitleContext="nudges"
          mode="compact"
        />,
        { store: stateWith({}) }
      );
      expect(screen.getByText('Répondez pour voir vos coachs')).toBeTruthy();
      unmount();

      renderWithProviders(
        <WizardCompatibleProfilesSidePanel
          subtitleContext="nudges"
          mode="compact"
        />,
        { store: stateWith({ selectedFlow: RegistrationFlow.COACH }) }
      );
      expect(screen.getByText('Répondez pour voir vos candidats')).toBeTruthy();
    });
  });

  describe('with criteria', () => {
    it('debounces the search, then lists the profiles and stores the count', async () => {
      mockedApi.getPreRegistrationCompatibleProfiles.mockResolvedValue({
        data: { profiles: [{ id: 'a' }, { id: 'b' }], count: 2 },
      } as any);
      const store = stateWith(prefs(['n1']));
      renderWithProviders(
        <WizardCompatibleProfilesSidePanel subtitleContext="nudges" />,
        { store }
      );

      expect(screen.getByText('...')).toBeTruthy();
      expect(
        screen.getByText('Nous recherchons des profils compatibles')
      ).toBeTruthy();
      expect(
        mockedApi.getPreRegistrationCompatibleProfiles
      ).not.toHaveBeenCalled();

      await settle();

      expect(
        mockedApi.getPreRegistrationCompatibleProfiles
      ).toHaveBeenCalledWith({
        role: 'Candidat',
        nudgeIds: ['n1'],
        businessSectorIds: [],
      });
      expect(
        screen.getAllByTestId('profile-card').map((n) => n.textContent)
      ).toEqual(['a-nudges', 'b-nudges']);
      expect(screen.getByText('coachs prêts à vous soutenir')).toBeTruthy();
      expect(
        screen.getByText('Selon les coups de pouce que vous avez choisis')
      ).toBeTruthy();
      expect(store.getState().registration.compatibleProfilesCount).toBe(2);
      expect(
        screen.getByText(
          /Finaliser votre inscription pour contacter ces coachs/
        )
      ).toBeTruthy();
    });

    it('uses the singular and the sectors wording', async () => {
      mockedApi.getPreRegistrationCompatibleProfiles.mockResolvedValue({
        data: { profiles: [{ id: 'a' }], count: 1 },
      } as any);
      renderWithProviders(
        <WizardCompatibleProfilesSidePanel subtitleContext="sectors" />,
        { store: stateWith(prefs([], ['s1'])) }
      );
      await settle();

      expect(screen.getByText('coach prêt à vous soutenir')).toBeTruthy();
      expect(
        screen.getByText('Selon les secteurs que vous avez choisis')
      ).toBeTruthy();
    });

    it('uses the candidate wording for a coach', async () => {
      mockedApi.getPreRegistrationCompatibleProfiles.mockResolvedValue({
        data: { profiles: [], count: 4 },
      } as any);
      renderWithProviders(
        <WizardCompatibleProfilesSidePanel subtitleContext="nudges" />,
        {
          store: stateWith({
            selectedFlow: RegistrationFlow.COACH,
            ...prefs(['n1']),
          }),
        }
      );
      await settle();

      expect(screen.getByText('candidats qui ont besoin de vous')).toBeTruthy();
      expect(screen.getByText(/pour soutenir ces personnes/)).toBeTruthy();
    });

    it('tells when the search was broadened', async () => {
      mockedApi.getPreRegistrationCompatibleProfiles.mockResolvedValue({
        data: { profiles: [], count: 3, broadened: true },
      } as any);
      renderWithProviders(
        <WizardCompatibleProfilesSidePanel subtitleContext="nudges" />,
        { store: stateWith(prefs(['n1'])) }
      );
      await settle();

      expect(screen.getByText(/On a élargi à votre secteur/)).toBeTruthy();
    });

    it('shows zero profiles when the search fails', async () => {
      mockedApi.getPreRegistrationCompatibleProfiles.mockRejectedValue(
        new Error('boom')
      );
      renderWithProviders(
        <WizardCompatibleProfilesSidePanel subtitleContext="nudges" />,
        { store: stateWith(prefs(['n1'])) }
      );
      await settle();

      expect(screen.queryByTestId('profile-card')).toBeNull();
      expect(screen.getByText('0')).toBeTruthy();
    });

    it('compact mode shows the count and the loading dots', async () => {
      mockedApi.getPreRegistrationCompatibleProfiles.mockResolvedValue({
        data: { profiles: [], count: 5 },
      } as any);
      renderWithProviders(
        <WizardCompatibleProfilesSidePanel
          subtitleContext="nudges"
          mode="compact"
        />,
        { store: stateWith(prefs(['n1'])) }
      );

      expect(screen.getByText('...')).toBeTruthy();
      await settle();
      expect(screen.getByText('5')).toBeTruthy();
      expect(screen.getByText('coachs prêts à vous soutenir')).toBeTruthy();
    });
  });
});
