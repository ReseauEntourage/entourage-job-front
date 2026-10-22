import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import { MemberList } from './MemberList';

jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading" />,
}));
jest.mock('@/src/features/backoffice/admin/AdminCreationButtons', () => ({
  AdminCreationButtons: ({ refreshList }: any) => (
    <button onClick={refreshList}>refresh</button>
  ),
}));
jest.mock('@/src/features/headers/HeaderBackoffice', () => ({
  HeaderBackoffice: ({ title, description, children }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));
jest.mock('@/src/features/filters/SearchBar/SearchBar', () => ({
  SearchBar: ({ filtersConstants, search }: any) => (
    <div data-testid="searchbar">
      {`${search}|${filtersConstants.map((f: any) => f.key).join(',')}`}
    </div>
  ),
}));
jest.mock('../MemberTable', () => ({
  MemberTable: ({ columns, members }: any) => (
    <div data-testid="table" data-columns={columns.join(',')}>
      {members}
    </div>
  ),
}));
jest.mock('../MemberTable/Member', () => ({
  Member: ({ member }: any) => (
    <div data-testid="member">{member.firstName}</div>
  ),
}));

const members = (n: number, start = 0) =>
  Array.from({ length: n }, (_, i) => ({
    id: `m${start + i}`,
    firstName: `M${start + i}`,
  }));

const setup = (
  role: string | null = UserRoles.CANDIDATE,
  search?: string,
  filters = {}
) => {
  (useRouter as jest.Mock).mockReturnValue({
    query: { role: role ?? undefined },
  });
  return render(
    <MemberList
      search={search}
      filters={filters as any}
      setFilters={jest.fn()}
      setSearch={jest.fn()}
      resetFilters={jest.fn()}
    />
  );
};

describe('MemberList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
    (Api.getUsersMembers as jest.Mock).mockResolvedValue({ data: members(2) });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does not fetch without a role', async () => {
    setup(null);

    expect(Api.getUsersMembers).not.toHaveBeenCalled();
  });

  it('fetches the first page of the selected role with the search term', async () => {
    setup(UserRoles.COACH, 'jean');

    await screen.findAllByTestId('member');
    expect(Api.getUsersMembers).toHaveBeenCalledWith({
      params: expect.objectContaining({
        limit: 50,
        offset: 0,
        role: UserRoles.COACH,
        query: 'jean',
      }),
    });
    expect(screen.getByText('Gestion des coachs')).toBeInTheDocument();
  });

  [
    [UserRoles.CANDIDATE, 'Gestion des candidats', 'zone,lastConnection'],
    [UserRoles.COACH, 'Gestion des coachs', 'zone,lastConnection'],
    [
      UserRoles.REFERER,
      'Gestion des prescripteurs',
      'organization,zone,countRefered,lastConnection',
    ],
  ].forEach(([role, title, columns]) => {
    it(`titles the page and picks the table columns for ${role}`, async () => {
      setup(role);

      expect(await screen.findByText(title)).toBeInTheDocument();
      await screen.findAllByTestId('member');
      expect(screen.getByTestId('table')).toHaveAttribute(
        'data-columns',
        columns
      );
    });
  });

  it('offers only the zone filter to referers and more filters to candidates', async () => {
    const { unmount } = setup(UserRoles.REFERER);
    await screen.findAllByTestId('member');
    expect(screen.getByTestId('searchbar')).toHaveTextContent('undefined|zone');
    unmount();

    setup(UserRoles.CANDIDATE);
    await screen.findAllByTestId('member');
    expect(screen.getByTestId('searchbar').textContent).toMatch(/zone,\w+/);
  });

  it('shows a loading screen while fetching', async () => {
    setup();

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await screen.findAllByTestId('member');
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('offers to load more when a full page was returned, appending the next page', async () => {
    (Api.getUsersMembers as jest.Mock).mockResolvedValueOnce({
      data: members(50),
    });
    setup();
    await waitFor(() =>
      expect(screen.getAllByTestId('member')).toHaveLength(50)
    );

    (Api.getUsersMembers as jest.Mock).mockResolvedValueOnce({
      data: members(3, 50),
    });
    fireEvent.click(screen.getByText(/Voir tous les/));

    await waitFor(() =>
      expect(screen.getAllByTestId('member')).toHaveLength(53)
    );
    expect(Api.getUsersMembers).toHaveBeenLastCalledWith({
      params: expect.objectContaining({ offset: 50 }),
    });
    expect(screen.queryByText(/Voir tous les/)).not.toBeInTheDocument();
  });

  it('does not offer to load more when the page is not full', async () => {
    setup();
    await screen.findAllByTestId('member');

    expect(screen.queryByText(/Voir tous les/)).not.toBeInTheDocument();
  });

  it('says so when no member matches', async () => {
    (Api.getUsersMembers as jest.Mock).mockResolvedValue({ data: [] });
    setup();

    expect(await screen.findByText('Aucun membre trouvé')).toBeInTheDocument();
  });

  it('shows an error message instead of the list when loading fails', async () => {
    (Api.getUsersMembers as jest.Mock).mockRejectedValue(new Error('x'));
    setup();

    expect(
      await screen.findByText(
        "Les membres n'ont pas pu etre chargés correctement."
      )
    ).toBeInTheDocument();
    expect(screen.queryByTestId('searchbar')).not.toBeInTheDocument();
  });

  it('reloads the first page when the creation buttons ask for a refresh', async () => {
    setup();
    await screen.findAllByTestId('member');

    fireEvent.click(screen.getByText('refresh'));

    await waitFor(() => expect(Api.getUsersMembers).toHaveBeenCalledTimes(2));
    expect(Api.getUsersMembers).toHaveBeenLastCalledWith({
      params: expect.objectContaining({ offset: 0 }),
    });
  });
});
