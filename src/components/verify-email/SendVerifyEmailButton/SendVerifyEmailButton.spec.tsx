jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { SendVerifyEmailButton } from './SendVerifyEmailButton';

const mockedApi = getMockedApi();

describe('SendVerifyEmailButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ query: {}, isReady: true });
  });

  afterEach(() => cleanup());

  it('shows a confirmation once the email has been sent', async () => {
    mockedApi.postAuthSendVerifyEmail.mockResolvedValue({} as any);
    renderWithProviders(<SendVerifyEmailButton email="a@b.fr" />);
    fireEvent.click(screen.getByText('Me renvoyer un email de vérification'));
    await act(async () => {
      await flushPromises();
    });
    expect(mockedApi.postAuthSendVerifyEmail).toHaveBeenCalledWith({
      email: 'a@b.fr',
    });
    expect(await screen.findByText('Email envoyé !')).toBeInTheDocument();
    expect(
      screen.queryByText('Me renvoyer un email de vérification')
    ).toBeNull();
  });

  it('shows an error label when sending fails', async () => {
    mockedApi.postAuthSendVerifyEmail.mockRejectedValue(new Error('boom'));
    renderWithProviders(<SendVerifyEmailButton email="a@b.fr" />);
    fireEvent.click(screen.getByText('Me renvoyer un email de vérification'));
    await act(async () => {
      await flushPromises();
    });
    expect(
      await screen.findByText("Erreur lors de l'envoi de l'email")
    ).toBeInTheDocument();
  });
});
