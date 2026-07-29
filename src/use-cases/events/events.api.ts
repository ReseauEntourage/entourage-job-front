import { Api } from '@/src/api';
import { Event, EventWithParticipants } from '@/src/api/types';
import { EVENTS_LIMIT } from '@/src/constants';
import {
  EventMode,
  EventType,
  PublicSensibilise,
} from '@/src/constants/events';
import { EventDirectoryFilters } from '@/src/features/backoffice/events/EventDirectory/useEventDirectoryQueryParams';
import { api } from '@/src/store/api/api.slice';
import { mutateToArray } from '@/src/utils';
import { slice } from './events.slice';

const {
  fetchEventsSucceeded,
  fetchSelectedEventSucceeded,
  fetchSelectedEventParticipantsSucceeded,
  updateUserParticipationSucceeded,
  fetchSelectedEventParticipantsRequested,
} = slice.actions;

/**
 * Fixed cache keys: each of this domain's `createRequestAdapter` fields was
 * a single global status (never fetched concurrently for different args) —
 * same reasoning as `profiles`.
 */
export const FETCH_EVENTS_FIXED_CACHE_KEY = 'fetchEvents';
export const FETCH_SELECTED_EVENT_FIXED_CACHE_KEY = 'fetchSelectedEvent';
export const FETCH_SELECTED_EVENT_PARTICIPANTS_FIXED_CACHE_KEY =
  'fetchSelectedEventParticipants';
export const UPDATE_USER_PARTICIPATION_FIXED_CACHE_KEY =
  'updateUserParticipation';

export const eventsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** Translates `fetchEventsRequestedSaga`. */
    fetchEvents: builder.mutation<
      Event[],
      EventDirectoryFilters & { offset: number }
    >({
      queryFn: async ({
        departmentIds,
        search,
        modes,
        eventTypes,
        publicSensibilise,
        offset,
      }) => {
        try {
          const { data } = await Api.getAllEvents({
            departmentIds: mutateToArray(departmentIds),
            modes: mutateToArray(modes) as EventMode[],
            eventTypes: mutateToArray(eventTypes) as EventType[],
            publicSensibilise: mutateToArray(
              publicSensibilise
            ) as PublicSensibilise[],
            search,
            offset,
            limit: EVENTS_LIMIT,
          });
          return { data };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchEventsSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchSelectedEventSaga`. */
    fetchSelectedEvent: builder.mutation<
      EventWithParticipants,
      { eventId: string }
    >({
      queryFn: async ({ eventId }) => {
        try {
          const { data: event } = await Api.getEvent(eventId);
          return { data: event };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: event } = await queryFulfilled;
          dispatch(fetchSelectedEventSucceeded({ ...event }));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchSelectedEventParticipantsSaga`. */
    fetchSelectedEventParticipants: builder.mutation<
      EventWithParticipants['participants'],
      { eventId: string }
    >({
      queryFn: async ({ eventId }) => {
        try {
          const { data } = await Api.getEventParticipants(eventId);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchSelectedEventParticipantsSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /**
     * Translates `updateUserParticipationSaga`, and folds in
     * `events.thunks.ts`'s `updateUserParticipationThunk` (the same API
     * call, previously duplicated as a separate `createAsyncThunk` for
     * imperative `.unwrap()` callers — now just this mutation, which
     * supports the same direct-dispatch-and-unwrap usage natively).
     */
    updateUserParticipation: builder.mutation<
      { isParticipating: boolean },
      { eventSalesForceId: string; isParticipating: boolean }
    >({
      queryFn: async ({ eventSalesForceId, isParticipating }) => {
        try {
          await Api.updateEventParticipation(
            eventSalesForceId,
            isParticipating
          );
          return { data: { isParticipating } };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (
        { eventSalesForceId },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUserParticipationSucceeded(data));
          dispatch(
            fetchSelectedEventParticipantsRequested({
              eventId: eventSalesForceId,
            })
          );
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
  }),
});

export const {
  useFetchEventsMutation,
  useFetchSelectedEventMutation,
  useFetchSelectedEventParticipantsMutation,
  useUpdateUserParticipationMutation,
} = eventsApi;
