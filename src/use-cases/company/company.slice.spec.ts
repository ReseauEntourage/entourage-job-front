// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { CompaniesFilters, CompanyWithUsers } from '@/src/api/types';
import { COMPANIES_LIMIT } from '@/src/constants';
import { slice } from './company.slice';

const { actions, reducer } = slice;

const buildCompany = (overrides: Partial<CompanyWithUsers> = {}) =>
  ({
    id: 'company-1',
    name: 'Acme',
    ...overrides,
  }) as CompanyWithUsers;

const buildFilters = (overrides: Partial<CompaniesFilters> = {}) =>
  ({
    departments: [],
    businessSectorIds: [],
    onlyWithReferent: false,
    ...overrides,
  }) as CompaniesFilters;

describe('company slice', () => {
  describe('fetchCompaniesSucceeded', () => {
    it('replaces the companies list when offset is 0', () => {
      const initialState = {
        ...slice.getInitialState(),
        companiesOffset: 0,
        companies: [buildCompany({ id: 'stale' })],
      };
      const companies = [buildCompany({ id: 'company-1' })];

      const state = reducer(
        initialState,
        actions.fetchCompaniesSucceeded(companies)
      );

      expect(state.companies).toEqual(companies);
    });

    it('appends to the companies list when offset is greater than 0', () => {
      const existing = [buildCompany({ id: 'company-1' })];
      const initialState = {
        ...slice.getInitialState(),
        companiesOffset: COMPANIES_LIMIT,
        companies: existing,
      };
      const nextPage = [buildCompany({ id: 'company-2' })];

      const state = reducer(
        initialState,
        actions.fetchCompaniesSucceeded(nextPage)
      );

      expect(state.companies).toEqual([...existing, ...nextPage]);
    });

    it('marks companiesHasFetchedAll true when the page is smaller than the limit', () => {
      const state = reducer(
        undefined,
        actions.fetchCompaniesSucceeded([buildCompany()])
      );

      expect(state.companiesHasFetchedAll).toBe(true);
    });

    it('marks companiesHasFetchedAll false when the page is full', () => {
      const fullPage = Array.from({ length: COMPANIES_LIMIT }, (_, i) =>
        buildCompany({ id: `company-${i}` })
      );

      const state = reducer(
        undefined,
        actions.fetchCompaniesSucceeded(fullPage)
      );

      expect(state.companiesHasFetchedAll).toBe(false);
    });
  });

  it('fetchSelectedCompanySucceeded sets selectedCompany', () => {
    const company = buildCompany();

    const state = reducer(
      undefined,
      actions.fetchSelectedCompanySucceeded(company)
    );

    expect(state.selectedCompany).toEqual(company);
  });

  it('fetchSelectedCompanyWithCollaboratorsSucceeded sets selectedCompanyWithCollaborators', () => {
    const company = buildCompany();

    const state = reducer(
      undefined,
      actions.fetchSelectedCompanyWithCollaboratorsSucceeded(company)
    );

    expect(state.selectedCompanyWithCollaborators).toEqual(company);
  });

  it('setSelectedCompanyId sets the selected company id', () => {
    const state = reducer(undefined, actions.setSelectedCompanyId('company-1'));

    expect(state.selectedCompanyId).toBe('company-1');
  });

  it('setSelectedCompanyId can clear the selected company id', () => {
    const initialState = {
      ...slice.getInitialState(),
      selectedCompanyId: 'company-1',
    };

    const state = reducer(initialState, actions.setSelectedCompanyId(null));

    expect(state.selectedCompanyId).toBeNull();
  });

  it('resetCompaniesOffset resets pagination state', () => {
    const initialState = {
      ...slice.getInitialState(),
      companiesOffset: COMPANIES_LIMIT * 2,
      companiesHasFetchedAll: true,
      companies: [buildCompany()],
    };

    const state = reducer(initialState, actions.resetCompaniesOffset());

    expect(state.companiesOffset).toBe(0);
    expect(state.companiesHasFetchedAll).toBe(false);
    expect(state.companies).toEqual([]);
  });

  it('fetchCompaniesWithFilters does not mutate state', () => {
    const initialState = slice.getInitialState();

    const state = reducer(
      initialState,
      actions.fetchCompaniesWithFilters(buildFilters())
    );

    expect(state).toEqual(initialState);
  });

  it('fetchCompaniesNextPage does not mutate state (guard + increment now live in company.listeners.ts)', () => {
    const initialState = slice.getInitialState();

    const state = reducer(
      initialState,
      actions.fetchCompaniesNextPage(buildFilters())
    );

    expect(state).toEqual(initialState);
  });

  it('incrementCompaniesOffset increments the offset by the page limit', () => {
    const initialState = { ...slice.getInitialState(), companiesOffset: 0 };

    const state = reducer(initialState, actions.incrementCompaniesOffset());

    expect(state.companiesOffset).toBe(COMPANIES_LIMIT);
  });
});
