import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventDirectoryFilters } from '@/src/components/backoffice/events/EventDirectory/useEventDirectoryQueryParams';
import { Event } from 'src/api/types';
import { EVENTS_LIMIT } from 'src/constants';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  fetchEventsAdapter,
  fetchSelectedEventAdapter,
} from './events.adapters';

export interface State {
  fetchEvents: RequestState<typeof fetchEventsAdapter>;
  fetchSelectedEvent: RequestState<typeof fetchSelectedEventAdapter>;
  events: Event[];
  eventsOffset: number;
  eventsHasFetchedAll: boolean;
  selectedEvent: Event | null;
}

const initialState: State = {
  fetchEvents: fetchEventsAdapter.getInitialState(),
  fetchSelectedEvent: fetchSelectedEventAdapter.getInitialState(),
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
