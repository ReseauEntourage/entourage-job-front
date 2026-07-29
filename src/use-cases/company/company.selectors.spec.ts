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
import { slice } from './company.slice';

const buildCompany = (overrides: Partial<CompanyWithUsers> = {}) =>
  ({
    id: 'company-1',
    name: 'Acme',
    ...overrides,
  }) as CompanyWithUsers;

// `as any`: these selectors only read `state.company.*`, but the module's
// exported `RootState` type also requires the shared `api` reducer key (for
// the RTK-Query-backed status selectors in the same file) — not relevant here.
const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): any => ({
  company: { ...slice.getInitialState(), ...overrides },
});

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
