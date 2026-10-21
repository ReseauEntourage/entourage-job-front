import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { authenticationActions } from '@/src/use-cases/authentication';
import { currentUserActions } from '@/src/use-cases/current-user';
import { Login } from '../Login';
import { useLogin } from '../useLogin';

jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock('@/src/components/verify-email/SendVerifyEmailButton', () => ({
  SendVerifyEmailButton: ({ email }: { email?: string }) => (
    <button>resend-for-{email ?? 'nobody'}</button>
  ),
}));

const mockForm = jest.fn();
jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: (props: { error?: React.ReactNode }) => {
    mockForm(props);
    return <div data-testid="form">{props.error}</div>;
  },
}));

const mockedApi = Api as jest.Mocked<typeof Api>;
const replace = jest.fn();
let query: Record<string, unknown> = {};

const lastForm = () => mockForm.mock.calls[mockForm.mock.calls.length - 1][0];

type TestStore = ReturnType<typeof createTestStore>;

const wrapper =
  (store: TestStore) =>
  ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>;
  };

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  query = {};
  (useRouter as jest.Mock).mockImplementation(() => ({ replace, query }));
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useLogin', () => {
  it('has no error message without login error', () => {
    const store = createTestStore();
    const { result } = renderHook(() => useLogin(), {
      wrapper: wrapper(store),
    });
    expect(result.current.loginErrorMessage).toBeUndefined();
  });

  (
    [
      [
        'RATE_LIMIT',
        'Trop de tentatives infructueuses.\nVeuillez ressayer dans 1 minute.',
      ],
      [
        'INVALID_CREDENTIALS',
        'Erreur de connexion. Identifiant ou mot de passe invalide.',
      ],
      ['SOMETHING_ELSE', 'Une erreur est survenue'],
    ] as const
  ).forEach(([error, message]) => {
    it(`maps the ${error} error to its message`, () => {
      const store = createTestStore();
      store.dispatch(authenticationActions.loginFailed({ error } as never));
      const { result } = renderHook(() => useLogin(), {
        wrapper: wrapper(store),
      });
      expect(result.current.loginErrorMessage).toBe(message);
    });
  });

  it('offers to resend the verification email for an unverified account', () => {
    const store = createTestStore();
    store.dispatch(
      authenticationActions.loginFailed({ error: 'UNVERIFIED_EMAIL' } as never)
    );
    const { result } = renderHook(() => useLogin(), {
      wrapper: wrapper(store),
    });
    act(() => {
      result.current.setEmail('a@b.fr');
    });
    render(<>{result.current.loginErrorMessage}</>);
    expect(
      screen.getByText(/Votre adresse email n'a pas été vérifiée/)
    ).toBeInTheDocument();
    expect(screen.getByText('resend-for-a@b.fr')).toBeInTheDocument();
  });

  it('redirects a verified user to their default page after a short delay', () => {
    const store = createTestStore();
    store.dispatch(
      currentUserActions.fetchUserSucceeded({
        id: 'u',
        role: UserRoles.CANDIDATE,
        isEmailVerified: true,
      } as never)
    );
    renderHook(() => useLogin(), { wrapper: wrapper(store) });
    expect(replace).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(replace).toHaveBeenCalledWith('/backoffice/dashboard');
  });

  it('redirects to the requested path when given', () => {
    query = { requestedPath: '/backoffice/messaging' };
    const store = createTestStore();
    store.dispatch(
      currentUserActions.fetchUserSucceeded({
        id: 'u',
        role: UserRoles.ADMIN,
        isEmailVerified: true,
      } as never)
    );
    renderHook(() => useLogin(), { wrapper: wrapper(store) });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(replace).toHaveBeenCalledWith('/backoffice/messaging');
  });

  it('uses the first requested path when several are given', () => {
    query = { requestedPath: ['/first', '/second'] };
    const store = createTestStore();
    store.dispatch(
      currentUserActions.fetchUserSucceeded({
        id: 'u',
        role: UserRoles.COACH,
        isEmailVerified: true,
      } as never)
    );
    renderHook(() => useLogin(), { wrapper: wrapper(store) });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(replace).toHaveBeenCalledWith('/first');
  });

  it('fills the [alertId] placeholder from the current url', () => {
    window.history.pushState({}, '', '/login?alertId=42');
    query = { requestedPath: '/backoffice/alerts/[alertId]' };
    const store = createTestStore();
    store.dispatch(
      currentUserActions.fetchUserSucceeded({
        id: 'u',
        role: UserRoles.COACH,
        isEmailVerified: true,
      } as never)
    );
    renderHook(() => useLogin(), { wrapper: wrapper(store) });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(replace).toHaveBeenCalledWith('/backoffice/alerts/42');
    window.history.pushState({}, '', '/');
  });

  it('keeps the placeholder when the url carries no alertId', () => {
    query = { requestedPath: '/backoffice/alerts/[alertId]' };
    const store = createTestStore();
    store.dispatch(
      currentUserActions.fetchUserSucceeded({
        id: 'u',
        role: UserRoles.COACH,
        isEmailVerified: true,
      } as never)
    );
    renderHook(() => useLogin(), { wrapper: wrapper(store) });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(replace).toHaveBeenCalledWith('/backoffice/alerts/[alertId]');
  });

  it('does not redirect an unverified or anonymous user', () => {
    const store = createTestStore();
    store.dispatch(
      currentUserActions.fetchUserSucceeded({
        id: 'u',
        role: UserRoles.COACH,
        isEmailVerified: false,
      } as never)
    );
    renderHook(() => useLogin(), { wrapper: wrapper(store) });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(replace).not.toHaveBeenCalled();
  });
});

