import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { CollaboratorSmallCard } from './CollaboratorSmallCard';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const user = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 'u1',
    firstName: 'Jane',
    lastName: 'doe',
    role: 'Coach',
    userProfile: { hasPicture: false, currentJob: 'Développeuse' },
    ...overrides,
  }) as any;

describe('CollaboratorSmallCard', () => {
  it('shows the collaborator first name, initial of the last name and current job', () => {
    renderWithProviders(<CollaboratorSmallCard user={user()} />);

    expect(screen.getByText('Jane D.')).toBeInTheDocument();
    expect(screen.getByText(/Développeuse/)).toBeInTheDocument();
  });

  it('omits the job when the profile has none', () => {
    renderWithProviders(
      <CollaboratorSmallCard
        user={user({ userProfile: { hasPicture: false, currentJob: null } })}
      />
    );

    expect(screen.queryByText(/Développeuse/)).not.toBeInTheDocument();
  });

  it('shows an invited colleague by email with a placeholder picture', () => {
    render(<CollaboratorSmallCard email="new@acme.fr" />);

    expect(screen.getByText('new@acme.fr')).toBeInTheDocument();
    expect(screen.getByText('Invitation envoyée')).toBeInTheDocument();
    expect(screen.getByAltText('Default Profile')).toBeInTheDocument();
  });
});
