jest.mock('@/src/api');

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { User } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import {
  EXPIRED_LINK_MESSAGE,
  FinalizeAccount,
  getRedirectPath,
  INVALID_LINK_MESSAGE,
  LOGIN_AFTER_FINALIZE_ERROR_MESSAGE,
} from './FinalizeAccount';

const mockedApi = getMockedApi();
const mockUseRouter = useRouter as jest.Mock;

// Unsigned JWT-shaped token: only its payload is read client side.
const buildToken = (payload: Record<string, unknown>) => {
  const encode = (value: object) =>
    btoa(JSON.stringify(value))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`;
};
// Meets the strength rules of the form; a test fixture, not a credential.
const chosenInput = 'Candidat123!';

const nowInSeconds = () => Math.floor(Date.now() / 1000);
const expiredToken = buildToken({ sub: 'user-id', exp: nowInSeconds() - 60 });
const validToken = buildToken({ sub: 'user-id', exp: nowInSeconds() + 3600 });

const renderWithToken = (token: string | undefined) => {
  mockUseRouter.mockReturnValue({
    query: token === undefined ? {} : { token },
    isReady: true,
    push: jest.fn(),
  });
  return renderWithProviders(<FinalizeAccount />);
};

// Session of an account without a password, e.g. after an autologin link.
const renderWithSessionWithoutPassword = (requestedPath?: string) => {
  const push = jest.fn().mockResolvedValue(true);
  mockUseRouter.mockReturnValue({
    query: requestedPath === undefined ? {} : { requestedPath },
    isReady: true,
    push,
  });
  const store = createTestStore();
  store.dispatch(
    currentUserActions.fetchUserSucceeded({
      id: 'user-id',
      email: 'candidate@example.com',
      isEmailVerified: false,
      hasPassword: false,
    } as User)
  );
  return { push, ...renderWithProviders(<FinalizeAccount />, { store }) };
};

const submitPassword = async (password: string) => {
  await act(async () => {
    screen
      .getAllByPlaceholderText('Entrez votre mot de passe')
      .forEach((input) =>
        fireEvent.change(input, { target: { value: password } })
      );
    await flushPromises();
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Se connecter'));
    await flushPromises();
  });
};

describe('FinalizeAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('tells the candidate right away that an expired link has expired, and offers a new one', () => {
    renderWithToken(expiredToken);

    expect(screen.getByText(EXPIRED_LINK_MESSAGE)).toBeTruthy();
    expect(screen.getByText('Recevoir un nouveau lien')).toBeTruthy();
    expect(screen.queryByText(INVALID_LINK_MESSAGE)).toBeNull();
  });

  it('does not send anything until the candidate asks for it', async () => {
    renderWithToken(expiredToken);
    await act(async () => {
      await flushPromises();
    });

    expect(mockedApi.postAuthSendFinalizeReferedUser).not.toHaveBeenCalled();
  });

  it('sends a new link with the opened token, then confirms and disables the action', async () => {
    mockedApi.postAuthSendFinalizeReferedUser.mockResolvedValue({} as never);
    renderWithToken(expiredToken);

    await act(async () => {
      fireEvent.click(screen.getByText('Recevoir un nouveau lien'));
      await flushPromises();
    });

    expect(mockedApi.postAuthSendFinalizeReferedUser).toHaveBeenCalledTimes(1);
    expect(mockedApi.postAuthSendFinalizeReferedUser).toHaveBeenCalledWith({
      token: expiredToken,
    });
    expect(
      screen.getByText('Un nouveau lien vient de vous être envoyé par email.')
    ).toBeTruthy();
    expect(screen.queryByText('Recevoir un nouveau lien')).toBeNull();
  });

  it('shows an error when the new link cannot be sent', async () => {
    mockedApi.postAuthSendFinalizeReferedUser.mockRejectedValue(
      new Error('failed')
    );
    renderWithToken(expiredToken);

    await act(async () => {
      fireEvent.click(screen.getByText('Recevoir un nouveau lien'));
      await flushPromises();
    });

    expect(screen.getByText("Erreur lors de l'envoi de l'email")).toBeTruthy();
  });

  it('shows a distinct invalid-link message without any resend action, if no token', () => {
    renderWithToken(undefined);

    expect(screen.getByText(INVALID_LINK_MESSAGE)).toBeTruthy();
    expect(screen.queryByText(EXPIRED_LINK_MESSAGE)).toBeNull();
    expect(screen.queryByText('Recevoir un nouveau lien')).toBeNull();
  });

  it('shows the password form and no resend action, if the link is still valid', () => {
    renderWithToken(validToken);

    expect(screen.getByText('Se connecter')).toBeTruthy();
    expect(screen.queryByText(EXPIRED_LINK_MESSAGE)).toBeNull();
    expect(screen.queryByText('Recevoir un nouveau lien')).toBeNull();
  });

  describe('from a session without a password', () => {
    // The account now has a password: login and identity succeed.
    const mockSuccessfulLogin = () => {
      mockedApi.postAuthLogin.mockResolvedValue({
        data: { token: 'full-session-token' },
      } as never);
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-id', isEmailVerified: true, hasPassword: true },
      } as never);
    };

    it('shows the password form without any link message', () => {
      renderWithSessionWithoutPassword();

      expect(screen.getByText('Se connecter')).toBeTruthy();
      expect(screen.queryByText(INVALID_LINK_MESSAGE)).toBeNull();
      expect(screen.queryByText(EXPIRED_LINK_MESSAGE)).toBeNull();
    });

    it('finalizes the account without a token, then goes back to the requested page', async () => {
      mockedApi.postAuthFinalizeAccount.mockResolvedValue({
        data: 'candidate@example.com',
      } as never);
      mockSuccessfulLogin();
      const { push, store } = renderWithSessionWithoutPassword(
        '/backoffice/messaging?userId=author'
      );

      await submitPassword(chosenInput);

      expect(mockedApi.postAuthFinalizeAccount).toHaveBeenCalledWith({
        password: chosenInput,
      });
      // Navigates only once the new session and identity are in place.
      expect(mockedApi.postAuthLogin).toHaveBeenCalledWith({
        email: 'candidate@example.com',
        password: chosenInput,
      });
      expect(mockedApi.getCurrentIdentity).toHaveBeenCalled();
      expect(store.getState().authentication.accessToken).toBe(
        'full-session-token'
      );
      expect(store.getState().currentUser.user?.hasPassword).toBe(true);
      expect(push).toHaveBeenCalledWith('/backoffice/messaging?userId=author');
    });

    it('stays on the page with an error, if the login fails after the password was set', async () => {
      mockedApi.postAuthFinalizeAccount.mockResolvedValue({
        data: 'candidate@example.com',
      } as never);
      mockedApi.postAuthLogin.mockRejectedValue(new Error('failed'));
      const { push } = renderWithSessionWithoutPassword(
        '/backoffice/messaging'
      );

      await submitPassword(chosenInput);

      expect(push).not.toHaveBeenCalled();
      expect(screen.getByText(LOGIN_AFTER_FINALIZE_ERROR_MESSAGE)).toBeTruthy();
    });

    it('goes to the dashboard when no page was requested', async () => {
      mockedApi.postAuthFinalizeAccount.mockResolvedValue({
        data: 'candidate@example.com',
      } as never);
      mockSuccessfulLogin();
      const { push } = renderWithSessionWithoutPassword();

      await submitPassword(chosenInput);

      expect(push).toHaveBeenCalledWith('/backoffice/dashboard');
    });
  });

  describe('from an activation link', () => {
    it('logs in with the new password before leaving, without any prior session', async () => {
      mockedApi.postAuthFinalizeAccount.mockResolvedValue({
        data: 'candidate@example.com',
      } as never);
      mockedApi.postAuthLogin.mockResolvedValue({
        data: { token: 'full-session-token' },
      } as never);
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-id', isEmailVerified: true, hasPassword: true },
      } as never);
      const push = jest.fn().mockResolvedValue(true);
      mockUseRouter.mockReturnValue({
        query: { token: validToken },
        isReady: true,
        push,
      });
      renderWithProviders(<FinalizeAccount />);

      await act(async () => {
        screen
          .getAllByPlaceholderText('Entrez votre mot de passe')
          .forEach((input) =>
            fireEvent.change(input, { target: { value: chosenInput } })
          );
        await flushPromises();
      });
      await act(async () => {
        fireEvent.click(screen.getByText('Se connecter'));
        await flushPromises();
      });

      expect(mockedApi.postAuthFinalizeAccount).toHaveBeenCalledWith(
        expect.objectContaining({ token: validToken })
      );
      expect(mockedApi.getCurrentIdentity).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith('/backoffice/dashboard');
    });
  });

  describe('getRedirectPath', () => {
    it('keeps an internal path, with its query and fragment', () => {
      expect(getRedirectPath('/backoffice/messaging?userId=a#last')).toBe(
        '/backoffice/messaging?userId=a#last'
      );
    });

    [
      'https://evil.example',
      '//evil.example',
      '/\\evil.example',
      '/\\/evil.example',
      undefined,
      ['/a'],
    ].forEach((requestedPath) => {
      it(`falls back to the dashboard for ${JSON.stringify(requestedPath)}`, () => {
        expect(getRedirectPath(requestedPath)).toBe('/backoffice/dashboard');
      });
    });
  });
});
