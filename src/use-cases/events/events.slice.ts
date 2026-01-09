import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventDirectoryFilters } from '@/src/features/backoffice/events/EventDirectory/useEventDirectoryQueryParams';
import { Event, EventWithParticipants } from 'src/api/types';
import { EVENTS_LIMIT } from 'src/constants';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  fetchEventsAdapter,
  fetchSelectedEventAdapter,
  fetchSelectedEventParticipantsAdapter,
  updateUserParticipationAdapter,
} from './events.adapters';

export interface State {
  fetchEvents: RequestState<typeof fetchEventsAdapter>;
  fetchSelectedEvent: RequestState<typeof fetchSelectedEventAdapter>;
  fetchSelectedEventParticipants: RequestState<
    typeof fetchSelectedEventParticipantsAdapter
  >;
  updateUserParticipation: RequestState<typeof updateUserParticipationAdapter>;
  events: Event[];
  eventsOffset: number;
  eventsHasFetchedAll: boolean;
  selectedEvent: EventWithParticipants | null;
}

const initialState: State = {
  fetchEvents: fetchEventsAdapter.getInitialState(),
  fetchSelectedEvent: fetchSelectedEventAdapter.getInitialState(),
  fetchSelectedEventParticipants:
    fetchSelectedEventParticipantsAdapter.getInitialState(),
  updateUserParticipation: updateUserParticipationAdapter.getInitialState(),
  events: [],
  eventsOffset: 0,
  eventsHasFetchedAll: false,
  selectedEvent: null,
};

export const slice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    ...fetchEventsAdapter.getReducers<State>((state) => state.fetchEvents, {
      fetchEventsSucceeded(state, action) {
        state.events =
          state.eventsOffset === 0
            ? action.payload
            : [...state.events, ...action.payload];
        state.eventsHasFetchedAll = action.payload.length < EVENTS_LIMIT;
      },
    }),
    ...fetchSelectedEventAdapter.getReducers<State>(
      (state) => state.fetchSelectedEvent,
      {
        fetchSelectedEventSucceeded(state, action) {
          state.selectedEvent = action.payload;
        },
      }
    ),
    ...updateUserParticipationAdapter.getReducers<State>(
      (state) => state.updateUserParticipation,
      {
        updateUserParticipationSucceeded(state, _action) {
          if (state.selectedEvent) {
            state.selectedEvent.isParticipating =
              _action.payload.isParticipating;
          }
        },
      }
    ),
    ...fetchSelectedEventParticipantsAdapter.getReducers<State>(
      (state) => state.fetchSelectedEventParticipants,
      {
        fetchSelectedEventParticipantsSucceeded(state, action) {
          if (state.selectedEvent) {
            state.selectedEvent.participants = action.payload;
          }
        },
      }
    ),
    resetEventsOffset(state) {
      state.eventsOffset = 0;
      state.eventsHasFetchedAll = false;
      state.events = [];
    },
    fetchEventsWithFilters(
      _state,
      _action: PayloadAction<EventDirectoryFilters>
    ) {},
    fetchEventsNextPage(state, _action: PayloadAction<EventDirectoryFilters>) {
      state.eventsOffset = state.eventsHasFetchedAll
        ? state.eventsOffset
        : state.eventsOffset + EVENTS_LIMIT;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