describe('Login', () => {
  it('shows the card, the footer links and the form', () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByText('Connectez-vous à votre espace personnel')
    ).toBeInTheDocument();
    expect(screen.getByText('Mot de passe oublié ?')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Inscrivez-vous' })
    ).toHaveAttribute('href', '/wizard');
    expect(lastForm()).toMatchObject({
      submitText: 'Se connecter',
      enterToSubmit: true,
    });
  });

  it('dispatches the login request on submit', () => {
    const store = createTestStore();
    const dispatchSpy = jest
      .spyOn(store, 'dispatch')
      .mockImplementation(((a: unknown) => a) as never);
    renderWithProviders(<Login />, { store });
    act(() => {
      lastForm().onSubmit({ email: 'a@b.fr', password: 'secret' });
    });
    expect(dispatchSpy).toHaveBeenCalledWith(
      authenticationActions.loginRequested({
        email: 'a@b.fr',
        password: 'secret',
      })
    );
  });

  it('shows the login error in the form', () => {
    const store = createTestStore();
    store.dispatch(
      authenticationActions.loginFailed({
        error: 'INVALID_CREDENTIALS',
      } as never)
    );
    renderWithProviders(<Login />, { store });
    expect(
      screen.getByText(
        'Erreur de connexion. Identifiant ou mot de passe invalide.'
      )
    ).toBeInTheDocument();
  });

  describe('forgotten password flow', () => {
    const openForgotten = () => {
      renderWithProviders(<Login />);
      fireEvent.click(screen.getByText('Mot de passe oublié ?'));
      const element = (openModal as jest.Mock).mock.calls[0][0];
      return element.props.composers as ((
        close: () => void,
        next: () => void,
        previous: () => void
      ) => React.ReactElement<any>)[];
    };

    it('opens a two-step stepper modal', () => {
      const composers = openForgotten();
      expect(composers).toHaveLength(2);
      const element = (openModal as jest.Mock).mock.calls[0][0];
      expect(element.props.title).toBe('Mot de passe oublié ?');
    });

    it('sends the lowercased email then moves to the confirmation', async () => {
      mockedApi.postAuthForgot.mockResolvedValue({} as never);
      const composers = openForgotten();
      const next = jest.fn();
      const close = jest.fn();
      const form = composers[0](close, next, jest.fn()).props;
      await form.onSubmit({ email: 'A@B.FR' }, jest.fn());
      expect(mockedApi.postAuthForgot).toHaveBeenCalledWith({
        email: 'a@b.fr',
      });
      expect(next).toHaveBeenCalledTimes(1);
      expect(form.onCancel).toBe(close);
    });

    it('explains an unknown address', async () => {
      mockedApi.postAuthForgot.mockRejectedValue(new Error('404'));
      const composers = openForgotten();
      const setError = jest.fn();
      await composers[0](jest.fn(), jest.fn(), jest.fn()).props.onSubmit(
        { email: 'a@b.fr' },
        setError
      );
      expect(setError).toHaveBeenCalledWith(
        "L'adresse mail ne correspond à aucun utilisateur"
      );
    });

    it('explains the rate limit on a 429', async () => {
      mockedApi.postAuthForgot.mockRejectedValue({ response: { status: 429 } });
      const composers = openForgotten();
      const setError = jest.fn();
      await composers[0](jest.fn(), jest.fn(), jest.fn()).props.onSubmit(
        { email: 'a@b.fr' },
        setError
      );
      expect(setError).toHaveBeenCalledWith(
        'Trop de tentatives infructueuses.\nVeuillez ressayer dans 1 minute.'
      );
    });

    it('confirms by email on the second step', () => {
      const composers = openForgotten();
      const close = jest.fn();
      const success = composers[1](close, jest.fn(), jest.fn());
      expect(success.props.text).toBe(
        "Un e-mail vient d'être envoyé à l'adresse indiquée."
      );
      expect(success.props.closeModal).toBe(close);
    });
  });
});
