import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { AchievementType } from '@/src/api/types';
import { useCurrentUserAchievements } from '@/src/hooks/current-user/useCurrentUserAchievements';
import { DashboardAchievementProgression } from './DashboardAchievementProgression';

let mockDesktop = true;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => (mockDesktop ? 1280 : 400),
  useWindowSize: () => [mockDesktop ? 1280 : 400, 800],
}));
let mockInitialized = true;
let mockProgressions: any[] = [];
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: (selector: any) => selector(),
}));
jest.mock('@/src/use-cases/gamification', () => ({
  selectGamificationIsInitialized: () => mockInitialized,
  selectAchievementProgressions: () => mockProgressions,
}));
jest.mock('@/src/hooks/current-user/useCurrentUserAchievements', () => ({
  useCurrentUserAchievements: jest.fn(),
}));
jest.mock('@/src/components/ui/Skeleton/Skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));
jest.mock('@/src/components/ui', () => ({
  ...jest.requireActual('@/src/components/ui'),
  Tooltip: ({ children, content }: any) => (
    <span data-testid="tooltip">
      {children}
      {content}
    </span>
  ),
}));

const entry = (overrides: Record<string, unknown> = {}) => ({
  type: AchievementType.SUPER_ENGAGED_COACH,
  label: 'Super engagé',
  hasAchievement: false,
  achievedAt: null,
  expireAt: null,
  statsWindowMonths: 3,
  criteria: [
    {
      key: 'responseRate',
      label: 'Taux de réponse',
      currentValue: 0,
      threshold: 80,
    },
    {
      key: 'conversationCount',
      label: 'Conversations',
      currentValue: 0,
      threshold: 5,
    },
  ],
  ...overrides,
});

describe('DashboardAchievementProgression', () => {
  beforeEach(() => {
    mockDesktop = true;
    mockInitialized = true;
    mockProgressions = [entry()];
    (useCurrentUserAchievements as jest.Mock).mockReturnValue([]);
  });

  it('shows a skeleton until the gamification data is initialized', () => {
    mockInitialized = false;
    render(<DashboardAchievementProgression />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('renders nothing when there is no achievement to show', () => {
    mockProgressions = [];
    const { container } = render(<DashboardAchievementProgression />);

    expect(container).toBeEmptyDOMElement();
  });

  describe('badge not obtained yet', () => {
    it('invites to get the badge and counts the remaining objectives', () => {
      render(<DashboardAchievementProgression />);

      expect(
        screen.getByText('Obtenez le badge "Super engagé"')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Encore 2 objectifs à atteindre')
      ).toBeInTheDocument();
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('0 / 5')).toBeInTheDocument();
    });

    it('uses the singular when one objective remains', () => {
      mockProgressions = [
        entry({
          criteria: [
            {
              key: 'responseRate',
              label: 'Taux',
              currentValue: 90,
              threshold: 80,
            },
            {
              key: 'conversationCount',
              label: 'Conv',
              currentValue: 1,
              threshold: 5,
            },
          ],
        }),
      ];
      render(<DashboardAchievementProgression />);

      expect(
        screen.getByText('Encore 1 objectif à atteindre')
      ).toBeInTheDocument();
    });

    it('rounds the response rate percentage', () => {
      mockProgressions = [
        entry({
          criteria: [
            {
              key: 'responseRate',
              label: 'Taux',
              currentValue: 66.6,
              threshold: 80,
            },
          ],
        }),
      ];
      render(<DashboardAchievementProgression />);

      expect(screen.getByText('67%')).toBeInTheDocument();
    });

    it('shows the rolling window start date', () => {
      render(<DashboardAchievementProgression />);

      expect(screen.getByText(/^Calculé depuis le /)).toBeInTheDocument();
    });
  });

  describe('badge obtained', () => {
    const obtained = (overrides: Record<string, unknown> = {}) =>
      entry({
        hasAchievement: true,
        achievedAt: '2026-03-15T00:00:00.000Z',
        expireAt: '2026-09-15T00:00:00.000Z',
        criteria: [
          {
            key: 'responseRate',
            label: 'Taux',
            currentValue: 90,
            threshold: 80,
          },
          {
            key: 'conversationCount',
            label: 'Conv',
            currentValue: 6,
            threshold: 5,
          },
        ],
        ...overrides,
      });

    it('states the badge is obtained with its validity date', () => {
      mockProgressions = [obtained()];
      render(<DashboardAchievementProgression />);

      expect(
        screen.getByText('Badge "Super engagé" obtenu')
      ).toBeInTheDocument();
      expect(screen.getByText(/Valide jusqu'au/)).toBeInTheDocument();
      expect(
        screen.queryByText(/pour conserver ton badge/)
      ).not.toBeInTheDocument();
    });

    it('offers the LinkedIn certification when the user holds the achievement', () => {
      mockProgressions = [obtained()];
      (useCurrentUserAchievements as jest.Mock).mockReturnValue([
        { id: 'ach1', achievementType: AchievementType.SUPER_ENGAGED_COACH },
      ]);
      render(<DashboardAchievementProgression />);

      const link = screen
        .getByText('Ajouter à mon profil LinkedIn')
        .closest('a');
      const href = link?.getAttribute('href') ?? '';
      expect(href).toContain('https://www.linkedin.com/profile/add?');
      expect(href).toContain('issueYear=2026');
      expect(href).toContain('issueMonth=3');
      expect(href).toContain('coach-certification%2Fach1');
    });

    it('does not offer the LinkedIn certification without the user achievement', () => {
      mockProgressions = [obtained()];
      render(<DashboardAchievementProgression />);

      expect(
        screen.queryByText('Ajouter à mon profil LinkedIn')
      ).not.toBeInTheDocument();
    });

    it('tolerates a non-array achievements value', () => {
      mockProgressions = [obtained()];
      (useCurrentUserAchievements as jest.Mock).mockReturnValue(undefined);
      render(<DashboardAchievementProgression />);

      expect(
        screen.getByText('Badge "Super engagé" obtenu')
      ).toBeInTheDocument();
    });

    it('warns that the badge is at risk when a criterion is no longer met', () => {
      mockProgressions = [
        obtained({
          criteria: [
            {
              key: 'responseRate',
              label: 'Taux',
              currentValue: 50,
              threshold: 80,
            },
          ],
        }),
      ];
      render(<DashboardAchievementProgression />);

      expect(screen.getByText(/Agis avant le/)).toBeInTheDocument();
      expect(screen.getByText(/pour conserver ton badge/)).toBeInTheDocument();
    });
  });

  it('shows the explanatory tooltip on desktop only', () => {
    const { unmount } = render(<DashboardAchievementProgression />);
    expect(screen.getByTestId('tooltip')).toHaveTextContent(
      'Ce que ça change pour les candidats'
    );
    unmount();

    mockDesktop = false;
    render(<DashboardAchievementProgression />);
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });

  it('falls back on a neutral icon for an unknown criterion', () => {
    mockProgressions = [
      entry({
        criteria: [
          { key: 'unknown', label: 'Inconnu', currentValue: 1, threshold: 2 },
        ],
      }),
    ];
    render(<DashboardAchievementProgression />);

    expect(screen.getByText('Inconnu')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });
});
