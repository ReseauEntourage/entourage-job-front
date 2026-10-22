import '@testing-library/jest-dom';
import { datadogRum } from '@datadog/browser-rum';
import { act, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { GA_TAGS } from '@/src/constants/tags';
import { useOnboardingRedirect } from '@/src/features/wizard/onboarding/useOnboardingRedirect';
import { useAuthentication } from '@/src/hooks/authentication/useAuthentication';
import { usePasswordSetupRedirect } from '@/src/hooks/authentication/usePasswordSetupRedirect';
import * as gtag from '@/src/lib/gtag';
import EntourageApp from '@/src/pages/_app';
import { selectCurrentUser } from '@/src/use-cases/current-user';

jest.mock('@datadog/browser-rum', () => ({
  datadogRum: { getInitConfiguration: jest.fn(), init: jest.fn() },
}));
jest.mock('react-redux', () => ({
  Provider: ({ children }: any) => <>{children}</>,
  useSelector: jest.fn(),
}));
jest.mock('@/src/store/store', () => ({ store: {} }));
jest.mock('@/src/store/DataProvider', () => ({
  DataProvider: ({ children }: any) => <>{children}</>,
}));
jest.mock('@/src/styles/GlobalStyle', () => ({ GlobalStyle: () => null }));
jest.mock('@/src/features/modals/Modal', () => ({
  ModalsListener: () => <div data-testid="modals" />,
}));
jest.mock('@/src/features/wizard/onboarding/useOnboardingRedirect', () => ({
  useOnboardingRedirect: jest.fn(),
}));
jest.mock('@/src/hooks/authentication/useAuthentication', () => ({
  useAuthentication: jest.fn(),
}));
jest.mock('@/src/hooks/authentication/usePasswordSetupRedirect', () => ({
  usePasswordSetupRedirect: jest.fn(),
}));
jest.mock('@/src/lib/gtag', () => ({
  pageview: jest.fn(),
  gaEventWithUser: jest.fn(),
}));
jest.mock('@/src/use-cases/current-user', () => ({
  selectCurrentUser: jest.fn(),
}));
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const { useRouter } = jest.requireMock('next/router');
const { useSelector } = jest.requireMock('react-redux');

const Page = () => <div data-testid="page">page</div>;

describe('_app', () => {
  const on = jest.fn();
  const off = jest.fn();
  const beforePopState = jest.fn();
  const env = { ...process.env };

  const ready = (auth = true, onboarding = true, password = true) => {
    (useAuthentication as jest.Mock).mockReturnValue({
      isAuthRouteReady: auth,
    });
    (useOnboardingRedirect as jest.Mock).mockReturnValue({
      isOnboardingRouteReady: onboarding,
    });
    (usePasswordSetupRedirect as jest.Mock).mockReturnValue({
      isPasswordSetupRouteReady: password,
    });
  };

  const renderApp = () =>
    render(<EntourageApp {...({ Component: Page, pageProps: {} } as any)} />);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation();
    (useRouter as jest.Mock).mockReturnValue({
      events: { on, off },
      beforePopState,
    });
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector === selectCurrentUser ? null : undefined
    );
    ready();
    delete process.env.NEXT_PUBLIC_DD_APP_ID;
    delete process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN;
  });

  afterEach(() => {
    process.env = { ...env };
    jest.restoreAllMocks();
  });

  it('renders the page and the modals listener once every route guard is ready', () => {
    renderApp();

    expect(screen.getByTestId('page')).toBeInTheDocument();
    expect(screen.getByTestId('modals')).toBeInTheDocument();
  });

  [
    [false, true, true],
    [true, false, true],
    [true, true, false],
  ].forEach(([auth, onboarding, password]) => {
    it(`renders no page while a route guard is pending (auth=${auth}, onboarding=${onboarding}, password=${password})`, () => {
      ready(auth, onboarding, password);
      renderApp();

      expect(screen.queryByTestId('page')).not.toBeInTheDocument();
    });
  });

  it('tracks the backoffice opening for the logged-in user', () => {
    (useSelector as jest.Mock).mockReturnValue({
      id: 'u1',
      zone: 'PARIS',
      role: 'Coach',
    });
    renderApp();

    expect(gtag.gaEventWithUser).toHaveBeenCalledWith(
      GA_TAGS.BACKOFFICE_OPEN.action,
      { userId: 'u1', zone: 'PARIS', role: 'Coach' }
    );
  });

  it('does not track anything without a logged-in user', () => {
    renderApp();

    expect(gtag.gaEventWithUser).not.toHaveBeenCalled();
  });

  it('sends a page view on route change and unsubscribes the scroll listener on unmount', () => {
    const { unmount } = renderApp();

    const pageviewHandler = on.mock.calls.find(
      ([evt, fn]) => evt === 'routeChangeComplete' && fn.length === 1
    )?.[1];
    pageviewHandler('/some-url');
    expect(gtag.pageview).toHaveBeenCalledWith('/some-url');

    unmount();
    expect(off).toHaveBeenCalledWith(
      'routeChangeComplete',
      expect.any(Function)
    );
  });

  it('scrolls the body to top on a non-shallow route change only', () => {
    const scrollTo = jest.fn();
    const body = document.createElement('div');
    body.id = 'body';
    body.scrollTo = scrollTo;
    document.body.appendChild(body);
    renderApp();

    const scrollHandler = on.mock.calls.find(
      ([evt, fn]) => evt === 'routeChangeComplete' && fn.length === 2
    )?.[1];
    scrollHandler('/x', { shallow: true });
    expect(scrollTo).not.toHaveBeenCalled();
    scrollHandler('/x', { shallow: false });
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    body.remove();
  });

  it('stops scrolling to top when the user navigates back', () => {
    const scrollTo = jest.fn();
    const body = document.createElement('div');
    body.id = 'body';
    body.scrollTo = scrollTo;
    document.body.appendChild(body);
    renderApp();

    const popStateHandler = beforePopState.mock.calls[0][0];
    let result;
    act(() => {
      result = popStateHandler();
    });
    expect(result).toBe(true);

    const latestScrollHandler = on.mock.calls
      .filter(([evt, fn]) => evt === 'routeChangeComplete' && fn.length === 2)
      .pop()?.[1];
    latestScrollHandler('/x', { shallow: false });
    expect(scrollTo).not.toHaveBeenCalled();
    body.remove();
  });

  describe('Datadog RUM', () => {
    it('warns and does not initialise without configuration', () => {
      renderApp();

      expect(console.warn).toHaveBeenCalled();
      expect(datadogRum.init).not.toHaveBeenCalled();
    });

    it('initialises once with the configured application', () => {
      process.env.NEXT_PUBLIC_DD_APP_ID = 'app';
      process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN = 'tok';
      (datadogRum.getInitConfiguration as jest.Mock).mockReturnValue(undefined);
      renderApp();

      expect(datadogRum.init).toHaveBeenCalledWith(
        expect.objectContaining({
          applicationId: 'app',
          clientToken: 'tok',
          site: 'datadoghq.eu',
        })
      );
    });

    it('does not initialise twice', () => {
      process.env.NEXT_PUBLIC_DD_APP_ID = 'app';
      process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN = 'tok';
      (datadogRum.getInitConfiguration as jest.Mock).mockReturnValue({});
      renderApp();

      expect(datadogRum.init).not.toHaveBeenCalled();
    });
  });
});
