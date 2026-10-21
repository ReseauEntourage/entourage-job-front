jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

jest.mock('@/src/components/layouts/Layout', () => ({
  Layout: ({ title, children }: any) => (
    <div data-testid="layout" data-title={title}>
      {children}
    </div>
  ),
}));
jest.mock('@/src/components/layouts/LayoutBackOffice', () => ({
  LayoutBackOffice: ({ title, children }: any) => (
    <div data-testid="layout" data-title={title}>
      {children}
    </div>
  ),
}));
jest.mock('@/src/features/reset-password/ResetPassword', () => ({
  ResetPassword: (props: any) => (
    <div data-testid="ResetPassword">
      {JSON.stringify({
        valid: props.valid,
        id: props.id,
        token: props.token,
        isCreation: props.isCreation,
      })}
    </div>
  ),
}));
jest.mock('@/src/features/coach-certification/CoachCertificate', () => ({
  CoachCertificate: ({ achievement }: any) => (
    <div data-testid="CoachCertificate">{achievement.firstName}</div>
  ),
}));
jest.mock('@/src/features/merci/Merci', () => ({
  Merci: ({ currentType }: any) => (
    <div data-testid="Merci">{String(currentType)}</div>
  ),
}));
jest.mock('@/src/features/partials/common/NewsletterPartial', () => ({
  NewsletterPartial: () => <div data-testid="Newsletter" />,
}));
jest.mock('@/src/features/headers/HeaderBackoffice', () => ({
  HeaderBackoffice: ({ title, description }: any) => (
    <div data-testid="HeaderBackoffice">
      {title}|{description}
    </div>
  ),
}));
jest.mock(
  '@/src/features/backoffice/ressources/aides-locales/CardDataInclusion',
  () => ({ CardDataInclusion: () => <div data-testid="CardDataInclusion" /> })
);
const mockAuthenticatedUser: { value: any } = { value: null };
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => mockAuthenticatedUser.value,
}));
jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: ({ onSubmit, disabled }: any) => (
    <button
      data-testid="form-submit"
      disabled={disabled}
      onClick={() =>
        onSubmit({
          recipientEmails: 'a@x.fr, b@x.fr\nc@x.fr',
          content: 'Hello world',
        })
      }
    >
      submit
    </button>
  ),
}));

import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import LinkedInCallback from '@/src/pages/auth/linkedin/callback';
import CreateMailingListPage from '@/src/pages/backoffice/admin/create-mailing-list';
import AidesLocales from '@/src/pages/backoffice/ressources/aides-locales';
import CoachCertificationPage from '@/src/pages/coach-certification/[achievementId]';
import MerciPage from '@/src/pages/merci';
import ResetPasswordPage from '@/src/pages/reset/[id]/[token]';
import { flushPromises } from '@/src/store/testUtils/flushPromises';

const mockedApi = jest.mocked(Api);
const mockUseRouter = useRouter as jest.Mock;

