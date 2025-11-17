import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventDirectoryFilters } from '@/src/components/backoffice/events/EventDirectory/useEventDirectoryQueryParams';
import { Event } from 'src/api/types';
import { EVENTS_LIMIT } from 'src/constants';
import { RequestState, SliceRootState } from 'src/store/utils';
import { fetchEventsAdapter } from './events.adapters';

export interface State {
  fetchEvents: RequestState<typeof fetchEventsAdapter>;
  events: Event[];
  eventsOffset: number;
  eventsHasFetchedAll: boolean;
}

const initialState: State = {
  fetchEvents: fetchEventsAdapter.getInitialState(),
  events: [],
  eventsOffset: 0,
  eventsHasFetchedAll: false,
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
