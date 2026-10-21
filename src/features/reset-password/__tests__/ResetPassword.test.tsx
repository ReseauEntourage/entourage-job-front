import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { Api } from '@/src/api';
import { ResetPasswordSuccess } from '../PasswordResetSuccess/ResetPasswordSuccess';
import { ResetPassword } from '../ResetPassword/ResetPassword';

jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/components/layouts/Layout', () => ({
  Layout: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="layout" data-title={title}>
      {children}
    </div>
  ),
}));

const mockForm = jest.fn();
jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: (props: unknown) => {
    mockForm(props);
    return <div data-testid="form" />;
  },
}));

const mockedApi = Api as jest.Mocked<typeof Api>;
const push = jest.fn();
let query: Record<string, unknown> = {};

const lastForm = () => mockForm.mock.calls[mockForm.mock.calls.length - 1][0];

beforeEach(() => {
  jest.clearAllMocks();
  query = {};
  (useRouter as jest.Mock).mockImplementation(() => ({ push, query }));
});

describe('ResetPassword', () => {
  const props = { valid: true, id: 'u1', token: 'tok', isCreation: false };

  it('shows the reset form with the reset title for a valid link', () => {
    render(<ResetPassword {...props} />);
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Réinitialisation de mot de passe - Entourage Pro'
    );
    expect(
      screen.getByText('Réinitialisation de mot de passe')
    ).toBeInTheDocument();
    expect(screen.getByTestId('form')).toBeInTheDocument();
  });

  it('uses the creation wording when creating a password', () => {
    render(<ResetPassword {...props} isCreation />);
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Création de mot de passe - Entourage Pro'
    );
    expect(screen.getByText('Création de mot de passe')).toBeInTheDocument();
  });

  it('saves the password then goes to the success page', async () => {
    mockedApi.postResetUserToken.mockResolvedValue({} as never);
    render(<ResetPassword {...props} />);
    await lastForm().onSubmit(
      { newPassword: 'n', confirmPassword: 'n' },
      jest.fn()
    );
    expect(mockedApi.postResetUserToken).toHaveBeenCalledWith('u1', 'tok', {
      newPassword: 'n',
      confirmPassword: 'n',
    });
    expect(push).toHaveBeenCalledWith('/reset/success?isCreation=false');
  });

  it('keeps the creation flag in the success url', async () => {
    mockedApi.postResetUserToken.mockResolvedValue({} as never);
    render(<ResetPassword {...props} isCreation />);
    await lastForm().onSubmit(
      { newPassword: 'n', confirmPassword: 'n' },
      jest.fn()
    );
    expect(push).toHaveBeenCalledWith('/reset/success?isCreation=true');
  });

  it('shows an error and stays when the API fails', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockedApi.postResetUserToken.mockRejectedValue(new Error('boom'));
    render(<ResetPassword {...props} />);
    const setError = jest.fn();
    await lastForm().onSubmit(
      { newPassword: 'n', confirmPassword: 'n' },
      setError
    );
    expect(setError).toHaveBeenCalledWith('Une erreur est survenue');
    expect(push).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('explains an invalid link and offers to go back home', () => {
    render(<ResetPassword {...props} valid={false} />);
    expect(screen.queryByTestId('form')).toBeNull();
    expect(
      screen.getByText(/Ce lien ne semble pas valide/)
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: "Retourner à l'accueil" })
    );
    expect(push).toHaveBeenCalledWith('/');
  });
});

describe('ResetPasswordSuccess', () => {
  it('confirms the reset and links to the login page', () => {
    render(<ResetPasswordSuccess />);
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Réinitialisation de mot de passe - Entourage Pro'
    );
    expect(
      screen.getByText(/Votre mot de passe a bien été réinitialisé/)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    expect(push).toHaveBeenCalledWith('/login');
  });

  it('uses the creation wording when the query says so', () => {
    query = { isCreation: 'true' };
    render(<ResetPasswordSuccess />);
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Création de mot de passe - Entourage Pro'
    );
    expect(
      screen.getByText(/Votre mot de passe a bien été crée/)
    ).toBeInTheDocument();
  });
});
