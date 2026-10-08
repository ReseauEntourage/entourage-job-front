import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { HelpGroupPage as HelpGroupPageData } from '@/src/api/types';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { HelpGroupPage } from '../HelpGroupPage';
import { buildGroupPage } from '../__fixtures__/help-groups.fixtures';

const mockUpdateEmails = jest.fn();
const mockUseUpdateEmails = jest.fn();

jest.mock('@/src/use-cases/help-groups', () => ({
  ...jest.requireActual('@/src/use-cases/help-groups'),
  useGetHelpGroupQuery: jest.fn(),
  useGetHelpGroupDiscussionsInfiniteQuery: () => ({
    data: { pages: [{ items: [], nextCursor: null }] },
    isLoading: false,
    isFetching: false,
    isFetchingNextPage: false,
    isError: false,
    hasNextPage: false,
    fetchNextPage: jest.fn(),
    refetch: jest.fn(),
  }),
  useUpdateHelpGroupEmailsMutation: () => mockUseUpdateEmails(),
}));

jest.mock('@/src/use-cases/current-user', () => ({
  ...jest.requireActual('@/src/use-cases/current-user'),
  selectCurrentUser: () => ({
    id: 'viewer-1',
    firstName: 'Julien',
    role: 'Candidat',
  }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/backoffice/groupes/refaire-un-cv',
    push: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  }),
}));

jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

// eslint-disable-next-line import-x/order
import { useGetHelpGroupQuery } from '@/src/use-cases/help-groups';

const renderPage = (
  groupProps: Partial<HelpGroupPageData> = {},
  highlightEmails = false
) => {
  (useGetHelpGroupQuery as jest.Mock).mockReturnValue({
    data: buildGroupPage(groupProps),
    isLoading: false,
  });
  return renderWithProviders(
    <HelpGroupPage slug="refaire-un-cv" highlightEmails={highlightEmails} />
  );
};

describe('Help group emails setting', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateEmails.mockResolvedValue({ data: { emailsEnabled: false } });
    mockUseUpdateEmails.mockReturnValue([
      mockUpdateEmails,
      { isLoading: false },
    ]);
  });

  it('is disabled while a change is saved', () => {
    mockUseUpdateEmails.mockReturnValue([
      mockUpdateEmails,
      { isLoading: true },
    ]);
    renderPage();
    expect(
      screen.getByRole('switch', { name: 'Emails de ce groupe' })
    ).toBeDisabled();
  });

  it('is absent for a non member', () => {
    renderPage({
      isMember: false,
      emailsEnabled: null,
      viewerPermissions: {
        state: 'mustJoin',
        charterAccepted: false,
      },
    });
    expect(screen.queryByTestId('emails-setting')).not.toBeInTheDocument();
  });

  it('is shown to a member who cannot write yet', () => {
    renderPage({
      viewerPermissions: {
        state: 'mustCompleteElearning',
        charterAccepted: false,
      },
    });
    expect(screen.getByTestId('emails-setting')).toHaveTextContent(
      'Emails de ce groupe'
    );
  });

  it('turns the emails of the group off, then on', async () => {
    const { rerender } = renderPage({ emailsEnabled: true });
    const toggle = screen.getByRole('switch', { name: 'Emails de ce groupe' });
    expect(toggle).toBeChecked();
    fireEvent.click(toggle);
    await waitFor(() =>
      expect(mockUpdateEmails).toHaveBeenCalledWith({
        slug: 'refaire-un-cv',
        emailsEnabled: false,
      })
    );

    (useGetHelpGroupQuery as jest.Mock).mockReturnValue({
      data: buildGroupPage({ emailsEnabled: false }),
      isLoading: false,
    });
    rerender(<HelpGroupPage slug="refaire-un-cv" />);
    const off = screen.getByRole('switch', { name: 'Emails de ce groupe' });
    expect(off).not.toBeChecked();
    fireEvent.click(off);
    await waitFor(() =>
      expect(mockUpdateEmails).toHaveBeenLastCalledWith({
        slug: 'refaire-un-cv',
        emailsEnabled: true,
      })
    );
  });

  it('is highlighted and scrolled to from the link of the emails', () => {
    renderPage({}, true);
    expect(screen.getByTestId('emails-setting')).toHaveAttribute(
      'data-highlighted',
      'true'
    );
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
