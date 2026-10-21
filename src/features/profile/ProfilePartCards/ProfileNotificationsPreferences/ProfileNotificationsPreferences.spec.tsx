import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { ProfileNotificationsPreferences } from './ProfileNotificationsPreferences';

let mockRole: UserRoles = UserRoles.COACH;

jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => ({ id: 'user-id', role: mockRole }),
}));
jest.mock('@/src/hooks/useUpdateProfile', () => ({
  useUpdateProfile: () => ({ updateUserProfile: jest.fn() }),
}));
jest.mock('../Card/Card/Card', () => ({
  ProfilePartCard: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock('../Card/CardToggleList/CardToggleList', () => ({
  CardToggleList: ({ items }: { items: { name: string }[] }) => (
    <ul>
      {items.map((item) => (
        <li key={item.name}>{item.name}</li>
      ))}
    </ul>
  ),
}));

const renderCard = (role: UserRoles) => {
  mockRole = role;
  render(
    <ProfileNotificationsPreferences
      userProfile={{ optInRecommendations: false }}
    />
  );
};

describe('ProfileNotificationsPreferences', () => {
  [UserRoles.COACH, UserRoles.ADMIN, UserRoles.REFERER].forEach((role) => {
    it(`recommends candidates to ${role}`, () => {
      renderCard(role);

      expect(screen.getByText(/recommandations de candidats/)).toBeTruthy();
    });
  });

  it('recommends coaches to a candidate', () => {
    renderCard(UserRoles.CANDIDATE);

    expect(screen.getByText(/recommandations de coachs/)).toBeTruthy();
  });
});
