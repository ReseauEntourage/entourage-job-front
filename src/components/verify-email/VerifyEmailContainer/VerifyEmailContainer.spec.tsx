jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('../useVerifyEmail', () => ({ useVerifyEmail: jest.fn() }));
jest.mock('../SendVerifyEmailButton', () => ({
  SendVerifyEmailButton: () => <div>send-button</div>,
}));

import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { VerifyEmailTokenErrorType } from '@/src/use-cases/authentication/authentication.adapters';
import { useVerifyEmail } from '../useVerifyEmail';
import { VerifyEmailContainer } from './VerifyEmailContainer';

const mockUseVerifyEmail = useVerifyEmail as jest.Mock;
const replace = jest.fn();

describe('VerifyEmailContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace });
  });

  afterEach(() => cleanup());

  it('renders a spinner while loading', () => {
    mockUseVerifyEmail.mockReturnValue({ isLoading: true });
    render(<VerifyEmailContainer />);
    expect(screen.queryByTestId('verify-email-message')).toBeNull();
    expect(screen.queryByText('Vérification de mon adresse e-mail')).toBeNull();
  });

  it('redirects to the wizard when verification and autologin succeeded', () => {
    mockUseVerifyEmail.mockReturnValue({
      isLoading: false,
      shouldRedirectToWizard: true,
    });
    render(<VerifyEmailContainer />);
    expect(replace).toHaveBeenCalledWith('/wizard');
  });

  it('shows the success message and a login link when there is no error', () => {
    mockUseVerifyEmail.mockReturnValue({ isLoading: false });
    render(<VerifyEmailContainer />);
    expect(
      screen.getByText('Votre adresse email a bien été vérifiée')
    ).toBeInTheDocument();
    expect(screen.getByText('Se connecter à mon compte')).toBeInTheDocument();
    expect(screen.queryByText('send-button')).toBeNull();
    expect(replace).not.toHaveBeenCalled();
  });

  [
    [
      VerifyEmailTokenErrorType.TOKEN_EXPIRED,
      'Votre lien de confirmation a expiré. Veuillez demander un nouveau',
      true,
    ],
    [
      VerifyEmailTokenErrorType.TOKEN_INVALID,
      'Une erreur est survenue lors de la vérification de votre adresse email',
      true,
    ],
    [
      VerifyEmailTokenErrorType.ALREADY_VERIFIED,
      'Votre adresse a déjà été vérifiée !',
      false,
    ],
  ].forEach(([error, message, canResend]) => {
    it(`shows the right message for ${error}`, () => {
      mockUseVerifyEmail.mockReturnValue({
        isLoading: false,
        verifyEmailTokenError: error,
      });
      render(<VerifyEmailContainer />);
      expect(screen.getByText(message as string)).toBeInTheDocument();
      expect(!!screen.queryByText('send-button')).toBe(canResend);
      expect(!!screen.queryByText('Se connecter à mon compte')).toBe(
        !canResend
      );
    });
  });
});
