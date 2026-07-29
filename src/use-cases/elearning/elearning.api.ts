import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import {
  ElearningCompletion,
  ElearningUnit,
} from '@/src/features/backoffice/elearning/elearning.types';
import { api } from '@/src/store/api/api.slice';
import { currentUserActions } from '@/src/use-cases/current-user';

export const elearningApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** Translates `fetchElearningUnitsRequestedSaga`. */
    getElearningUnits: builder.query<ElearningUnit[], UserRoles>({
      queryFn: async (role) => {
        try {
          const { data } = await Api.getAllElearningUnits({
            limit: 10,
            offset: 0,
            role,
          });
          return { data };
        } catch (error) {
          console.error('Error fetching elearning units:', error);
          return { error };
        }
      },
    }),
    /**
     * Translates `postElearningCompletionRequestedSaga`. `role` is only used
     * to target the right `getElearningUnits` cache entry to patch on
     * success (the API call itself only needs `unitId`) — it isn't part of
     * the request.
     */
    postElearningCompletion: builder.mutation<
      ElearningCompletion,
      { unitId: string; role: UserRoles }
    >({
      queryFn: async ({ unitId }) => {
        try {
          const { data } = await Api.postElearningCompletion(unitId);
          return { data };
        } catch (error) {
          console.error('Error posting elearning completion:', error);
          return { error };
        }
      },
      onQueryStarted: async ({ role }, { dispatch, queryFulfilled }) => {
        try {
          const { data: completion } = await queryFulfilled;
          dispatch(
            elearningApi.util.updateQueryData(
              'getElearningUnits',
              role,
              (draft) => {
                const unit = draft.find(
                  (candidate) => candidate.id === completion.unitId
                );
                if (unit) {
                  unit.userCompletions = [
                    ...unit.userCompletions.filter(
                      (existing) => existing.unitId !== completion.unitId
                    ),
                    completion,
                  ];
                }
              }
            )
          );
          dispatch(currentUserActions.fetchUserRequested());
        } catch {
          // Non-critical: silently ignore failures so the UI is not affected
        }
      },
    }),
  }),
});

export const { useGetElearningUnitsQuery, usePostElearningCompletionMutation } =
  elearningApi;
