jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { CompaniesFilters, CompanyWithUsers } from '@/src/api/types';
import { COMPANIES_LIMIT, ReduxRequestEvents } from '@/src/constants';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import {
  fetchCompaniesSelectors,
  fetchSelectedCompanySelectors,
  selectIsFetchCompanyWithCollaboratorsSelectors,
  selectCompanies,
  selectCompaniesOffset,
  selectSelectedCompany,
  selectSelectedCompanyWithCollaborators,
  updateCompanyLogoSelectors,
} from './company.selectors';
import { slice } from './company.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

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

describe('company api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCompaniesWithFilters -> fetchCompaniesRequested', () => {
    it('resets the offset then fetches and stores the companies list', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          companiesOffset: COMPANIES_LIMIT,
          companies: [buildCompany({ id: 'stale' })],
        },
      });
      const companies = [buildCompany()];
      mockedApi.getAllCompanies.mockResolvedValue({ data: companies } as any);

      store.dispatch(actions.fetchCompaniesWithFilters(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllCompanies).toHaveBeenCalledWith(
        expect.objectContaining({ offset: 0, limit: COMPANIES_LIMIT })
      );
      expect(selectCompanies(store.getState())).toEqual(companies);
      expect(
        fetchCompaniesSelectors.selectIsFetchCompaniesFailed(store.getState())
      ).toBe(false);
    });
  });

  describe('fetchCompaniesNextPage', () => {
    it('increments the offset and fetches the next page when the previous fetch succeeded', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          companiesHasFetchedAll: false,
        },
      });
      // A full page (== COMPANIES_LIMIT), so `fetchCompaniesSucceeded` does
      // not mark `companiesHasFetchedAll` true after this first fetch.
      mockedApi.getAllCompanies.mockResolvedValue({
        data: Array.from({ length: COMPANIES_LIMIT }, (_, i) =>
          buildCompany({ id: `company-${i}` })
        ),
      } as any);

      // First page (populates the fixed-cache-key mutation's SUCCEEDED status)
      store.dispatch(actions.fetchCompaniesRequested(buildFilters()));
      await flushPromises();

      store.dispatch(actions.fetchCompaniesNextPage(buildFilters()));
      await flushPromises();

      expect(selectCompaniesOffset(store.getState())).toBe(COMPANIES_LIMIT);
      expect(mockedApi.getAllCompanies).toHaveBeenCalledTimes(2);
      expect(mockedApi.getAllCompanies).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: COMPANIES_LIMIT })
      );
    });

    it('does not fetch when all companies are already fetched', async () => {
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
  });

  describe('fetchSelectedCompanyRequested', () => {
    it('fetches the company identified by selectedCompanyId', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          selectedCompanyId: 'company-1',
        },
      });
      const company = buildCompany();
      mockedApi.getCompanyById.mockResolvedValue({ data: company } as any);

      store.dispatch(actions.fetchSelectedCompanyRequested());
      await flushPromises();

      expect(mockedApi.getCompanyById).toHaveBeenCalledWith('company-1');
      expect(selectSelectedCompany(store.getState())).toEqual(company);
      expect(
        fetchSelectedCompanySelectors.selectIsFetchSelectedCompanyRequested(
          store.getState()
        )
      ).toBe(false);
    });

    it('does not fetch when no company is selected (listener effect asserts and throws internally)', async () => {
      const store = createTestStore();

      store.dispatch(actions.fetchSelectedCompanyRequested());
      await flushPromises();

      expect(mockedApi.getCompanyById).not.toHaveBeenCalled();
    });
  });

  describe('fetchSelectedCompanyWithCollaboratorsRequested', () => {
    it('fetches the company with its collaborators', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          selectedCompanyId: 'company-1',
        },
      });
      const company = buildCompany();
      mockedApi.getCompanyByIdWithUsersAndPendingInvitations.mockResolvedValue({
        data: company,
      } as any);

      store.dispatch(actions.fetchSelectedCompanyWithCollaboratorsRequested());
      await flushPromises();

      expect(
        mockedApi.getCompanyByIdWithUsersAndPendingInvitations
      ).toHaveBeenCalledWith('company-1');
      expect(selectSelectedCompanyWithCollaborators(store.getState())).toEqual(
        company
      );
    });

    it('notifies a danger message when the fetch rejects', async () => {
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
        selectIsFetchCompanyWithCollaboratorsSelectors.selectIsFetchSelectedCompanyWithCollaboratorsRequested(
          store.getState()
        )
      ).toBe(false);
      expect(store.getState().notifications.notifications).toEqual([
        expect.objectContaining({
          type: 'danger',
          message:
            "Une erreur s'est produite lors de la récupération des collaborateurs de l'entreprise",
        }),
      ]);
    });
  });

  describe('updateCompanyLogoRequested', () => {
    it('uploads the logo as form data', async () => {
      const store = createTestStore();
      mockedApi.updateCompanyLogo.mockResolvedValue({} as any);
      const logoFile = new File(['logo'], 'logo.png');

      store.dispatch(
        actions.updateCompanyLogoRequested({
          companyId: 'company-1',
          logoFile,
        })
      );
      await flushPromises();

      expect(mockedApi.updateCompanyLogo).toHaveBeenCalledTimes(1);
      const formData = mockedApi.updateCompanyLogo.mock.calls[0][0];
      expect(formData.get('file')).toBe(logoFile);
      expect(
        updateCompanyLogoSelectors.selectUpdateCompanyLogoStatus(
          store.getState()
        )
      ).toBe(ReduxRequestEvents.SUCCEEDED);
    });

    it('reports a failed status when the upload rejects', async () => {
      const store = createTestStore();
      mockedApi.updateCompanyLogo.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateCompanyLogoRequested({
          companyId: 'company-1',
          logoFile: new File(['logo'], 'logo.png'),
        })
      );
      await flushPromises();

      expect(
        updateCompanyLogoSelectors.selectUpdateCompanyLogoStatus(
          store.getState()
        )
      ).toBe(ReduxRequestEvents.FAILED);
    });
  });

  describe('updateCompanyRequested', () => {
    it('updates the company, refreshes the current user, and notifies success', async () => {
      const store = createTestStore();
      mockedApi.updateCompany.mockResolvedValue({} as any);

      store.dispatch(
        actions.updateCompanyRequested({
          companyData: { description: 'New description' },
        })
      );
      await flushPromises();

      expect(mockedApi.updateCompany).toHaveBeenCalledWith({
        description: 'New description',
      });
      expect(store.getState().notifications.notifications).toEqual([
        expect.objectContaining({
          type: 'success',
          message: 'Votre entreprise a bien été mise à jour',
        }),
      ]);
    });

    it('notifies a generic error message when the update rejects', async () => {
      const store = createTestStore();
      mockedApi.updateCompany.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.updateCompanyRequested({ companyData: {} }));
      await flushPromises();

      expect(store.getState().notifications.notifications).toEqual([
        expect.objectContaining({
          type: 'danger',
          message: 'Une erreur est survenue',
        }),
      ]);
    });
  });

  describe('inviteCollaboratorsRequested', () => {
    it('sends the invitations and notifies success, without refetching collaborators when no company is selected', async () => {
      const store = createTestStore();
      mockedApi.inviteCollaboratorsFromCompany.mockResolvedValue({} as any);

      store.dispatch(
        actions.inviteCollaboratorsRequested({
          companyId: 'company-1',
          emails: ['a@example.com', 'b@example.com'],
        })
      );
      await flushPromises();

      expect(mockedApi.inviteCollaboratorsFromCompany).toHaveBeenCalledWith(
        'company-1',
        { emails: ['a@example.com', 'b@example.com'] }
      );
      expect(
        mockedApi.getCompanyByIdWithUsersAndPendingInvitations
      ).not.toHaveBeenCalled();
      expect(store.getState().notifications.notifications).toEqual([
        expect.objectContaining({
          type: 'success',
          message: 'Toutes les invitations ont été envoyées avec succès.',
        }),
      ]);
    });

    it('refetches the collaborators when a company is currently selected', async () => {
      const store = createTestStore({
        company: {
          ...slice.getInitialState(),
          selectedCompanyId: 'company-1',
        },
      });
      mockedApi.inviteCollaboratorsFromCompany.mockResolvedValue({} as any);
      mockedApi.getCompanyByIdWithUsersAndPendingInvitations.mockResolvedValue({
        data: buildCompany(),
      } as any);

      store.dispatch(
        actions.inviteCollaboratorsRequested({
          companyId: 'company-1',
          emails: ['a@example.com'],
        })
      );
      await flushPromises();

      expect(
        mockedApi.getCompanyByIdWithUsersAndPendingInvitations
      ).toHaveBeenCalledWith('company-1');
    });

    it('notifies an error message when sending invitations rejects', async () => {
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

      expect(store.getState().notifications.notifications).toEqual([
        expect.objectContaining({
          type: 'danger',
          message: "Une erreur est survenue lors de l'envoi des invitations",
        }),
      ]);
    });
  });
});
