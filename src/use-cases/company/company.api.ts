import { Api } from '@/src/api';
import {
  CompaniesFilters,
  CompanyWithUsers,
  UpdateCompanyDto,
} from '@/src/api/types';
import { COMPANIES_LIMIT } from '@/src/constants';
import { api } from '@/src/store/api/api.slice';
import { currentUserActions } from '../current-user';
import { notificationsActions } from '../notifications';
import { RootState, slice } from './company.slice';

const {
  fetchCompaniesSucceeded,
  fetchSelectedCompanySucceeded,
  fetchSelectedCompanyWithCollaboratorsSucceeded,
  fetchSelectedCompanyWithCollaboratorsRequested,
} = slice.actions;

export const FETCH_COMPANIES_FIXED_CACHE_KEY = 'fetchCompanies';
export const FETCH_SELECTED_COMPANY_FIXED_CACHE_KEY = 'fetchSelectedCompany';
export const FETCH_SELECTED_COMPANY_WITH_COLLABORATORS_FIXED_CACHE_KEY =
  'fetchSelectedCompanyWithCollaborators';
export const UPDATE_COMPANY_LOGO_FIXED_CACHE_KEY = 'updateCompanyLogo';
export const UPDATE_COMPANY_FIXED_CACHE_KEY = 'updateCompany';
export const INVITE_COLLABORATORS_FIXED_CACHE_KEY = 'inviteCollaborators';

export const companyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** Translates `fetchCompaniesRequestedSaga`. */
    fetchCompanies: builder.mutation<
      CompanyWithUsers[],
      CompaniesFilters & { offset: number }
    >({
      queryFn: async ({
        search,
        departments,
        businessSectorIds,
        onlyWithReferent,
        offset,
      }) => {
        try {
          const response = await Api.getAllCompanies({
            search,
            departments,
            businessSectorIds,
            limit: COMPANIES_LIMIT,
            offset,
            onlyWithReferent,
          });
          return { data: response.data };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchCompaniesSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchSelectedCompanySaga`. */
    fetchSelectedCompany: builder.mutation<
      CompanyWithUsers,
      { companyId: string }
    >({
      queryFn: async ({ companyId }) => {
        try {
          const { data } = await Api.getCompanyById(companyId);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchSelectedCompanySucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchSelectedCompanyWithCollaboratorsSaga`. */
    fetchSelectedCompanyWithCollaborators: builder.mutation<
      CompanyWithUsers,
      { companyId: string }
    >({
      queryFn: async ({ companyId }) => {
        try {
          const { data } =
            await Api.getCompanyByIdWithUsersAndPendingInvitations(companyId);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchSelectedCompanyWithCollaboratorsSucceeded(data));
        } catch {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message:
                "Une erreur s'est produite lors de la récupération des collaborateurs de l'entreprise",
            })
          );
        }
      },
    }),
    /** Translates `updateCompanyLogoRequestedSaga`. */
    updateCompanyLogo: builder.mutation<
      void,
      { companyId: string; logoFile: File }
    >({
      queryFn: async ({ logoFile }) => {
        try {
          const formData = new FormData();
          formData.append('file', logoFile);
          await Api.updateCompanyLogo(formData);
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
    }),
    /** Translates `updateCompanyRequestedSaga`. */
    updateCompany: builder.mutation<
      void,
      { companyData: Partial<UpdateCompanyDto> }
    >({
      queryFn: async ({ companyData }) => {
        try {
          await Api.updateCompany(companyData);
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(currentUserActions.fetchUserRequested());
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: `Votre entreprise a bien été mise à jour`,
            })
          );
        } catch {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: 'Une erreur est survenue',
            })
          );
        }
      },
    }),
    /** Translates `inviteCollaboratorsRequestedSaga`. */
    inviteCollaborators: builder.mutation<
      void,
      { companyId: string; emails: string[] }
    >({
      queryFn: async ({ companyId, emails }) => {
        try {
          await Api.inviteCollaboratorsFromCompany(companyId, { emails });
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, getState, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: 'Toutes les invitations ont été envoyées avec succès.',
            })
          );
          const selectedCompanyId = (getState() as unknown as RootState).company
            .selectedCompanyId;
          if (selectedCompanyId) {
            dispatch(fetchSelectedCompanyWithCollaboratorsRequested());
          }
          dispatch(currentUserActions.fetchUserRequested());
        } catch {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message: `Une erreur est survenue lors de l'envoi des invitations`,
            })
          );
        }
      },
    }),
  }),
});
