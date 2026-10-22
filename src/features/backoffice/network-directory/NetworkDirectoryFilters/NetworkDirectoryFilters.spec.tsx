import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { Api } from '@/src/api';
import {
  NetworkDirectoryEntity,
  NetworkDirectorySort,
} from '@/src/constants/network-directory';
import { UserRoles } from '@/src/constants/users';
import { useNetworkDirectoryQueryParams } from '../hooks/useNetworkDirectoryQueryParams';
import { NetworkDirectoryFilters } from './NetworkDirectoryFilters';

jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
let mockMobile = false;
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsMobile: () => mockMobile,
}));
jest.mock('../hooks/useNetworkDirectoryQueryParams', () => ({
  useNetworkDirectoryQueryParams: jest.fn(),
}));
const mockSetFilters = jest.fn();
const mockSetSearch = jest.fn();
const mockResetFilters = jest.fn();
let mockUseFiltersArgs: any[] = [];
jest.mock('@/src/hooks', () => ({
  useFilters: (...args: any[]) => {
    mockUseFiltersArgs = args;
    return {
      setFilters: mockSetFilters,
      setSearch: mockSetSearch,
      resetFilters: mockResetFilters,
    };
  },
}));
let lastSearchBarProps: any;
jest.mock('@/src/features/filters/SearchBar/SearchBar', () => ({
  SearchBar: (props: any) => {
    lastSearchBarProps = props;
    return (
      <div>
        <span data-testid="placeholder">{props.placeholder}</span>
        <button onClick={() => props.setSearch('jean')}>search</button>
        <button onClick={() => props.setSearch('')}>clear-search</button>
        <button onClick={props.resetFilters}>reset</button>
        {props.additionalButtons}
      </div>
    );
  },
}));
jest.mock('@/src/features/filters/MobileFilters', () => ({
  MobileFilterButton: ({ count, onClick }: any) => (
    <button onClick={onClick}>{`mobile-${count}`}</button>
  ),
  MobileFilterDrawer: ({ isOpen, onClose }: any) =>
    isOpen ? <button onClick={onClose}>drawer-open</button> : null,
}));

const push = jest.fn();

const baseParams = {
  entity: NetworkDirectoryEntity.USER,
  role: [UserRoles.CANDIDATE],
  departments: [],
  nudgeIds: [],
  businessSectorIds: [],
  contactTypes: [],
  sort: NetworkDirectorySort.RELEVANCE,
};

const setup = (params: Record<string, unknown> = {}) => {
  (useNetworkDirectoryQueryParams as jest.Mock).mockReturnValue({
    ...baseParams,
    ...params,
  });
  return render(<NetworkDirectoryFilters />);
};

const filterKeys = () =>
  mockUseFiltersArgs[0].map((f: { key: string }) => f.key);

