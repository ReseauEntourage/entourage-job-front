jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('next/router', () => ({
  useRouter: () => ({ query: {}, isReady: true }),
}));

const mockSendVerifyEmail = jest.fn();
jest.mock('@/src/components/verify-email/useSendVerifyEmail', () => ({
  useSendVerifyEmail: (email?: string) => ({
    sendVerifyEmail: () => mockSendVerifyEmail(email),
  }),
}));

import { act, fireEvent, renderHook, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { selectRegistrationData } from '@/src/use-cases/registration';
import { Confirmation } from './Confirmation';
import { useConfirmation } from './useConfirmation';

const storeWithEmail = (email?: string) =>
  createTestStore({
    registration: {
      selectedFlow: null,
      currentStep: 5,
      data: email === undefined ? null : { email },
      isLoading: false,
      isEnded: true,
      invitationId: undefined,
      preRegistrationPreferences: null,
      compatibleProfilesCount: null,
    },
  } as any);

function hookFor(email?: string) {
  const store = storeWithEmail(email);
  const utils = renderHook(() => useConfirmation(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
  return { store, ...utils };
}

describe('useConfirmation', () => {
  it('exposes the registered email and its webmail provider', () => {
    const { result } = hookFor('Ada@Gmail.com');

    expect(result.current.email).toBe('Ada@Gmail.com');
    expect(result.current.webmailProvider?.label).toBe('Gmail');
    expect(result.current.webmailProvider?.url).toBe(
      'https://mail.google.com/'
    );
  });

  it('recognises several provider domains', () => {
    expect(hookFor('a@hotmail.com').result.current.webmailProvider?.label).toBe(
      'Outlook'
    );
    expect(hookFor('a@wanadoo.fr').result.current.webmailProvider?.label).toBe(
      'Orange'
    );
    expect(hookFor(' a@PROTON.me ').result.current.webmailProvider?.label).toBe(
      'Proton Mail'
    );
  });

  it('has no provider for an unknown domain or an invalid email', () => {
    expect(
      hookFor('a@my-company.org').result.current.webmailProvider
    ).toBeNull();
    expect(hookFor('not-an-email').result.current.webmailProvider).toBeNull();
    expect(hookFor('a@').result.current.webmailProvider).toBeNull();
  });

  it('has no email without registration data', () => {
    const { result } = hookFor();

    expect(result.current.email).toBeUndefined();
    expect(result.current.webmailProvider).toBeNull();
  });

  it('ignores a non string email', () => {
    const store = createTestStore({
      registration: { data: { email: 42 } },
    } as any);
    const { result } = renderHook(() => useConfirmation(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.email).toBeUndefined();
  });

  it('resets the registration data on mount but keeps the email it captured', () => {
    const { store, result } = hookFor('ada@gmail.com');

    expect(selectRegistrationData(store.getState() as any)).toBeNull();
    expect(result.current.email).toBe('ada@gmail.com');
  });

  it('lists all the known providers', () => {
    expect(hookFor().result.current.providers.length).toBeGreaterThanOrEqual(
      10
    );
  });
});

describe('Confirmation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });
  afterEach(() => jest.useRealTimers());

  const renderConfirmation = (email?: string) =>
    renderWithProviders(<Confirmation />, { store: storeWithEmail(email) });

  it('mentions the email and links to the webmail', () => {
    renderConfirmation('ada@gmail.com');

    expect(screen.getByText(/à ada@gmail.com/)).toBeTruthy();
    expect(screen.getByText('Ouvrir Gmail')).toBeTruthy();
  });

  it('shows no webmail button nor resend option without a known provider/email', () => {
    renderConfirmation();

    expect(screen.queryByText(/Ouvrir/)).toBeNull();
    expect(screen.queryByText(/toujours pas reçu/)).toBeNull();
  });

  it('shows the cooldown countdown, then lets the user resend once', () => {
    renderConfirmation('ada@my-company.org');

    expect(screen.getByText(/dans 30s/)).toBeTruthy();
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText(/dans 25s/)).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(25000);
    });
    const link = screen.getByText('Renvoyer un email de validation');
    fireEvent.click(link);

    expect(mockSendVerifyEmail).toHaveBeenCalledTimes(1);
    expect(mockSendVerifyEmail).toHaveBeenCalledWith('ada@my-company.org');
    expect(screen.getByText(/nouvel email .* vient de/)).toBeTruthy();
    expect(screen.queryByText('Renvoyer un email de validation')).toBeNull();
  });
});
