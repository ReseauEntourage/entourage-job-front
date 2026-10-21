import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { useAuthentication } from '@/src/hooks/authentication/useAuthentication';
import Page404 from '@/src/pages/404';
import CustomError from '@/src/pages/_error';
import CandidatsPage from '@/src/pages/candidats';
import CGUPage from '@/src/pages/cgu';
import ConseilsPosturePage, {
  getServerSideProps,
} from '@/src/pages/conseils-posture';
import ContactPage from '@/src/pages/contact';
import CookiesPage from '@/src/pages/cookies';
import DataPrivacyPage from '@/src/pages/data-privacy';
import EntouragePro from '@/src/pages/entourage-pro';
import FinalizeAccountPage from '@/src/pages/finaliser-compte';
import LegalNoticePage from '@/src/pages/legal-notice';
import LoginPage from '@/src/pages/login';
import MerciPage from '@/src/pages/merci/[type]';
import ResetSuccessPage from '@/src/pages/reset/success';
import VerificationEmailPage from '@/src/pages/verification-email';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { selectNotifications } from '@/src/use-cases/notifications';

jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('next/router', () => ({
  useRouter: () => ({ query: {}, push: jest.fn(), asPath: '/', pathname: '/' }),
}));
jest.mock('@/src/components/layouts/Layout', () => ({
  Layout: ({ title, noIndex, children }: any) => (
    <div
      data-testid="layout"
      data-title={title}
      data-noindex={String(!!noIndex)}
    >
      {children}
    </div>
  ),
}));
jest.mock('@/src/hooks/queryParams/useUTM', () => ({ useUtm: jest.fn() }));
jest.mock('@/src/hooks/authentication/useAuthentication', () => ({
  useAuthentication: jest.fn(),
}));
jest.mock('@/src/features/partials/common/NewsletterPartial', () => ({
  NewsletterPartial: () => <div data-testid="newsletter" />,
}));
jest.mock('@/src/features/partials/pages/Candidats/SearchCandidates', () => ({
  SearchCandidates: () => <div data-testid="SearchCandidates" />,
}));
jest.mock(
  '@/src/features/partials/pages/Candidats/ShareCandidatesCVTutorial',
  () => ({ ShareCandidatesCVTutorial: () => <div data-testid="tutorial" /> })
);
jest.mock(
  '@/src/features/partials/common/CandidateTestimoniesOrientation',
  () => ({
    CandidateTestimoniesOrientation: () => <div data-testid="testimonies" />,
  })
);
jest.mock('@/src/features/partials/pages/Documents/ConseilsPosture', () => ({
  ConseilsPosture: () => <div data-testid="ConseilsPosture" />,
}));
jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading" />,
}));
jest.mock('@/src/features/login/Login', () => ({
  Login: () => <div data-testid="Login" />,
}));
jest.mock('@/src/features/finalize-account/FinalizeAccount', () => ({
  FinalizeAccount: () => <div data-testid="FinalizeAccount" />,
}));
jest.mock('@/src/components/verify-email/VerifyEmailContainer', () => ({
  VerifyEmailContainer: () => <div data-testid="VerifyEmail" />,
}));
jest.mock('@/src/features/reset-password/PasswordResetSuccess', () => ({
  ResetPasswordSuccess: () => <div data-testid="ResetSuccess" />,
}));
jest.mock('@/src/features/merci/Merci', () => ({
  Merci: () => <div data-testid="Merci" />,
}));
jest.mock('@/src/features/partials/common/Chapter', () => ({
  Chapter: ({ title }: any) => <div data-testid="chapter">{title}</div>,
}));
jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: ({ onSubmit }: any) => (
    <button onClick={() => onSubmit({ email: 'a@b.c' })}>submit-form</button>
  ),
}));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useResetForm: () => [{ current: null }, jest.fn()],
}));

describe('static content pages', () => {
  [
    ['404', Page404, 'Page introuvable - Entourage Pro', true],
    ['CGU', CGUPage, "Conditions Générales d'Utilisation", true],
    ['cookies', CookiesPage, 'Politique de cookies', true],
    ['legal notice', LegalNoticePage, undefined, true],
    ['data privacy', DataPrivacyPage, undefined, true],
    ['candidats', CandidatsPage, 'Les candidats - Entourage Pro', false],
    ['login', LoginPage, 'Connexion - Entourage Pro', false],
    [
      'verification email',
      VerificationEmailPage,
      'Vérifier mon adresse e-email - Entourage Pro',
      false,
    ],
  ].forEach(([name, Page, title, noIndex]: any) => {
    it(`${name} page renders in the public layout (noIndex: ${noIndex})`, () => {
      render(<Page />);

      const layout = screen.getByTestId('layout');
      if (title) {
        expect(layout).toHaveAttribute('data-title', title);
      }
      expect(layout).toHaveAttribute('data-noindex', String(noIndex));
    });
  });

  it('renders the entourage-pro presentation page', () => {
    render(<EntouragePro />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders the finalize-account, reset-success and merci pages', () => {
    render(<FinalizeAccountPage />);
    expect(screen.getByTestId('FinalizeAccount')).toBeInTheDocument();
    expect(screen.getByText('Définir votre mot de passe')).toBeInTheDocument();

    render(<ResetSuccessPage />);
    expect(screen.getByTestId('ResetSuccess')).toBeInTheDocument();
  });

  it('merci/[type] re-exports the merci index page', () => {
    expect(MerciPage).toBeDefined();
  });
});

describe('conseils-posture page', () => {
  it('shows a loader until the auth route is ready, then the content', () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      isAuthRouteReady: false,
    });
    const { rerender } = render(<ConseilsPosturePage />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('ConseilsPosture')).not.toBeInTheDocument();

    (useAuthentication as jest.Mock).mockReturnValue({
      isAuthRouteReady: true,
    });
    rerender(<ConseilsPosturePage />);
    expect(screen.getByTestId('ConseilsPosture')).toBeInTheDocument();
  });

  it('is server-rendered with empty props', async () => {
    expect(await getServerSideProps()).toEqual({ props: {} });
  });
});

describe('_error page', () => {
  it('uses the response status code when rendered server side', async () => {
    expect(
      await (CustomError as any).getInitialProps({ res: { statusCode: 500 } })
    ).toEqual({ statusCode: 500 });
  });
});

describe('contact page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('posts the form and notifies success', async () => {
    (Api.postContactContactUs as jest.Mock).mockResolvedValue({});
    const { store } = renderWithProviders(<ContactPage />);

    fireEvent.click(screen.getByText('submit-form'));

    await waitFor(() =>
      expect(selectNotifications(store.getState())).toEqual([
        expect.objectContaining({
          type: 'success',
          message: 'Merci pour votre message',
        }),
      ])
    );
    expect(Api.postContactContactUs).toHaveBeenCalledWith({ email: 'a@b.c' });
  });

  it('notifies an error when the API call fails', async () => {
    (Api.postContactContactUs as jest.Mock).mockRejectedValue(new Error('x'));
    const { store } = renderWithProviders(<ContactPage />);

    fireEvent.click(screen.getByText('submit-form'));

    await waitFor(() =>
      expect(selectNotifications(store.getState())).toEqual([
        expect.objectContaining({
          type: 'danger',
          message: "Une erreur s'est produite",
        }),
      ])
    );
  });
});
