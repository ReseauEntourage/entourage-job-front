import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { CV_FILTERS_DATA } from '@/src/constants';
import { CVList } from '../CVList';

jest.mock('@/src/api');
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));
jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <span>loading</span>,
}));
jest.mock('@/src/features/candidat-card', () => ({
  CandidatCard: (props: {
    firstName: string;
    imgSrc?: string;
    url: string;
  }) => (
    <div data-testid="candidate" data-img={props.imgSrc} data-url={props.url}>
      {props.firstName}
    </div>
  ),
}));
jest.mock('@/src/features/filters/SearchBar/SearchBar', () => ({
  SearchBar: ({ placeholder }: { placeholder: string }) => (
    <span data-testid="search-bar">{placeholder}</span>
  ),
}));

const getList = Api.getPublicCVsList as jest.Mock;

const cv = (id: string, firstName: string, hasPicture = false) => ({
  id,
  firstName,
  userProfile: { hasPicture, sectorOccupations: [] },
});

describe('CVList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('shows a loader then the candidates', async () => {
    getList.mockResolvedValue({ data: [cv('1', 'Marie'), cv('2', 'Paul')] });
    render(<CVList />);
    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(await screen.findByText('Marie')).toBeInTheDocument();
    expect(screen.getByText('Paul')).toBeInTheDocument();
    expect(getList).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 9, offset: 0 })
    );
  });

  it('builds the picture url only for candidates with a picture', async () => {
    getList.mockResolvedValue({
      data: [cv('1', 'Marie', true), cv('2', 'Paul', false)],
    });
    render(<CVList />);
    await screen.findByText('Marie');
    const [marie, paul] = screen.getAllByTestId('candidate');
    expect(marie.getAttribute('data-img')).toContain('1.profile.jpg');
    expect(paul).not.toHaveAttribute('data-img');
  });

  it('drops candidates without a complete profile', async () => {
    getList.mockResolvedValue({
      data: [
        cv('1', 'Marie'),
        { id: '2', firstName: 'Sans', userProfile: {} },
        null,
      ],
    });
    render(<CVList />);
    await screen.findByText('Marie');
    expect(screen.queryByText('Sans')).not.toBeInTheDocument();
  });

  it('passes the search term to the API', async () => {
    getList.mockResolvedValue({ data: [cv('1', 'Marie')] });
    render(<CVList search="cuisine" />);
    await screen.findByText('Marie');
    expect(getList).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'cuisine' })
    );
  });

  it('uses the requested number of items and hides "Voir plus"', async () => {
    getList.mockResolvedValue({ data: [cv('1', 'Marie')] });
    render(<CVList nb={3} />);
    await screen.findByText('Marie');
    expect(getList).toHaveBeenCalledWith(expect.objectContaining({ limit: 3 }));
    expect(screen.queryByText(/Voir plus/)).not.toBeInTheDocument();
  });

  it('offers to load more when not limited', async () => {
    getList.mockResolvedValue({ data: [cv('1', 'Marie')] });
    render(<CVList />);
    await screen.findByText('Marie');
    expect(
      screen.getByRole('button', { name: /Voir plus/ })
    ).toBeInTheDocument();
  });

  it('asks the API for the next page when "Voir plus" is clicked', async () => {
    getList.mockResolvedValue({ data: [cv('1', 'Marie')] });
    render(<CVList />);
    await screen.findByText('Marie');
    getList.mockClear();
    fireEvent.click(screen.getByRole('button', { name: /Voir plus/ }));
    await waitFor(() => expect(getList).toHaveBeenCalled());
    expect(getList.mock.calls[0][0].offset).toBeGreaterThan(0);
  });

  it('shows an empty message when there is no result', async () => {
    getList.mockResolvedValue({ data: [] });
    render(<CVList />);
    expect(
      await screen.findByText('Aucun profil correspondat trouvé')
    ).toBeInTheDocument();
  });

  it('suggests contacting the team when no result in a chosen area', async () => {
    getList.mockResolvedValue({ data: [] });
    const locationKey = CV_FILTERS_DATA[1].key;
    render(
      <CVList
        filters={{ [locationKey]: [{ value: 'x', label: 'x' }] } as never}
      />
    );
    expect(
      await screen.findByText(/Vous ne trouvez pas de candidats/)
    ).toBeInTheDocument();
  });

  it('shows an error when the API fails', async () => {
    getList.mockRejectedValue(new Error('boom'));
    render(<CVList />);
    expect(
      await screen.findByText('Impossible de récupérer les CVs.')
    ).toBeInTheDocument();
  });

  it('shows an error on an invalid payload', async () => {
    getList.mockResolvedValue({ data: null });
    render(<CVList />);
    expect(
      await screen.findByText('Format de données invalide')
    ).toBeInTheDocument();
  });

  it('shows the search bar unless hidden', async () => {
    getList.mockResolvedValue({ data: [cv('1', 'Marie')] });
    const { rerender } = render(<CVList />);
    await screen.findByText('Marie');
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    rerender(<CVList hideSearchBar />);
    expect(screen.queryByTestId('search-bar')).not.toBeInTheDocument();
  });
});