describe('LinkedIn callback page', () => {
  const run = (router: Record<string, unknown>) => {
    const replace = jest.fn();
    mockUseRouter.mockReturnValue({ replace, ...router });
    render(<LinkedInCallback />);
    return replace;
  };

  beforeEach(() => jest.clearAllMocks());

  it('does nothing until the router is ready', () => {
    const replace = run({ isReady: false, query: { code: 'c' } });

    expect(replace).not.toHaveBeenCalled();
    expect(mockedApi.exchangeLinkedInCode).not.toHaveBeenCalled();
  });

  it('goes to the settings with an error when LinkedIn returns an error', () => {
    const replace = run({ isReady: true, query: { error: 'denied' } });

    expect(replace).toHaveBeenCalledWith(
      '/backoffice/parametres?linkedin=error'
    );
    expect(mockedApi.exchangeLinkedInCode).not.toHaveBeenCalled();
  });

  it('goes to the settings with an error when the code is missing', () => {
    const replace = run({ isReady: true, query: {} });

    expect(replace).toHaveBeenCalledWith(
      '/backoffice/parametres?linkedin=error'
    );
  });

  it('exchanges the code and goes to the settings when connected', async () => {
    mockedApi.exchangeLinkedInCode.mockResolvedValue({ data: {} } as any);
    const replace = run({ isReady: true, query: { code: 'c', state: 's' } });
    await act(flushPromises);

    expect(mockedApi.exchangeLinkedInCode).toHaveBeenCalledWith('c', 's');
    expect(replace).toHaveBeenCalledWith(
      '/backoffice/parametres?linkedin=connected'
    );
  });

  it('returns to the pending profile share after the exchange', async () => {
    mockedApi.exchangeLinkedInCode.mockResolvedValue({
      data: { pendingShare: 'user-9' },
    } as any);
    const replace = run({ isReady: true, query: { code: 'c', state: 's' } });
    await act(flushPromises);

    expect(replace).toHaveBeenCalledWith(
      '/backoffice/profile/user-9?linkedinJustConnected=true'
    );
  });

  it('goes to the settings with an error when the exchange fails', async () => {
    mockedApi.exchangeLinkedInCode.mockRejectedValue(new Error('boom'));
    const replace = run({ isReady: true, query: { code: 'c', state: 's' } });
    await act(flushPromises);

    expect(replace).toHaveBeenCalledWith(
      '/backoffice/parametres?linkedin=error'
    );
  });
});

describe('reset password page', () => {
  it('renders the form with the props of the URL', () => {
    render(<ResetPasswordPage valid id="1" token="t" isCreation />);

    expect(screen.getByTestId('ResetPassword').textContent).toBe(
      JSON.stringify({ valid: true, id: '1', token: 't', isCreation: true })
    );
  });

  it('defaults isCreation to false', () => {
    render(
      <ResetPasswordPage
        valid={false}
        id="1"
        token="t"
        isCreation={undefined as unknown as boolean}
      />
    );

    expect(screen.getByTestId('ResetPassword').textContent).toContain(
      '"isCreation":false'
    );
  });

  it('getInitialProps flags a valid token', async () => {
    mockedApi.getResetUserToken.mockResolvedValue({} as any);

    const props = await (ResetPasswordPage as any).getInitialProps({
      query: { id: '1', token: 't', isCreation: 'true' },
    });

    expect(mockedApi.getResetUserToken).toHaveBeenCalledWith('1', 't');
    expect(props).toEqual({
      valid: true,
      id: '1',
      token: 't',
      isCreation: 'true',
    });
  });

  it('getInitialProps flags an invalid token', async () => {
    mockedApi.getResetUserToken.mockRejectedValue(new Error('expired'));

    const props = await (ResetPasswordPage as any).getInitialProps({
      query: { id: '1', token: 't' },
    });

    expect(props.valid).toBe(false);
  });
});

describe('coach certification page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the certificate with the member name in the title', () => {
    render(
      <CoachCertificationPage
        achievement={{ firstName: 'Ada', lastName: 'Lovelace' } as any}
      />
    );

    expect(screen.getByTestId('layout').getAttribute('data-title')).toBe(
      'Certificat Ada Lovelace - Entourage Pro'
    );
    expect(screen.getByTestId('CoachCertificate').textContent).toBe('Ada');
  });

  it('shows an unavailable message without achievement', () => {
    render(<CoachCertificationPage achievement={null} />);

    expect(screen.getByText("Ce certificat n'est pas disponible")).toBeTruthy();
    expect(screen.queryByTestId('CoachCertificate')).toBeNull();
  });

  it('getInitialProps loads the achievement of the URL', async () => {
    mockedApi.getPublicAchievementById.mockResolvedValue({
      data: { firstName: 'Ada' },
    } as any);

    const props = await (CoachCertificationPage as any).getInitialProps({
      query: { achievementId: ['a1', 'a2'] },
    });

    expect(mockedApi.getPublicAchievementById).toHaveBeenCalledWith('a1');
    expect(props).toEqual({ achievement: { firstName: 'Ada' } });
  });

  it('getInitialProps returns no achievement without id', async () => {
    const props = await (CoachCertificationPage as any).getInitialProps({
      query: {},
    });

    expect(props).toEqual({ achievement: null });
    expect(mockedApi.getPublicAchievementById).not.toHaveBeenCalled();
  });

  it('getInitialProps returns no achievement when the API fails', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApi.getPublicAchievementById.mockRejectedValue(new Error('404'));

    const props = await (CoachCertificationPage as any).getInitialProps({
      query: { achievementId: 'a1' },
    });

    expect(props).toEqual({ achievement: null });
    error.mockRestore();
  });
});