describe('NetworkDirectoryFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMobile = false;
    (useRouter as jest.Mock).mockReturnValue({ push });
    (Api.getAllBusinessSectors as jest.Mock).mockResolvedValue({
      data: [{ id: 'bs1', name: 'Tech' }],
    });
    (Api.getAllDepartments as jest.Mock).mockResolvedValue({
      data: [{ id: 'd1', name: 'Paris', value: '75' }],
    });
    (Api.getAllNudges as jest.Mock).mockResolvedValue({
      data: [{ id: 'n1', value: 'interview' }],
    });
  });

  describe('data loading', () => {
    it('loads business sectors, departments and nudges into the filters', async () => {
      setup({ businessSectorIds: ['bs1'], departments: ['d1'] });

      await waitFor(() => {
        const [, constants] = [0, lastSearchBarProps.filtersConstants];
        const sectors = constants.find(
          (f: any) => f.key === 'businessSectorIds'
        );
        expect(sectors.constants).toEqual([{ label: 'Tech', value: 'bs1' }]);
      });
      expect(Api.getAllBusinessSectors).toHaveBeenCalledWith({
        limit: 50,
        offset: 0,
      });
      expect(Api.getAllDepartments).toHaveBeenCalledWith({ search: '' });
      expect(Api.getAllNudges).toHaveBeenCalledWith({ limit: 50, offset: 0 });
      const departments = lastSearchBarProps.filtersConstants.find(
        (f: any) => f.key === 'departments'
      );
      expect(departments.constants).toEqual([
        { label: 'Paris (75)', value: 'd1' },
      ]);
      expect(lastSearchBarProps.filters.departments).toEqual([
        expect.objectContaining({ value: 'd1' }),
      ]);
    });

    it('survives failures of the three requests', async () => {
      jest.spyOn(console, 'error').mockImplementation();
      (Api.getAllBusinessSectors as jest.Mock).mockRejectedValue(
        new Error('a')
      );
      (Api.getAllDepartments as jest.Mock).mockRejectedValue(new Error('b'));
      (Api.getAllNudges as jest.Mock).mockRejectedValue(new Error('c'));
      setup();

      await waitFor(() => expect(console.error).toHaveBeenCalledTimes(3));
      expect(screen.getByTestId('placeholder')).toBeInTheDocument();
    });
  });

  describe('filters per entity and role', () => {
    it('offers the user filters for candidates, without the super coach badge', () => {
      setup();

      expect(filterKeys()).toEqual([
        'departments',
        'nudgeIds',
        'businessSectorIds',
        'contactTypes',
        'isAvailable',
      ]);
      expect(screen.getByTestId('placeholder')).toHaveTextContent(
        'Rechercher par prénom, nom ou métier'
      );
    });

    it('adds the super coach badge filter for coaches', () => {
      setup({ role: [UserRoles.COACH] });

      expect(filterKeys()).toContain('hasSuperCoachBadge');
    });

    it('offers only sector and department filters for companies', () => {
      setup({ entity: NetworkDirectoryEntity.COMPANY, role: null });

      expect(filterKeys()).toEqual(['businessSectorIds', 'departments']);
      expect(screen.getByTestId('placeholder')).toHaveTextContent(
        "Rechercher par nom d'entreprise"
      );
      expect(screen.queryByText('Trier par :')).not.toBeInTheDocument();
    });

    it('renders no search bar for an unknown entity', () => {
      setup({ entity: 'other' });

      expect(screen.queryByTestId('placeholder')).not.toBeInTheDocument();
    });
  });

  describe('entity buttons', () => {
    it('switches to candidates, resetting departments', () => {
      setup({ role: [UserRoles.COACH], departments: ['d1'] });
      fireEvent.click(screen.getByText('Les candidats'));

      expect(push).toHaveBeenCalledWith({
        pathname: '/backoffice/annuaire',
        query: expect.objectContaining({
          entity: NetworkDirectoryEntity.USER,
          departments: [],
          role: [UserRoles.CANDIDATE],
        }),
      });
    });

    it('switches to coaches', () => {
      setup();
      fireEvent.click(screen.getByText('Les coachs'));

      expect(push.mock.calls[0][0].query).toEqual(
        expect.objectContaining({ role: [UserRoles.COACH] })
      );
    });

    it('switches to companies, dropping role and sort', () => {
      setup();
      fireEvent.click(screen.getByText('Les entreprises'));

      expect(push.mock.calls[0][0].query).toEqual(
        expect.objectContaining({
          entity: NetworkDirectoryEntity.COMPANY,
          role: null,
          departments: [],
          sort: undefined,
        })
      );
    });
  });

  describe('sort buttons', () => {
    it('sorts by relevance', () => {
      setup({ sort: NetworkDirectorySort.LAST_CONNECTION });
      fireEvent.click(screen.getByText('Pertinence'));

      expect(push.mock.calls[0][0].query.sort).toBe(
        NetworkDirectorySort.RELEVANCE
      );
    });

    it('sorts by last connection', () => {
      setup();
      fireEvent.click(screen.getByText('Dernière connexion'));

      expect(push.mock.calls[0][0].query.sort).toBe(
        NetworkDirectorySort.LAST_CONNECTION
      );
    });
  });

  describe('user search', () => {
    it('pushes the search term in the URL and falls back to last connection sort when sorted by relevance', () => {
      setup();
      fireEvent.click(screen.getByText('search'));

      expect(push).toHaveBeenCalledWith(
        {
          pathname: '/backoffice/annuaire',
          query: expect.objectContaining({
            search: 'jean',
            sort: NetworkDirectorySort.LAST_CONNECTION,
          }),
        },
        undefined,
        { shallow: true, scroll: false }
      );
    });

    it('keeps the sort when it is not relevance', () => {
      setup({ sort: NetworkDirectorySort.LAST_CONNECTION });
      fireEvent.click(screen.getByText('search'));

      expect(push.mock.calls[0][0].query.sort).toBe(
        NetworkDirectorySort.LAST_CONNECTION
      );
    });

    it('clears the search term and keeps the relevance sort when the search is emptied', () => {
      setup({ search: 'jean' });
      fireEvent.click(screen.getByText('clear-search'));

      expect(push.mock.calls[0][0].query).toEqual(
        expect.objectContaining({
          search: undefined,
          sort: NetworkDirectorySort.RELEVANCE,
        })
      );
    });

    it('uses the generic search setter for companies', () => {
      setup({ entity: NetworkDirectoryEntity.COMPANY });
      fireEvent.click(screen.getByText('search'));

      expect(mockSetSearch).toHaveBeenCalledWith('jean');
      expect(push).not.toHaveBeenCalled();
    });

    it('resets the filters through the search bar', () => {
      setup();
      fireEvent.click(screen.getByText('reset'));

      expect(mockResetFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('applied filters', () => {
    it('maps availability and super coach flags to their filter entries', () => {
      setup({
        role: [UserRoles.COACH],
        isAvailable: true,
        hasSuperCoachBadge: true,
      });

      expect(lastSearchBarProps.filters.isAvailable).toHaveLength(1);
      expect(lastSearchBarProps.filters.hasSuperCoachBadge).toHaveLength(1);
      expect(lastSearchBarProps.filters.sort).toHaveLength(1);
    });

    it('has no entry for unset flags', () => {
      setup({ sort: undefined });

      expect(lastSearchBarProps.filters.isAvailable).toEqual([]);
      expect(lastSearchBarProps.filters.hasSuperCoachBadge).toEqual([]);
      expect(lastSearchBarProps.filters.sort).toEqual([]);
    });
  });

  describe('mobile', () => {
    it('shows no mobile filter button on desktop', () => {
      setup();

      expect(screen.queryByText(/^mobile-/)).not.toBeInTheDocument();
    });

    it('counts applied filters, opens and closes the drawer', () => {
      mockMobile = true;
      setup({ isAvailable: true });

      // availability + sort
      fireEvent.click(screen.getByText('mobile-2'));
      expect(screen.getByText('drawer-open')).toBeInTheDocument();
      act(() => {
        fireEvent.click(screen.getByText('drawer-open'));
      });
      expect(screen.queryByText('drawer-open')).not.toBeInTheDocument();
    });
  });
});
