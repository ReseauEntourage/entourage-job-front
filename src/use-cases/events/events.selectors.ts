import { api } from '@/src/store/api/api.slice';
import {
  eventsApi,
  FETCH_EVENTS_FIXED_CACHE_KEY,
  FETCH_SELECTED_EVENT_FIXED_CACHE_KEY,
  FETCH_SELECTED_EVENT_PARTICIPANTS_FIXED_CACHE_KEY,
  UPDATE_USER_PARTICIPATION_FIXED_CACHE_KEY,
} from './events.api';
import { RootState as EventsSliceRootState } from './events.slice';

// `RootState` here also needs the shared `api` reducer key (for the
// `eventsApi.endpoints.*.select()` calls below) — same reasoning as
// `store.ts`/`createTestStore.ts`.
type RootState = EventsSliceRootState & {
  [K in typeof api.reducerPath]: ReturnType<typeof api.reducer>;
};

export const fetchEventsSelectors = {
  selectIsFetchEventsIdle: (state: RootState) =>
    eventsApi.endpoints.fetchEvents.select(FETCH_EVENTS_FIXED_CACHE_KEY)(state)
      .isUninitialized,
  selectIsFetchEventsRequested: (state: RootState) =>
    eventsApi.endpoints.fetchEvents.select(FETCH_EVENTS_FIXED_CACHE_KEY)(state)
      .isLoading,
  selectIsFetchEventsFailed: (state: RootState) =>
    eventsApi.endpoints.fetchEvents.select(FETCH_EVENTS_FIXED_CACHE_KEY)(state)
      .isError,
};

export const fetchSelectedEventSelectors = {
  selectIsFetchSelectedEventRequested: (state: RootState) =>
    eventsApi.endpoints.fetchSelectedEvent.select(
      FETCH_SELECTED_EVENT_FIXED_CACHE_KEY
    )(state).isLoading,
  selectIsFetchSelectedEventFailed: (state: RootState) =>
    eventsApi.endpoints.fetchSelectedEvent.select(
      FETCH_SELECTED_EVENT_FIXED_CACHE_KEY
    )(state).isError,
};

export const fetchSelectedEventParticipantsSelectors = {
  selectIsFetchSelectedEventParticipantsRequested: (state: RootState) =>
    eventsApi.endpoints.fetchSelectedEventParticipants.select(
      FETCH_SELECTED_EVENT_PARTICIPANTS_FIXED_CACHE_KEY
    )(state).isLoading,
  selectIsFetchSelectedEventParticipantsFailed: (state: RootState) =>
    eventsApi.endpoints.fetchSelectedEventParticipants.select(
      FETCH_SELECTED_EVENT_PARTICIPANTS_FIXED_CACHE_KEY
    )(state).isError,
};

export const updateUserParticipationSelectors = {
  selectIsUpdateUserParticipationRequested: (state: RootState) =>
    eventsApi.endpoints.updateUserParticipation.select(
      UPDATE_USER_PARTICIPATION_FIXED_CACHE_KEY
    )(state).isLoading,
};

export function selectEvents(state: RootState) {
  return state.events.events;
}

export function selectEventsOffset(state: RootState) {
  return state.events.eventsOffset;
}

export function selectEventsHasFetchedAll(state: RootState) {
  return state.events.eventsHasFetchedAll;
}

export function selectSelectedEvent(state: RootState) {
  return state.events.selectedEvent;
}