describe('thank you page', () => {
  it('passes the type of the URL to the message', () => {
    mockUseRouter.mockReturnValue({ query: { type: 'newsletter' } });
    render(<MerciPage />);

    expect(screen.getByTestId('Merci').textContent).toBe('newsletter');
    expect(screen.getByTestId('Newsletter')).toBeTruthy();
  });
});

describe('local aids page', () => {
  it('shows candidate wording for a candidate', () => {
    mockAuthenticatedUser.value = { role: UserRoles.CANDIDATE };
    render(<AidesLocales />);

    expect(screen.getByTestId('HeaderBackoffice').textContent).toContain(
      'Trouvez des aides près de chez vous'
    );
    expect(screen.getByTestId('CardDataInclusion')).toBeTruthy();
  });

  it('shows the default wording for other roles', () => {
    mockAuthenticatedUser.value = { role: UserRoles.COACH };
    render(<AidesLocales />);

    expect(screen.getByTestId('HeaderBackoffice').textContent).toContain(
      'Identifiez des services'
    );
  });

  it('shows the default wording without user', () => {
    mockAuthenticatedUser.value = null;
    render(<AidesLocales />);

    expect(screen.getByTestId('HeaderBackoffice').textContent).toContain(
      'Identifiez des services'
    );
  });
});

describe('create mailing list page', () => {
  beforeEach(() => jest.clearAllMocks());

  it('splits the recipients and shows a success message', async () => {
    mockedApi.postMailingList.mockResolvedValue({} as any);
    render(<CreateMailingListPage />);

    fireEvent.click(screen.getByTestId('form-submit'));
    await act(flushPromises);

    expect(mockedApi.postMailingList).toHaveBeenCalledWith({
      recipientEmails: ['a@x.fr', 'b@x.fr', 'c@x.fr'],
      content: 'Hello world',
    });
    expect(screen.getByText(/créée avec succès/)).toBeTruthy();
    expect(screen.queryByTestId('form-submit')).toBeNull();
  });

  it('shows the API error message on failure and keeps the form', async () => {
    mockedApi.postMailingList.mockRejectedValue({
      response: { data: { message: 'Emails invalides' } },
    });
    render(<CreateMailingListPage />);

    fireEvent.click(screen.getByTestId('form-submit'));
    await act(flushPromises);

    expect(screen.getByText('Emails invalides')).toBeTruthy();
    expect(screen.getByTestId('form-submit')).toBeTruthy();
  });

  it('falls back to a generic error message', async () => {
    mockedApi.postMailingList.mockRejectedValue(new Error('network'));
    render(<CreateMailingListPage />);

    fireEvent.click(screen.getByTestId('form-submit'));
    await act(flushPromises);

    expect(screen.getByText(/Une erreur inattendue est survenue/)).toBeTruthy();
  });

  it('disables the form while submitting', async () => {
    let resolve: (v: unknown) => void = () => {};
    mockedApi.postMailingList.mockReturnValue(
      new Promise((r) => {
        resolve = r;
      }) as any
    );
    render(<CreateMailingListPage />);

    fireEvent.click(screen.getByTestId('form-submit'));

    expect(
      (screen.getByTestId('form-submit') as HTMLButtonElement).disabled
    ).toBe(true);
    expect(screen.getByText(/en cours de soumission/)).toBeTruthy();
    await act(async () => {
      resolve({});
      await flushPromises();
    });
  });
});
