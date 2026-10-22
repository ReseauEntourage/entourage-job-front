import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';
import { DashboardToolboxCard } from './DashboardToolboxCard';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserCompany', () => ({
  useCurrentUserCompany: jest.fn(),
}));

describe('DashboardToolboxCard', () => {
  const env = { ...process.env };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_TOOLBOX_URL = 'https://toolbox';
    process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL = 'https://toolbox/candidate';
    process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL = 'https://toolbox/coach';
    process.env.NEXT_PUBLIC_TOOLBOX_COMPANY_URL = 'https://toolbox/company';
    (useCurrentUserCompany as jest.Mock).mockReturnValue(null);
  });

  afterEach(() => {
    process.env = { ...env };
  });

  const setup = (role: UserRoles, company: unknown = null) => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({ role });
    (useCurrentUserCompany as jest.Mock).mockReturnValue(company);
    return render(<DashboardToolboxCard />);
  };

  const seeAllHref = () =>
    screen
      .getByText('Voir tous les conseils')
      .closest('a')
      ?.getAttribute('href');

  it('shows the candidate guides and toolbox for a candidate', () => {
    setup(UserRoles.CANDIDATE);

    expect(
      screen.getByText('Bien réaliser son CV Entourage Pro')
    ).toBeInTheDocument();
    expect(seeAllHref()).toBe('https://toolbox/candidate');
  });

  it('shows the coach guides and toolbox for a coach', () => {
    setup(UserRoles.COACH);

    expect(
      screen.getByText('10 coups de pouce à réaliser en tant que coach')
    ).toBeInTheDocument();
    expect(seeAllHref()).toBe('https://toolbox/coach');
  });

  it('shows the coach guides to referers', () => {
    setup(UserRoles.REFERER);

    expect(
      screen.getByText(/accompagner les candidats dans leur recherche d’emploi/)
    ).toBeInTheDocument();
    expect(seeAllHref()).toBe('https://toolbox/coach');
  });

  it('shows the company toolbox to a coach who is a company admin', () => {
    setup(UserRoles.COACH, { companyUser: { isAdmin: true } });

    expect(screen.getByText('Guide pratique du coach')).toBeInTheDocument();
    expect(seeAllHref()).toBe('https://toolbox/company');
  });

  it('keeps the coach toolbox for a coach who is not a company admin', () => {
    setup(UserRoles.COACH, { companyUser: { isAdmin: false } });

    expect(seeAllHref()).toBe('https://toolbox/coach');
  });

  it('opens each article in a new tab, on the toolbox domain', () => {
    setup(UserRoles.CANDIDATE);

    const link = screen.getByText('Comment contacter un coach ?').closest('a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link?.getAttribute('href')).toMatch(
      /^https:\/\/toolbox\/Comment-contacter/
    );
  });
});
