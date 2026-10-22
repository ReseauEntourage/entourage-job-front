import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { OrganizationList } from './OrganizationList';

jest.mock('@/src/api');
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
  HeaderBackoffice: ({ title, children }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));
jest.mock('@/src/features/filters/SearchBar/SearchBar', () => ({
  SearchBar: () => <div data-testid="searchbar" />,
}));
jest.mock('../OrganizationTable', () => ({
  OrganizationTable: ({ organizations }: any) => (
    <div data-testid="table">{organizations}</div>
  ),
}));
jest.mock('../OrganizationTable/Organization', () => ({
  Organization: ({ organization, refreshOrganizations }: any) => (
    <button data-testid="organization" onClick={refreshOrganizations}>
      {organization.name}
    </button>
  ),
}));

const organizations = (n: number, start = 0) =>
  Array.from({ length: n }, (_, i) => ({
    id: `o${start + i}`,
    name: `Org${start + i}`,
  }));

const setup = (search?: string) =>
  render(
    <OrganizationList
      search={search}
      filters={{} as any}
      setFilters={jest.fn()}
      setSearch={jest.fn()}
      resetFilters={jest.fn()}
    />
  );

describe('OrganizationList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
    (Api.getAllOrganizations as jest.Mock).mockResolvedValue({
      data: organizations(2),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches the first page with the search term and lists the organizations', async () => {
    setup('asso');

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(await screen.findAllByTestId('organization')).toHaveLength(2);
    expect(Api.getAllOrganizations).toHaveBeenCalledWith({
      params: expect.objectContaining({ limit: 50, offset: 0, search: 'asso' }),
    });
    expect(screen.getByText('Gestion des structures')).toBeInTheDocument();
  });

  it('appends the next page when asked to load more', async () => {
    (Api.getAllOrganizations as jest.Mock).mockResolvedValueOnce({
      data: organizations(50),
    });
    setup();
    await waitFor(() =>
      expect(screen.getAllByTestId('organization')).toHaveLength(50)
    );

    (Api.getAllOrganizations as jest.Mock).mockResolvedValueOnce({
      data: organizations(1, 50),
    });
    fireEvent.click(screen.getByText('Voir toutes les structures'));

    await waitFor(() =>
      expect(screen.getAllByTestId('organization')).toHaveLength(51)
    );
    expect(Api.getAllOrganizations).toHaveBeenLastCalledWith({
      params: expect.objectContaining({ offset: 50 }),
    });
    expect(
      screen.queryByText('Voir toutes les structures')
    ).not.toBeInTheDocument();
  });

  it('hides the load-more button when the page is not full', async () => {
    setup();
    await screen.findAllByTestId('organization');

    expect(
      screen.queryByText('Voir toutes les structures')
    ).not.toBeInTheDocument();
  });

  it('says so when there is no organization', async () => {
    (Api.getAllOrganizations as jest.Mock).mockResolvedValue({ data: [] });
    setup();

    expect(
      await screen.findByText('Aucune structure trouvé')
    ).toBeInTheDocument();
  });

  it('shows an error message when loading fails', async () => {
    (Api.getAllOrganizations as jest.Mock).mockRejectedValue(new Error('x'));
    setup();

    expect(
      await screen.findByText(
        "Les structures n'ont pas pu etre chargés correctement."
      )
    ).toBeInTheDocument();
    expect(screen.queryByTestId('searchbar')).not.toBeInTheDocument();
  });

  it('refreshes from the creation buttons and from a row after an edit', async () => {
    setup();
    await screen.findAllByTestId('organization');

    fireEvent.click(screen.getByText('refresh'));
    await waitFor(() =>
      expect(Api.getAllOrganizations).toHaveBeenCalledTimes(2)
    );
    fireEvent.click((await screen.findAllByTestId('organization'))[0]);
    await waitFor(() =>
      expect(Api.getAllOrganizations).toHaveBeenCalledTimes(3)
    );
  });
});
