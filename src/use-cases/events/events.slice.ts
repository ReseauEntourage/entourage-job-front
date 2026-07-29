import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event, EventWithParticipants } from '@/src/api/types';
import { EVENTS_LIMIT } from '@/src/constants';
import { EventDirectoryFilters } from '@/src/features/backoffice/events/EventDirectory/useEventDirectoryQueryParams';
import { SliceRootState } from '@/src/store/utils';

interface State {
  events: Event[];
  eventsOffset: number;
  eventsHasFetchedAll: boolean;
  selectedEvent: EventWithParticipants | null;
}

const initialState: State = {
  events: [],
  eventsOffset: 0,
  eventsHasFetchedAll: false,
  selectedEvent: null,
};

export const slice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    fetchEventsSucceeded(state, action: PayloadAction<Event[]>) {
      state.events =
        state.eventsOffset === 0
          ? action.payload
          : [...state.events, ...action.payload];
      state.eventsHasFetchedAll = action.payload.length < EVENTS_LIMIT;
    },
    fetchSelectedEventSucceeded(
      state,
      action: PayloadAction<EventWithParticipants>
    ) {
      state.selectedEvent = action.payload;
    },
    updateUserParticipationSucceeded(
      state,
      action: PayloadAction<{ isParticipating: boolean }>
    ) {
      if (state.selectedEvent) {
        state.selectedEvent.isParticipating = action.payload.isParticipating;
      }
    },
    fetchSelectedEventParticipantsSucceeded(
      state,
      action: PayloadAction<EventWithParticipants['participants']>
    ) {
      if (state.selectedEvent) {
        state.selectedEvent.participants = action.payload;
      }
    },
    resetEventsOffset(state) {
      state.eventsOffset = 0;
      state.eventsHasFetchedAll = false;
      state.events = [];
    },
    // No-op trigger actions: real handling lives in `events.api.ts`,
    // dispatched via `events.listeners.ts` in reaction to these.
    fetchEventsWithFilters(
      _state,
      _action: PayloadAction<EventDirectoryFilters>
    ) {},
    fetchEventsRequested(
      _state,
      _action: PayloadAction<EventDirectoryFilters>
    ) {},
    fetchSelectedEventRequested(
      _state,
      _action: PayloadAction<{ eventId: string }>
    ) {},
    fetchSelectedEventParticipantsRequested(
      _state,
      _action: PayloadAction<{ eventId: string }>
    ) {},
    updateUserParticipationRequested(
      _state,
      _action: PayloadAction<{
        eventSalesForceId: string;
        isParticipating: boolean;
      }>
    ) {},
    // No-op trigger: the guard (hasFetchedAll / last fetch succeeded) and
    // the offset increment both moved to `events.listeners.ts`, since the
    // guard now needs the `fetchEvents` mutation's own state.
    fetchEventsNextPage(
      _state,
      _action: PayloadAction<EventDirectoryFilters>
    ) {},
    incrementEventsOffset(state) {
      state.eventsOffset += EVENTS_LIMIT;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
