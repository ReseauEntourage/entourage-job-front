import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { HelpGroupsCatalog } from '../HelpGroupList';
import { buildCard } from '../__fixtures__/help-groups.fixtures';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/use-cases/help-groups', () => ({
  useGetHelpGroupsQuery: jest.fn(),
}));
jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

// eslint-disable-next-line import-x/order
import { useRouter } from 'next/router';
// eslint-disable-next-line import-x/order
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
// eslint-disable-next-line import-x/order
import { useGetHelpGroupsQuery } from '@/src/use-cases/help-groups';

describe('HelpGroupsCatalog', () => {
  const replace = jest.fn();

  beforeEach(() => {
    replace.mockReset();
    (useRouter as jest.Mock).mockReturnValue({ replace });
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.CANDIDATE,
    });
  });

  it('redirects to the default page of the role when no group is published', () => {
    (useGetHelpGroupsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
    render(<HelpGroupsCatalog />);
    expect(replace).toHaveBeenCalledWith('/backoffice/dashboard');
    expect(screen.queryByTestId('help-group-card')).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/0 groupe|aucun groupe/i);
  });

  it('redirects an admin to the members list when no group is published', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.ADMIN,
    });
    (useGetHelpGroupsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
    render(<HelpGroupsCatalog />);
    expect(replace).toHaveBeenCalledWith('/backoffice/admin/membres');
  });

  it('does not redirect while loading', () => {
    (useGetHelpGroupsQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    render(<HelpGroupsCatalog />);
    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('lists the groups without redirecting when one is published', () => {
    (useGetHelpGroupsQuery as jest.Mock).mockReturnValue({
      data: [buildCard()],
      isLoading: false,
    });
    render(<HelpGroupsCatalog />);
    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByTestId('help-group-card')).toBeInTheDocument();
  });
});
