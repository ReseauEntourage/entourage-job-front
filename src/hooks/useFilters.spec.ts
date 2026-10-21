import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import { Filter } from '@/src/constants/utils';
import { gaEvent } from '@/src/lib/gtag';
import { useFilters } from './useFilters';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));

const mockUseRouter = useRouter as jest.Mock;
const push = jest.fn();
const NAV_OPTIONS = { shallow: true, scroll: false };

const zone: Filter = {
  key: 'zone',
  title: 'Zone',
  constants: [
    { label: 'Paris', value: 'PARIS' },
    { label: 'Lyon', value: 'LYON' },
  ],
};
const mandatory: Filter = {
  key: 'role',
  title: 'Role',
  mandatory: true,
  constants: [
    { label: 'Coach', value: 'COACH' },
    { label: 'Candidate', value: 'CANDIDATE' },
  ],
};

const setup = (
  query: Record<string, unknown>,
  filtersData = [zone],
  ...rest: [string[]?, { action: string }?]
) => {
  mockUseRouter.mockReturnValue({ push, query });
  return renderHook(() => useFilters(filtersData, '/list', ...rest));
};

describe('useFilters', () => {
  beforeEach(() => jest.clearAllMocks());

  it('resolves filters and search from the query string', () => {
    const { result } = setup({ zone: ['PARIS'], search: 'bob', page: '2' });
    expect(result.current.filters).toEqual({ zone: [zone.constants[0]] });
    expect(result.current.search).toBe('bob');
  });

  it('ignores query params listed in otherPathParams', () => {
    const { result } = setup(
      { zone: 'LYON', userId: 'u1' },
      [zone],
      ['userId']
    );
    expect(result.current.filters).toEqual({ zone: [zone.constants[1]] });
  });

  describe('setFilters', () => {
    it('pushes selected values, keeping other params and the search', () => {
      const { result } = setup({ page: '2', search: 'bob', zone: 'LYON' });
      result.current.setFilters({ zone: [zone.constants[0]] });

      expect(push).toHaveBeenCalledWith(
        {
          pathname: '/list',
          query: { page: '2', zone: ['PARIS'], search: 'bob' },
        },
        undefined,
        NAV_OPTIONS
      );
    });

    it('drops empty filters from the query', () => {
      const { result } = setup({ zone: 'LYON' });
      result.current.setFilters({ zone: [] });

      expect(push).toHaveBeenCalledWith(
        { pathname: '/list', query: {} },
        undefined,
        NAV_OPTIONS
      );
    });
  });

  describe('setSearch', () => {
    it('sets the search while keeping the other params', () => {
      const { result } = setup({ zone: 'LYON', search: 'old' });
      result.current.setSearch('new');

      expect(push).toHaveBeenCalledWith(
        { pathname: '/list', query: { zone: 'LYON', search: 'new' } },
        undefined,
        NAV_OPTIONS
      );
    });

    it('removes the search when it is emptied', () => {
      const { result } = setup({ zone: 'LYON', search: 'old' });
      result.current.setSearch('');

      expect(push).toHaveBeenCalledWith(
        { pathname: '/list', query: { zone: 'LYON' } },
        undefined,
        NAV_OPTIONS
      );
    });
  });

  describe('resetFilters', () => {
    it('clears filters but keeps the other params', () => {
      const { result } = setup({ zone: 'LYON', page: '3' });
      result.current.resetFilters();

      expect(push).toHaveBeenCalledWith(
        { pathname: '/list', query: { page: '3' } },
        undefined,
        NAV_OPTIONS
      );
      expect(gaEvent).not.toHaveBeenCalled();
    });

    it('sends the reset analytics tag when provided', () => {
      const tag = { action: 'reset' };
      const { result } = setup({ zone: 'LYON' }, [zone], undefined, tag);
      result.current.resetFilters();
      expect(gaEvent).toHaveBeenCalledWith(tag);
    });

    it('restores every value of mandatory filters', () => {
      const { result } = setup({ role: 'COACH', zone: 'LYON' }, [
        zone,
        mandatory,
      ]);
      result.current.resetFilters();

      expect(push).toHaveBeenCalledWith(
        { pathname: '/list', query: { role: ['COACH', 'CANDIDATE'] } },
        undefined,
        NAV_OPTIONS
      );
    });
  });
});
