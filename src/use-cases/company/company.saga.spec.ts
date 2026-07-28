jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { CompaniesFilters } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import { slice } from './company.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

const buildFilters = (overrides: Partial<CompaniesFilters> = {}) =>
  ({
    departments: [],
    businessSectorIds: [],
    onlyWithReferent: false,
    ...overrides,
  }) as CompaniesFilters;

describe('company saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchCompaniesRequested', () => {
    it('stores the returned companies on success', async () => {
      const store = createTestStore();
      const companies = [{ id: 'company-1' }] as any;
      mockedApi.getAllCompanies.mockResolvedValue({ data: companies } as any);

      store.dispatch(actions.fetchCompaniesRequested(buildFilters()));
      await flushPromises();

      expect(store.getState().company.companies).toEqual(companies);
      expect(store.getState().company.fetchCompanies.status).toBe('SUCCEEDED');
    });

    it('dispatches fetchCompaniesFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getAllCompanies.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchCompaniesRequested(buildFilters()));
      await flushPromises();

      expect(store.getState().company.fetchCompanies.status).toBe('FAILED');
    });
  });

  describe('fetchCompaniesWithFilters', () => {
    it('resets pagination and fetches companies with the given filters', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          companiesOffset: 50,
          companiesHasFetchedAll: true,
        },
      });
      const companies = [{ id: 'company-1' }] as any;
      mockedApi.getAllCompanies.mockResolvedValue({ data: companies } as any);

      store.dispatch(
        actions.fetchCompaniesWithFilters(buildFilters({ search: 'acme' }))
      );
      await flushPromises();

      expect(store.getState().company.companiesOffset).toBe(0);
      expect(store.getState().company.companies).toEqual(companies);
      expect(mockedApi.getAllCompanies).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'acme', offset: 0 })
      );
    });
  });

  describe('fetchCompaniesNextPage', () => {
    it('fetches the next page when not all companies were fetched and no fetch is in flight', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          companiesHasFetchedAll: false,
        },
      });
      mockedApi.getAllCompanies.mockResolvedValue({ data: [] } as any);

      store.dispatch(actions.fetchCompaniesNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllCompanies).toHaveBeenCalled();
    });

    it('does nothing when all companies have already been fetched', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          companiesHasFetchedAll: true,
        },
      });

      store.dispatch(actions.fetchCompaniesNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllCompanies).not.toHaveBeenCalled();
    });

    it('does nothing when a fetch is already in flight', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          companiesHasFetchedAll: false,
          fetchCompanies: { status: 'REQUESTED' as any },
        },
      });

      store.dispatch(actions.fetchCompaniesNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllCompanies).not.toHaveBeenCalled();
    });
  });

  describe('fetchSelectedCompanyRequested', () => {
    it('stores the selected company on success', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          selectedCompanyId: 'company-1',
        },
      });
      const company = { id: 'company-1' } as any;
      mockedApi.getCompanyById.mockResolvedValue({ data: company } as any);

      store.dispatch(actions.fetchSelectedCompanyRequested());
      await flushPromises();

      expect(store.getState().company.selectedCompany).toEqual(company);
    });

    it('dispatches fetchSelectedCompanyFailed when there is no selected company id', async () => {
      const store = createTestStore();

      store.dispatch(actions.fetchSelectedCompanyRequested());
      await flushPromises();

      expect(mockedApi.getCompanyById).not.toHaveBeenCalled();
      expect(store.getState().company.fetchSelectedCompany.status).toBe(
        'FAILED'
      );
    });
  });

  describe('fetchSelectedCompanyWithCollaboratorsRequested', () => {
    it('stores the result on success', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          selectedCompanyId: 'company-1',
        },
      });
      const company = { id: 'company-1', users: [] } as any;
      mockedApi.getCompanyByIdWithUsersAndPendingInvitations.mockResolvedValue({
        data: company,
      } as any);

      store.dispatch(actions.fetchSelectedCompanyWithCollaboratorsRequested());
      await flushPromises();

      expect(store.getState().company.selectedCompanyWithCollaborators).toEqual(
        company
      );
    });

    it('notifies on failure', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          selectedCompanyId: 'company-1',
        },
      });
      mockedApi.getCompanyByIdWithUsersAndPendingInvitations.mockRejectedValue(
        new Error('boom')
      );

      store.dispatch(actions.fetchSelectedCompanyWithCollaboratorsRequested());
      await flushPromises();

      expect(
        store.getState().company.fetchSelectedCompanyWithCollaborators.status
      ).toBe('FAILED');
      expect(store.getState().notifications.notifications).toHaveLength(1);
    });
  });

  describe('inviteCollaboratorsRequested', () => {
    it('notifies, re-fetches the selected company and the current user on success', async () => {
      seedAccessToken('token-123');
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          selectedCompanyId: 'company-1',
        },
      });
      mockedApi.inviteCollaboratorsFromCompany.mockResolvedValue({} as any);
      mockedApi.getCompanyByIdWithUsersAndPendingInvitations.mockResolvedValue({
        data: { id: 'company-1' },
      } as any);
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);

      store.dispatch(
        actions.inviteCollaboratorsRequested({
          companyId: 'company-1',
          emails: ['a@example.com'],
        })
      );
      await flushPromises();

      expect(store.getState().company.inviteCollaborators.status).toBe(
        'SUCCEEDED'
      );
      expect(store.getState().notifications.notifications).toHaveLength(1);
      expect(store.getState().company.selectedCompanyWithCollaborators).toEqual(
        { id: 'company-1' }
      );
      expect(store.getState().currentUser.user).toEqual({ id: 'user-1' });
    });

    it('notifies of the failure and does not re-fetch on rejection', async () => {
      const store = createTestStore();
      mockedApi.inviteCollaboratorsFromCompany.mockRejectedValue(
        new Error('boom')
      );

      store.dispatch(
        actions.inviteCollaboratorsRequested({
          companyId: 'company-1',
          emails: ['a@example.com'],
        })
      );
      await flushPromises();

      expect(store.getState().company.inviteCollaborators.status).toBe(
        'FAILED'
      );
      expect(store.getState().notifications.notifications).toHaveLength(1);
    });
  });

  describe('updateCompanyLogoRequested', () => {
    it('succeeds when the upload resolves', async () => {
      const store = createTestStore();
      mockedApi.updateCompanyLogo.mockResolvedValue({} as any);

      store.dispatch(
        actions.updateCompanyLogoRequested({
          companyId: 'company-1',
          logoFile: new File([], 'logo.png'),
        })
      );
      await flushPromises();

      expect(store.getState().company.updateCompanyLogo.status).toBe(
        'SUCCEEDED'
      );
    });

    it('fails when the upload rejects', async () => {
      const store = createTestStore();
      mockedApi.updateCompanyLogo.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateCompanyLogoRequested({
          companyId: 'company-1',
          logoFile: new File([], 'logo.png'),
        })
      );
      await flushPromises();

      expect(store.getState().company.updateCompanyLogo.status).toBe('FAILED');
    });
  });

  describe('updateCompanyRequested', () => {
    it('notifies and re-fetches the current user on success', async () => {
      seedAccessToken('token-123');
      const store = createTestStore();
      mockedApi.updateCompany.mockResolvedValue({} as any);
      mockedApi.getCurrentIdentity.mockResolvedValue({
        data: { id: 'user-1' },
      } as any);

      store.dispatch(
        actions.updateCompanyRequested({ companyData: { name: 'Acme' } })
      );
      await flushPromises();

      expect(store.getState().company.updateCompany.status).toBe('SUCCEEDED');
      expect(store.getState().currentUser.user).toEqual({ id: 'user-1' });
      expect(store.getState().notifications.notifications).toHaveLength(1);
    });

    it('notifies of the failure when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.updateCompany.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateCompanyRequested({ companyData: { name: 'Acme' } })
      );
      await flushPromises();

      expect(store.getState().company.updateCompany.status).toBe('FAILED');
      expect(store.getState().notifications.notifications).toHaveLength(1);
    });
  });
});
