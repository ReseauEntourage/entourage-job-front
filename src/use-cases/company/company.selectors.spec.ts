// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { CompanyWithUsers } from '@/src/api/types';
import {
  selectCompanies,
  selectCompaniesHasFetchedAll,
  selectCompaniesOffset,
  selectSelectedCompany,
  selectSelectedCompanyId,
  selectSelectedCompanyWithCollaborators,
} from './company.selectors';
import { RootState, slice } from './company.slice';

const buildCompany = (overrides: Partial<CompanyWithUsers> = {}) =>
  ({
    id: 'company-1',
    name: 'Acme',
    ...overrides,
  }) as CompanyWithUsers;

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    company: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

describe('company.selectors', () => {
  it('selectSelectedCompanyId returns the selected company id', () => {
    expect(
      selectSelectedCompanyId(buildState({ selectedCompanyId: 'company-1' }))
    ).toBe('company-1');
  });

  it('selectSelectedCompany returns the selected company', () => {
    const company = buildCompany();
    expect(
      selectSelectedCompany(buildState({ selectedCompany: company }))
    ).toEqual(company);
  });

  it('selectSelectedCompanyWithCollaborators returns the selected company with collaborators', () => {
    const company = buildCompany();
    expect(
      selectSelectedCompanyWithCollaborators(
        buildState({ selectedCompanyWithCollaborators: company })
      )
    ).toEqual(company);
  });

  it('selectCompanies returns the companies list', () => {
    const companies = [buildCompany()];
    expect(selectCompanies(buildState({ companies }))).toEqual(companies);
  });

  it('selectCompaniesHasFetchedAll returns the pagination flag', () => {
    expect(
      selectCompaniesHasFetchedAll(buildState({ companiesHasFetchedAll: true }))
    ).toBe(true);
    expect(
      selectCompaniesHasFetchedAll(
        buildState({ companiesHasFetchedAll: false })
      )
    ).toBe(false);
  });

  it('selectCompaniesOffset returns the current pagination offset', () => {
    expect(selectCompaniesOffset(buildState({ companiesOffset: 25 }))).toBe(25);
  });
});
