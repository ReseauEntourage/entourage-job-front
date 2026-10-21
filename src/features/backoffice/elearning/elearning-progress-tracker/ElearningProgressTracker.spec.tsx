import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useElearning } from '../useElearning';
import { ElearningProgressTracker } from './ElearningProgressTracker';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('../useElearning', () => ({ useElearning: jest.fn() }));

describe('ElearningProgressTracker', () => {
  it('shows the progress rate and a description adapted to the role', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.COACH,
    });
    (useElearning as jest.Mock).mockReturnValue({ completionRate: 60 });
    render(<ElearningProgressTracker />);
    expect(screen.getByText('Votre parcours de formation')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Suivez ces modules pour rejoindre notre communauté de coachs bienveillants.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('addresses candidates', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.CANDIDATE,
    });
    (useElearning as jest.Mock).mockReturnValue({ completionRate: 0 });
    render(<ElearningProgressTracker />);
    expect(
      screen.getByText(/communauté de candidats bienveillants/)
    ).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
