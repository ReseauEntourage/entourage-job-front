import {
  fetchEventsAdapter,
  fetchSelectedEventAdapter,
} from './events.adapters';
import { RootState } from './events.slice';

export const fetchEventsSelectors = fetchEventsAdapter.getSelectors<RootState>(
  (state) => state.events.fetchEvents
);

export const fetchSelectedEventSelectors =
  fetchSelectedEventAdapter.getSelectors<RootState>(
    (state) => state.events.fetchSelectedEvent
  );

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
