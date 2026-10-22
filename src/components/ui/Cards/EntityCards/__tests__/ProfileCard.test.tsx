import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { GA_TAGS } from '@/src/constants/tags';
import { UserRoles } from '@/src/constants/users';
import { gaEvent } from '@/src/lib/gtag';
import { ProfileCard, ProfileCardProps } from '../ProfileCard/ProfileCard';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));
jest.mock('@/src/hooks/useImageFallback', () => ({
  useImageFallback: ({ hasPicture }: { hasPicture: boolean }) => ({
    urlImg: hasPicture ? '/real.jpg' : null,
  }),
}));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/features/profile/ProfileAchievementHighlighter', () => ({
  ProfileAchievementHighlighter: () => <span>achievement</span>,
}));
jest.mock(
  '@/src/components/ui/RecommendationReasonBadge/RecommendationReasonBadge',
  () => ({
    RecommendationReasonBadge: ({ reason }: { reason: string }) => (
      <span>reason:{reason}</span>
    ),
  })
);

const sector = (id: string, name: string) => ({ id, name });
const so = (sectorName: string, id: string, occupationName?: string) =>
  ({
    businessSector: sector(id, sectorName),
    occupation: occupationName ? { id, name: occupationName } : undefined,
  }) as never;

const baseProps = {
  userId: 'u1',
  firstName: 'Marie',
  lastName: 'Dupont',
  role: UserRoles.COACH,
  gender: 1,
  hasPicture: true,
  achievements: [],
  isAvailable: true,
} as unknown as ProfileCardProps;

describe('ProfileCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('links to the profile and tracks the click', () => {
    render(<ProfileCard {...baseProps} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toContain('u1');
    fireEvent.click(link);
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.PAGE_ANNUAIRE_CARTE_CLIC);
  });

  it('shows the abbreviated name, department, availability and photo', () => {
    render(<ProfileCard {...baseProps} department={'Paris (75)' as never} />);
    expect(screen.getByText('Marie D.')).toBeInTheDocument();
    expect(screen.getByText('Paris (75)')).toBeInTheDocument();
    expect(screen.getByText('Disponible')).toBeInTheDocument();
    expect(screen.getAllByAltText('photo de Marie')[0]).toBeInTheDocument();
  });

  it('shows the placeholder picture without photo', () => {
    render(<ProfileCard {...baseProps} hasPicture={false} />);
    expect(
      screen.getAllByAltText('photo de Marie')[0].getAttribute('src')
    ).toContain('profile-placeholder');
  });

  it('shows the first achievement', () => {
    render(
      <ProfileCard {...baseProps} achievements={[{ id: 'a' } as never]} />
    );
    expect(screen.getByText('achievement')).toBeInTheDocument();
  });

  it('shows the coach job or a fallback, and coach wording', () => {
    const { rerender } = render(
      <ProfileCard {...baseProps} currentJob="Développeuse" />
    );
    expect(screen.getByText('Développeuse')).toBeInTheDocument();
    expect(screen.getByText("J'ai du réseau dans :")).toBeInTheDocument();
    rerender(<ProfileCard {...baseProps} />);
    expect(screen.getByText('Métier non renseigné')).toBeInTheDocument();
  });

  it('shows candidate occupations and candidate wording', () => {
    render(
      <ProfileCard
        {...baseProps}
        role={UserRoles.CANDIDATE}
        sectorOccupations={[
          so('Tech', 's1', 'chef'),
          so('Tech', 's1', 'cuisinier'),
        ]}
      />
    );
    expect(
      screen.getByText('Je recherche un emploi dans :')
    ).toBeInTheDocument();
    expect(screen.getByText('Chef,')).toBeInTheDocument();
    expect(screen.getByText('Cuisinier')).toBeInTheDocument();
    // Sectors are de-duplicated
    expect(screen.getAllByText('Tech')).toHaveLength(1);
  });

  it('shows the missing information placeholders for a candidate without data', () => {
    render(<ProfileCard {...baseProps} role={UserRoles.CANDIDATE} />);
    expect(screen.getByText('Métier non renseigné')).toBeInTheDocument();
    expect(
      screen.getByText("Ces informations n'ont pas encore été renseignées")
    ).toBeInTheDocument();
  });

  it('limits sectors to two and counts the rest for coaches only', () => {
    const sectorOccupations = [
      so('A', '1'),
      so('B', '2'),
      so('C', '3'),
      so('D', '4'),
    ];
    const { rerender } = render(
      <ProfileCard {...baseProps} sectorOccupations={sectorOccupations} />
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();

    rerender(
      <ProfileCard
        {...baseProps}
        role={UserRoles.CANDIDATE}
        sectorOccupations={sectorOccupations}
      />
    );
    expect(screen.queryByText('+2')).not.toBeInTheDocument();
  });

  it('shows the recommendation reason instead of the call to action', () => {
    const { rerender } = render(<ProfileCard {...baseProps} />);
    expect(screen.getByText('Voir le profil')).toBeInTheDocument();
    rerender(<ProfileCard {...baseProps} recommendationReason="needs" />);
    expect(screen.getByText('reason:needs')).toBeInTheDocument();
    expect(screen.queryByText('Voir le profil')).not.toBeInTheDocument();
  });
});
