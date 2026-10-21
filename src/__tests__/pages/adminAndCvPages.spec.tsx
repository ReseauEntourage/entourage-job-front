import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import MembersAdmin from '@/src/pages/backoffice/admin/membres';
import MemberPage from '@/src/pages/backoffice/admin/membres/[memberId]';
import OrganizationsAdmin from '@/src/pages/backoffice/admin/structures';
import HelpGroupDiscussionPage from '@/src/pages/backoffice/groupes/[slug]/discussions/[discussionId]';
import CVPage from '@/src/pages/cv/[userId]';

jest.mock('@/src/api');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
  withRouter: (Component: any) => {
    const Wrapped = (props: any) => (
      <Component {...props} router={{ asPath: '/cv/john' }} />
    );
    Wrapped.getInitialProps = Component.getInitialProps;
    return Wrapped;
  },
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/queryParams/useMemberId', () => ({
  useMemberId: jest.fn(),
}));
jest.mock('@/src/hooks/queryParams/useTab', () => ({ useTab: jest.fn() }));
jest.mock('@/src/hooks/useFilters', () => ({
  useFilters: jest.fn(() => ({
    filters: { f: 1 },
    setFilters: jest.fn(),
    search: 'q',
    setSearch: jest.fn(),
    resetFilters: jest.fn(),
  })),
}));
jest.mock('@/src/components/layouts/Layout', () => ({
  Layout: ({ title, metaTitle, metaDescription, metaImage, children }: any) => (
    <div
      data-testid="layout"
      data-title={title}
      data-meta-title={metaTitle}
      data-meta-description={metaDescription}
      data-meta-image={metaImage}
    >
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
jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading" />,
}));
jest.mock('@/src/features/backoffice/admin/members/MemberList', () => ({
  MemberList: ({ search, filters }: any) => (
    <div data-testid="MemberList">{JSON.stringify({ search, filters })}</div>
  ),
}));
jest.mock(
  '@/src/features/backoffice/admin/organizations/OrganizationList',
  () => ({
    OrganizationList: () => <div data-testid="OrganizationList" />,
  })
);
jest.mock('@/src/features/backoffice/admin/members/MemberDetails', () => ({
  MemberDetails: ({ user, setUser }: any) => (
    <button data-testid="MemberDetails" onClick={() => setUser({ id: 'new' })}>
      {user.id}
    </button>
  ),
}));
jest.mock('@/src/components/ui/BackLink', () => ({
  BackLink: () => <span>back</span>,
}));
jest.mock('@/src/features/partials/CV/PageCVContent', () => ({
  PageCVContent: ({ publicCV }: any) => (
    <div data-testid="PageCVContent">{publicCV.firstName}</div>
  ),
}));
jest.mock('@/src/features/partials/CV/CVList', () => ({
  CVList: () => <div data-testid="CVList" />,
}));
jest.mock('@/src/features/partials/common/NewsletterPartial', () => ({
  NewsletterPartial: () => <div data-testid="newsletter" />,
}));
jest.mock('@/src/features/backoffice/help-groups/HelpGroupDiscussion', () => ({
  parseModerationLinkAction: (v: unknown) => (v ? `parsed:${v}` : null),
  HelpGroupDiscussion: (props: any) => (
    <div data-testid="discussion">
      {JSON.stringify({
        slug: props.slug,
        discussionId: props.discussionId,
        replyId: props.replyId,
        moderationAction: props.moderationAction,
      })}
      <button onClick={props.onModerationActionConsumed}>consume</button>
    </div>
  ),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUser = useAuthenticatedUser as jest.Mock;

describe('admin members page', () => {
  const replace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser.mockReturnValue({ id: 'admin', zone: 'PARIS' });
  });

  it('redirects to the candidate role and the admin zone when no valid role is in the URL', () => {
    mockUseRouter.mockReturnValue({ replace, query: { foo: 'bar' } });
    render(<MembersAdmin />);

    expect(replace).toHaveBeenCalledWith(
      {
        pathname: '/backoffice/admin/membres',
        query: { foo: 'bar', role: [UserRoles.CANDIDATE], zone: 'PARIS' },
      },
      undefined,
      { shallow: true }
    );
    expect(screen.getByTestId('MemberList')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Gestion des membres'
    );
  });

  it('omits the zone from the default query for an admin without zone', () => {
    mockUser.mockReturnValue({ id: 'admin' });
    mockUseRouter.mockReturnValue({ replace, query: {} });
    render(<MembersAdmin />);

    expect(replace.mock.calls[0][0].query).toEqual({
      role: [UserRoles.CANDIDATE],
    });
  });
});

describe('admin organizations page', () => {
  const replace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser.mockReturnValue({ id: 'admin', zone: 'LYON' });
  });

  it('defaults the zone filter to the admin zone when none is selected', () => {
    mockUseRouter.mockReturnValue({ replace, query: {} });
    render(<OrganizationsAdmin />);

    expect(replace).toHaveBeenCalledWith(
      { pathname: '/backoffice/admin/structures', query: { zone: 'LYON' } },
      undefined,
      { shallow: true }
    );
    expect(screen.getByTestId('OrganizationList')).toBeInTheDocument();
  });

  it('does not redirect when a zone is already in the URL', () => {
    mockUseRouter.mockReturnValue({ replace, query: { zone: 'PARIS' } });
    render(<OrganizationsAdmin />);

    expect(replace).not.toHaveBeenCalled();
  });
});

