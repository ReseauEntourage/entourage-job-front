jest.mock('next/router', () => ({ useRouter: jest.fn() }));

jest.mock('@/src/components/layouts/LayoutBackOffice', () => ({
  LayoutBackOffice: ({ title, children }: any) => (
    <div data-testid="layout" data-title={title}>
      {children}
    </div>
  ),
}));

jest.mock(
  '@/src/features/backoffice/network-directory/NetworkDirectory',
  () => ({
    NetworkDirectory: () => <div data-testid="NetworkDirectory" />,
  })
);
jest.mock(
  '@/src/features/backoffice/network-directory/hooks/useNetworkDirectoryRedirection',
  () => ({ useNetworkDirectoryRedirection: jest.fn() })
);
jest.mock(
  '@/src/features/backoffice/admin/help-groups/HelpGroupAdminList',
  () => ({
    HelpGroupAdminList: () => <div data-testid="HelpGroupAdminList" />,
  })
);
jest.mock('@/src/features/backoffice/admin/reports', () => ({
  ReportTargetList: () => <div data-testid="ReportTargetList" />,
  ReportTargetPage: (props: any) => (
    <div data-testid="ReportTargetPage">
      {JSON.stringify({
        targetType: props.targetType,
        targetId: props.targetId,
        openResolve: props.openResolve,
      })}
      <button onClick={props.onResolveOpened}>resolve-opened</button>
    </div>
  ),
}));
jest.mock(
  '@/src/features/backoffice/events/EventDirectory/EventDirectory',
  () => ({
    EventDirectory: () => <div data-testid="EventDirectory" />,
  })
);
jest.mock('@/src/features/backoffice/help-groups/HelpGroupList', () => ({
  HelpGroupsCatalog: () => <div data-testid="HelpGroupsCatalog" />,
}));
jest.mock('@/src/features/backoffice/messaging', () => ({
  Messaging: () => <div data-testid="Messaging" />,
}));
jest.mock('@/src/features/backoffice/parameters/Parameters', () => ({
  Parameters: () => <div data-testid="Parameters" />,
}));
jest.mock(
  '@/src/features/backoffice/referer/RefererCandidatesList/RefererCandidatesList',
  () => ({
    RefererCandidatesList: () => <div data-testid="RefererCandidatesList" />,
  })
);
jest.mock('@/src/features/backoffice/ressources/formations/Formations', () => ({
  Formations: () => <div data-testid="Formations" />,
}));
jest.mock('@/src/features/notifications-center/NotificationsPage', () => ({
  NotificationsPage: () => <div data-testid="NotificationsPage" />,
}));
jest.mock('@/src/features/backoffice/checkin/CheckinFlow/CheckinFlow', () => ({
  CheckinFlow: ({ conversationId }: any) => (
    <div data-testid="CheckinFlow">{conversationId}</div>
  ),
}));
jest.mock('@/src/features/backoffice/help-groups/HelpGroupPage', () => ({
  HelpGroupPage: ({ slug, highlightEmails }: any) => (
    <div data-testid="HelpGroupPage">
      {JSON.stringify({ slug, highlightEmails })}
    </div>
  ),
}));

import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { useNetworkDirectoryRedirection } from '@/src/features/backoffice/network-directory/hooks/useNetworkDirectoryRedirection';
import HelpGroupsAdmin from '@/src/pages/backoffice/admin/groupes';
import ReportsAdmin from '@/src/pages/backoffice/admin/signalements';
import ReportTargetAdmin from '@/src/pages/backoffice/admin/signalements/[targetType]/[targetId]';
import Annuaire from '@/src/pages/backoffice/annuaire';
import PageCheckin from '@/src/pages/backoffice/checkin/[conversationId]';
import EventList from '@/src/pages/backoffice/events';
import HelpGroups from '@/src/pages/backoffice/groupes';
import HelpGroup from '@/src/pages/backoffice/groupes/[slug]';
import Messages from '@/src/pages/backoffice/messaging';
import Notifications from '@/src/pages/backoffice/notifications';
import Parametres from '@/src/pages/backoffice/parametres';
import RefererCandidatesPage from '@/src/pages/backoffice/referer/candidates';
import FormationsPage from '@/src/pages/backoffice/ressources/formations';

const mockUseRouter = useRouter as jest.Mock;

