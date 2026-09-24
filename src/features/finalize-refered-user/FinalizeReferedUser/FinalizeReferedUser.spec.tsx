jest.mock('@/src/api');

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import {
  EXPIRED_LINK_MESSAGE,
  FinalizeReferedUser,
  INVALID_LINK_MESSAGE,
} from './FinalizeReferedUser';

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
const nowInSeconds = () => Math.floor(Date.now() / 1000);
const expiredToken = buildToken({ sub: 'user-id', exp: nowInSeconds() - 60 });
const validToken = buildToken({ sub: 'user-id', exp: nowInSeconds() + 3600 });

const renderWithToken = (token: string | undefined) => {
  mockUseRouter.mockReturnValue({
    query: token === undefined ? {} : { token },
    isReady: true,
    push: jest.fn(),
  });
  return renderWithProviders(<FinalizeReferedUser />);
};

describe('FinalizeReferedUser', () => {
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
});
