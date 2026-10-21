import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { MatchingReason } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { RecommendationReasonBadge } from '../RecommendationReasonBadge';

const mockUser = jest.fn();
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => mockUser(),
}));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

const renderFor = (reason: MatchingReason | string, role?: UserRoles) => {
  mockUser.mockReturnValue({ role });
  return render(
    <RecommendationReasonBadge reason={reason as MatchingReason} />
  );
};

describe('RecommendationReasonBadge', () => {
  it('adapts the "needs" wording to a candidate', () => {
    renderFor('needs', UserRoles.CANDIDATE);
    expect(screen.getByText('Correspond à vos besoins')).toBeInTheDocument();
    expect(
      screen.getByText('Ses propositions matchent vos besoins')
    ).toBeInTheDocument();
  });

  it('adapts the "needs" wording to a coach', () => {
    renderFor('needs', UserRoles.COACH);
    expect(
      screen.getByText('Correspond à vos propositions')
    ).toBeInTheDocument();
  });

  it('falls back to the default wording for other roles', () => {
    renderFor('profile', UserRoles.ADMIN);
    expect(screen.getByText('Profil complémentaire')).toBeInTheDocument();
    expect(
      screen.getByText('Son parcours correspond à votre expertise')
    ).toBeInTheDocument();
  });

  it('uses the candidate wording for the "profile" reason', () => {
    renderFor('profile', UserRoles.CANDIDATE);
    expect(
      screen.getByText('Son parcours correspond à votre projet pro')
    ).toBeInTheDocument();
  });

  it('renders role-independent reasons', () => {
    const { unmount } = renderFor('activity', UserRoles.COACH);
    expect(screen.getByText('Très réactif(ve)')).toBeInTheDocument();
    unmount();
    renderFor('locationCompatibility');
    expect(screen.getByText('Proche de vous')).toBeInTheDocument();
  });

  it('renders nothing for an unknown reason', () => {
    const { container } = renderFor('unknown', UserRoles.COACH);
    expect(container).toBeEmptyDOMElement();
  });
});