describe('simple backoffice layout pages', () => {
  const cases: [string, React.ComponentType, string, string][] = [
    [
      'admin groups',
      HelpGroupsAdmin,
      'Gestion des groupes',
      'HelpGroupAdminList',
    ],
    ['admin reports', ReportsAdmin, 'Signalements', 'ReportTargetList'],
    ['events', EventList, 'Liste des événements', 'EventDirectory'],
    ['groups', HelpGroups, 'Groupes', 'HelpGroupsCatalog'],
    ['messaging', Messages, 'Messagerie', 'Messaging'],
    ['notifications', Notifications, 'Notifications', 'NotificationsPage'],
    ['parameters', Parametres, 'Paramètres', 'Parameters'],
    [
      'referer candidates',
      RefererCandidatesPage,
      'Suivi de vos candidats orientés',
      'RefererCandidatesList',
    ],
    ['formations', FormationsPage, 'Formations', 'Formations'],
  ];

  cases.forEach(([name, Page, title, testId]) => {
    it(`${name} page renders its feature inside the back office layout`, () => {
      render(<Page />);

      expect(screen.getByTestId('layout').getAttribute('data-title')).toBe(
        title
      );
      expect(screen.getByTestId(testId)).toBeTruthy();
    });
  });

  it('annuaire page runs the network directory redirection and renders the directory', () => {
    render(<Annuaire />);

    expect(useNetworkDirectoryRedirection).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('NetworkDirectory')).toBeTruthy();
  });
});

describe('checkin page', () => {
  it('renders the checkin flow for the conversation of the URL', () => {
    mockUseRouter.mockReturnValue({ query: { conversationId: 'conv-1' } });
    render(<PageCheckin />);

    expect(screen.getByTestId('layout').getAttribute('data-title')).toBe(
      'Bilan de conversation'
    );
    expect(screen.getByTestId('CheckinFlow').textContent).toBe('conv-1');
  });

  it('renders nothing but the layout without a conversation id', () => {
    mockUseRouter.mockReturnValue({ query: {} });
    render(<PageCheckin />);

    expect(screen.queryByTestId('CheckinFlow')).toBeNull();
  });

  it('ignores a repeated query param', () => {
    mockUseRouter.mockReturnValue({ query: { conversationId: ['a', 'b'] } });
    render(<PageCheckin />);

    expect(screen.queryByTestId('CheckinFlow')).toBeNull();
  });
});

describe('help group page', () => {
  it('passes the slug and highlights emails when emails=1', () => {
    mockUseRouter.mockReturnValue({ query: { slug: 'g1', emails: '1' } });
    render(<HelpGroup />);

    expect(screen.getByTestId('HelpGroupPage').textContent).toBe(
      JSON.stringify({ slug: 'g1', highlightEmails: true })
    );
  });

  it('does not highlight emails by default and defaults the slug to empty', () => {
    mockUseRouter.mockReturnValue({ query: {} });
    render(<HelpGroup />);

    expect(screen.getByTestId('HelpGroupPage').textContent).toBe(
      JSON.stringify({ slug: '', highlightEmails: false })
    );
  });
});

describe('admin report target page', () => {
  it('shows a loading screen until the router is ready', () => {
    mockUseRouter.mockReturnValue({
      isReady: false,
      query: { targetType: 'MESSAGE', targetId: 't1' },
    });
    render(<ReportTargetAdmin />);

    expect(screen.queryByTestId('ReportTargetPage')).toBeNull();
  });

  it('shows a loading screen when the target is incomplete', () => {
    mockUseRouter.mockReturnValue({
      isReady: true,
      query: { targetType: 'MESSAGE' },
    });
    render(<ReportTargetAdmin />);

    expect(screen.queryByTestId('ReportTargetPage')).toBeNull();
  });

  it('renders the target page and opens the resolve dialog when action=resolve', () => {
    mockUseRouter.mockReturnValue({
      isReady: true,
      query: { targetType: 'MESSAGE', targetId: 't1', action: 'resolve' },
    });
    render(<ReportTargetAdmin />);

    expect(screen.getByTestId('ReportTargetPage').textContent).toContain(
      JSON.stringify({
        targetType: 'MESSAGE',
        targetId: 't1',
        openResolve: true,
      })
    );
  });

  it('drops the action query param once the resolve dialog is opened', () => {
    const replace = jest.fn();
    mockUseRouter.mockReturnValue({
      isReady: true,
      pathname: '/backoffice/admin/signalements/[targetType]/[targetId]',
      replace,
      query: { targetType: 'MESSAGE', targetId: 't1', action: 'resolve' },
    });
    render(<ReportTargetAdmin />);

    fireEvent.click(screen.getByText('resolve-opened'));

    expect(replace).toHaveBeenCalledWith(
      {
        pathname: '/backoffice/admin/signalements/[targetType]/[targetId]',
        query: { targetType: 'MESSAGE', targetId: 't1' },
      },
      undefined,
      { shallow: true }
    );
  });

  it('does not touch the URL when there is no action to drop', () => {
    const replace = jest.fn();
    mockUseRouter.mockReturnValue({
      isReady: true,
      replace,
      query: { targetType: 'MESSAGE', targetId: 't1' },
    });
    render(<ReportTargetAdmin />);

    fireEvent.click(screen.getByText('resolve-opened'));

    expect(replace).not.toHaveBeenCalled();
  });
});
