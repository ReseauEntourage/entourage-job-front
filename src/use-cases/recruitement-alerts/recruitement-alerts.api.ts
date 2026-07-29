import { Api } from '@/src/api';
import {
  PublicProfile,
  RecruitementAlert,
  RecruitementAlertDto,
} from '@/src/api/types';
import { api } from '@/src/store/api/api.slice';
import { notificationsActions } from '../notifications';
import { slice } from './recruitement-alerts.slice';

const {
  fetchRecruitementAlertsSucceeded,
  removeRecruitementAlert,
  updateRecruitementAlertSucceeded,
  fetchRecruitementAlertsAction,
  fetchRecruitementAlertMatchingAction,
} = slice.actions;

/**
 * Single global "current fetch" status, like `profiles`/`events`: the alert
 * list is never fetched concurrently for different arguments in this domain.
 */
export const FETCH_RECRUITEMENT_ALERTS_FIXED_CACHE_KEY =
  'fetchRecruitementAlerts';

export const recruitementAlertsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** Translates `fetchRecruitementAlertsSaga`. */
    fetchRecruitementAlerts: builder.mutation<RecruitementAlert[], void>({
      queryFn: async () => {
        try {
          const { data } = await Api.getRecruitementAlerts();
          return { data };
        } catch (error) {
          console.error('Error fetching recruitement alerts:', error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchRecruitementAlertsSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `createRecruitementAlertSaga`. */
    createRecruitementAlert: builder.mutation<
      RecruitementAlert,
      RecruitementAlertDto
    >({
      queryFn: async (dto) => {
        try {
          const { data } = await Api.createRecruitementAlert(dto);
          return { data };
        } catch (error) {
          console.error('Error creating recruitement alert:', error);
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: "L'alerte a été créée avec succès",
            })
          );
          // Rafraîchir la liste des alertes après la création
          dispatch(fetchRecruitementAlertsAction());
        } catch {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message:
                "Une erreur est survenue lors de la création de l'alerte",
            })
          );
        }
      },
    }),
    /** Translates `deleteRecruitementAlertSaga`. */
    deleteRecruitementAlert: builder.mutation<string, string>({
      queryFn: async (alertId) => {
        try {
          await Api.deleteRecruitementAlert(alertId);
          return { data: alertId };
        } catch (error) {
          console.error('Error deleting recruitement alert:', error);
          return { error };
        }
      },
      onQueryStarted: async (alertId, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(removeRecruitementAlert(alertId));
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: "L'alerte a été supprimée avec succès",
            })
          );
          // Rafraîchir la liste des alertes après la suppression
          dispatch(fetchRecruitementAlertsAction());
        } catch {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message:
                "Une erreur est survenue lors de la suppression de l'alerte",
            })
          );
        }
      },
    }),
    /** Translates `updateRecruitementAlertSaga`. */
    updateRecruitementAlert: builder.mutation<
      RecruitementAlert,
      { id: string; data: RecruitementAlertDto }
    >({
      queryFn: async ({ id, data }) => {
        try {
          const { data: responseData } = await Api.updateRecruitementAlert(
            id,
            data
          );
          return { data: responseData };
        } catch (error) {
          console.error('Error updating recruitement alert:', error);
          return { error };
        }
      },
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedAlert } = await queryFulfilled;
          dispatch(updateRecruitementAlertSucceeded(updatedAlert));
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message: "L'alerte a été mise à jour avec succès",
            })
          );
          // Rafraîchir la liste des alertes après la mise à jour
          dispatch(fetchRecruitementAlertsAction());
          // Rafraîchir le matching de l'alerte modifiée
          dispatch(fetchRecruitementAlertMatchingAction(id));
        } catch {
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message:
                "Une erreur est survenue lors de la mise à jour de l'alerte",
            })
          );
        }
      },
    }),
    /**
     * Translates `fetchRecruitementAlertMatchingSaga`. A genuine per-argument
     * `query` (not a fixed-cache-key mutation): each alert's matching results
     * are cached and loaded independently, unlike the other endpoints above.
     * This also fixes a latent bug in the original saga, where all alerts
     * shared one single loading flag (`fetchRecruitementAlertMatching`'s
     * `createRequestAdapter` status) even though their cached results
     * (`recruitementAlertMatchings: Record<alertId, ...>`) were already
     * stored per-alert.
     */
    fetchRecruitementAlertMatching: builder.query<PublicProfile[], string>({
      queryFn: async (alertId) => {
        try {
          const { data } = await Api.getRecruitementAlertMatching(alertId);
          return { data };
        } catch (error) {
          console.error(
            `Erreur lors de la récupération des matchings pour l'alerte ${alertId}:`,
            error
          );
          return { error };
        }
      },
    }),
  }),
});
