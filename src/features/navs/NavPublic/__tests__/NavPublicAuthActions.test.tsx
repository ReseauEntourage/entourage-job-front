import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';

import { NavPublicAuthActions } from '../NavPublicAuthActions';

jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));

// eslint-disable-next-line import-x/order
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';

describe('NavPublicAuthActions', () => {
  it('renders Connexion/Inscription when no user is authenticated', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue(null);

    render(<NavPublicAuthActions />);

    expect(screen.getByRole('link', { name: 'Connexion' })).toHaveAttribute(
      'href',
      '/login'
    );
    expect(screen.getByRole('link', { name: 'Inscription' })).toHaveAttribute(
      'href',
      '/wizard'
    );
    expect(screen.queryByText('Accéder à mon espace')).not.toBeInTheDocument();
  });

  it('renders a single access button when a user is authenticated', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({ id: 1 });

    render(<NavPublicAuthActions />);

    expect(
      screen.getByRole('link', { name: 'Accéder à mon espace' })
    ).toHaveAttribute('href', '/backoffice/dashboard');
    expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
    expect(screen.queryByText('Inscription')).not.toBeInTheDocument();
  });
});
