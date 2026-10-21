import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { ProfileContactCard } from './ProfileContactCard';

jest.mock('react-redux', () => ({
  useSelector: () => 'current-user-id',
}));
jest.mock('@/src/components/ui', () => ({
  Button: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  Text: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));
jest.mock('@/src/use-cases/current-user', () => ({
  selectCurrentUserId: jest.fn(),
}));
jest.mock('@/src/hooks/useContactEligibility', () => ({
  useContactEligibility: () => ({ openConversationOrGate: jest.fn() }),
}));
jest.mock('@/src/features/profile/ProfilePartCards/Card/Card/Card', () => ({
  ProfilePartCard: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const renderCard = (role: UserRoles) =>
  render(
    <ProfileContactCard
      userId="other-user-id"
      isAvailable
      role={role}
      firstName="Camille"
    />
  );

describe('ProfileContactCard', () => {
  [UserRoles.COACH, UserRoles.ADMIN, UserRoles.REFERER].forEach((role) => {
    it(`uses the coach wording for ${role}`, () => {
      renderCard(role);

      expect(screen.getByText(/vous aide dans votre recherche/)).toBeTruthy();
    });
  });

  it('keeps the candidate wording for a candidate', () => {
    renderCard(UserRoles.CANDIDATE);

    expect(screen.getByText(/dans sa recherche d'emploi/)).toBeTruthy();
  });
});