describe('admin member page', () => {
  const { useMemberId } = jest.requireMock(
    '@/src/hooks/queryParams/useMemberId'
  );
  const { useTab } = jest.requireMock('@/src/hooks/queryParams/useTab');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    useMemberId.mockReturnValue('m1');
    useTab.mockReturnValue('general');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows a loader, then the member details once fetched', async () => {
    (Api.getUserById as jest.Mock).mockResolvedValue({ data: { id: 'm1' } });
    render(<MemberPage />);

    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Chargement - Gestion des membres'
    );
    expect(await screen.findByTestId('MemberDetails')).toHaveTextContent('m1');
    expect(Api.getUserById).toHaveBeenCalledWith('m1');
    expect(Api.getUserById).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('MemberDetails'));
    expect(screen.getByTestId('MemberDetails')).toHaveTextContent('new');
  });

  it('shows the not-found layout when the member cannot be fetched', async () => {
    (Api.getUserById as jest.Mock).mockRejectedValue(new Error('404'));
    render(<MemberPage />);

    await waitFor(() =>
      expect(screen.getByTestId('layout')).toHaveAttribute(
        'data-title',
        'Page introuvable - Gestion des membres'
      )
    );
    expect(
      screen.getByText('Ce profil n’est pas disponible')
    ).toBeInTheDocument();
  });
});

describe('public CV page', () => {
  const publicCV: any = {
    id: 'u1',
    firstName: 'John',
    userProfile: { description: 'Bio', hasPicture: true },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the CV with sharing metadata', () => {
    process.env.NEXT_PUBLIC_AWSS3_URL = 'https://s3/';
    process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY = 'images/';
    render(<CVPage {...({ publicCV, exists: true } as any)} />);

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute(
      'data-meta-title',
      'Entourage Pro\xa0: Aidez John à retrouver un emploi'
    );
    expect(layout).toHaveAttribute(
      'data-meta-description',
      'Bio Aidez John à retrouver un emploi en partageant son CV !'
    );
    expect(layout).toHaveAttribute(
      'data-meta-image',
      'https://s3/images/u1.profile.jpg'
    );
    expect(screen.getByTestId('PageCVContent')).toHaveTextContent('John');
  });

  it('omits the image and description prefix when the profile has none', () => {
    render(
      <CVPage
        {...({
          publicCV: {
            ...publicCV,
            userProfile: { description: '', hasPicture: false },
          },
        } as any)}
      />
    );

    const layout = screen.getByTestId('layout');
    expect(layout).not.toHaveAttribute('data-meta-image');
    expect(layout).toHaveAttribute(
      'data-meta-description',
      'Aidez John à retrouver un emploi en partageant son CV !'
    );
  });

  it('shows a good-news page when the candidate exists but has no public CV', () => {
    render(<CVPage {...({ publicCV: null, exists: true } as any)} />);

    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Bonne nouvelle ! - Entourage Pro'
    );
    expect(screen.getByTestId('CVList')).toBeInTheDocument();
  });

  it('shows a not-found page when the candidate does not exist', () => {
    render(<CVPage {...({ publicCV: null } as any)} />);

    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Page introuvable - Entourage Pro'
    );
  });

  it('loads the CV in getInitialProps and falls back on error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    (Api.getPublicCVByUserId as jest.Mock).mockResolvedValueOnce({
      data: publicCV,
    });
    const { getInitialProps } = CVPage as any;

    expect(await getInitialProps({ query: { userId: 'u1' } })).toEqual({
      publicCV,
      exists: true,
    });
    expect(Api.getPublicCVByUserId).toHaveBeenCalledWith('u1');

    (Api.getPublicCVByUserId as jest.Mock).mockRejectedValueOnce(
      new Error('boom')
    );
    expect(await getInitialProps({ query: { userId: 'u1' } })).toEqual({
      publicCV: null,
      exists: false,
    });
    consoleError.mockRestore();
  });
});

describe('help group discussion page', () => {
  const replace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('reads slug, discussion and reply from the query', () => {
    mockUseRouter.mockReturnValue({
      query: { slug: 's', discussionId: 'd', replyId: 'r', moderation: 'hide' },
      replace,
      pathname: '/p',
    });
    render(<HelpGroupDiscussionPage />);

    expect(screen.getByTestId('discussion')).toHaveTextContent(
      '{"slug":"s","discussionId":"d","replyId":"r","moderationAction":"parsed:hide"}'
    );
  });

  it('falls back to empty strings and a null reply for missing or array params', () => {
    mockUseRouter.mockReturnValue({
      query: { slug: ['a', 'b'] },
      replace,
      pathname: '/p',
    });
    render(<HelpGroupDiscussionPage />);

    expect(screen.getByTestId('discussion')).toHaveTextContent(
      '{"slug":"","discussionId":"","replyId":null,"moderationAction":null}'
    );
  });

  it('drops the moderation param once it has been consumed', () => {
    mockUseRouter.mockReturnValue({
      query: { slug: 's', discussionId: 'd', moderation: 'hide' },
      replace,
      pathname: '/p',
    });
    render(<HelpGroupDiscussionPage />);
    fireEvent.click(screen.getByText('consume'));

    expect(replace).toHaveBeenCalledWith(
      { pathname: '/p', query: { slug: 's', discussionId: 'd' } },
      undefined,
      { shallow: true }
    );
  });

  it('does nothing when there is no moderation param to drop', () => {
    mockUseRouter.mockReturnValue({
      query: { slug: 's', discussionId: 'd' },
      replace,
      pathname: '/p',
    });
    render(<HelpGroupDiscussionPage />);
    fireEvent.click(screen.getByText('consume'));

    expect(replace).not.toHaveBeenCalled();
  });
});
