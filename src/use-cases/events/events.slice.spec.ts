// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { Event, EventWithParticipants } from '@/src/api/types';
import { EVENTS_LIMIT, ReduxRequestEvents } from '@/src/constants';
import {
  EventMode,
  EventType,
  PublicSensibilise,
} from '@/src/constants/events';
import { slice } from './events.slice';

const { actions, reducer } = slice;

const buildEvent = (overrides: Partial<Event> = {}): Event =>
  ({
    salesForceId: 'event-1',
    name: 'Welcome session',
    description: 'A great event',
    startDate: '2026-01-01T10:00:00Z',
    endDate: '2026-01-01T12:00:00Z',
    eventType: EventType.WELCOME_SESSION,
    participantsCount: 0,
    registrationCount: 0,
    mode: EventMode.ONLINE,
    meetingLink: null,
    fullAddress: null,
    duration: null,
    format: 'format',
    goal: 'goal',
    audience: 'audience',
    isParticipating: false,
    publicSensibilise: [PublicSensibilise.GENERAL_PUBLIC],
    ...overrides,
  }) as Event;

const buildEventWithParticipants = (
  overrides: Partial<EventWithParticipants> = {}
): EventWithParticipants =>
  ({
    ...buildEvent(),
    participants: [],
    ...overrides,
  }) as EventWithParticipants;

describe('events slice', () => {
  describe('fetchEventsSucceeded', () => {
    it('replaces the events list when offset is 0', () => {
      const initialState = {
        ...slice.getInitialState(),
        eventsOffset: 0,
        events: [buildEvent({ salesForceId: 'stale' })],
      };
      const events = [buildEvent({ salesForceId: 'event-1' })];

      const state = reducer(initialState, actions.fetchEventsSucceeded(events));

      expect(state.events).toEqual(events);
    });

    it('appends to the events list when offset is greater than 0', () => {
      const existing = [buildEvent({ salesForceId: 'event-1' })];
      const initialState = {
        ...slice.getInitialState(),
        eventsOffset: EVENTS_LIMIT,
        events: existing,
      };
      const nextPage = [buildEvent({ salesForceId: 'event-2' })];

      const state = reducer(
        initialState,
        actions.fetchEventsSucceeded(nextPage)
      );

      expect(state.events).toEqual([...existing, ...nextPage]);
    });

    it('marks eventsHasFetchedAll true when the page is smaller than the limit', () => {
      const state = reducer(
        undefined,
        actions.fetchEventsSucceeded([buildEvent()])
      );

      expect(state.eventsHasFetchedAll).toBe(true);
    });

    it('marks eventsHasFetchedAll false when the page is full', () => {
      const fullPage = Array.from({ length: EVENTS_LIMIT }, (_, i) =>
        buildEvent({ salesForceId: `event-${i}` })
      );

      const state = reducer(undefined, actions.fetchEventsSucceeded(fullPage));

      expect(state.eventsHasFetchedAll).toBe(false);
    });
  });

  it('fetchSelectedEventSucceeded sets selectedEvent', () => {
    const event = buildEventWithParticipants();

    const state = reducer(
      undefined,
      actions.fetchSelectedEventSucceeded(event)
    );

    expect(state.selectedEvent).toEqual(event);
  });

  describe('updateUserParticipationSucceeded', () => {
    it('sets isParticipating on the selected event', () => {
      const initialState = {
        ...slice.getInitialState(),
        selectedEvent: buildEventWithParticipants({ isParticipating: false }),
      };

      const state = reducer(
        initialState,
        actions.updateUserParticipationSucceeded({ isParticipating: true })
      );

      expect(state.selectedEvent?.isParticipating).toBe(true);
    });

    it('is a no-op when there is no selected event', () => {
      const state = reducer(
        undefined,
        actions.updateUserParticipationSucceeded({ isParticipating: true })
      );

      expect(state.selectedEvent).toBeNull();
    });
  });

  describe('fetchSelectedEventParticipantsSucceeded', () => {
    it('sets participants on the selected event', () => {
      const initialState = {
        ...slice.getInitialState(),
        selectedEvent: buildEventWithParticipants({ participants: [] }),
      };
      const participants = [
        {
          id: 'user-1',
          firstName: 'Jane',
          lastName: 'Doe',
          role: 'COACH',
          userProfile: { hasPicture: true },
        },
      ] as any as EventWithParticipants['participants'];

      const state = reducer(
        initialState,
        actions.fetchSelectedEventParticipantsSucceeded(participants)
      );

      expect(state.selectedEvent?.participants).toEqual(participants);
    });

    it('is a no-op when there is no selected event', () => {
      const state = reducer(
        undefined,
        actions.fetchSelectedEventParticipantsSucceeded([])
      );

      expect(state.selectedEvent).toBeNull();
    });
  });

  it('resetEventsOffset resets pagination state', () => {
    const initialState = {
      ...slice.getInitialState(),
      eventsOffset: EVENTS_LIMIT * 2,
      eventsHasFetchedAll: true,
      events: [buildEvent()],
    };

    const state = reducer(initialState, actions.resetEventsOffset());

    expect(state.eventsOffset).toBe(0);
    expect(state.eventsHasFetchedAll).toBe(false);
    expect(state.events).toEqual([]);
  });

  it('fetchEventsWithFilters does not mutate state', () => {
    const initialState = slice.getInitialState();

    const state = reducer(initialState, actions.fetchEventsWithFilters({}));

    expect(state).toEqual(initialState);
  });

  describe('fetchEventsNextPage', () => {
    it('increments the offset when not all events are fetched and the previous fetch succeeded', () => {
      const initialState = {
        ...slice.getInitialState(),
        eventsOffset: 0,
        eventsHasFetchedAll: false,
        fetchEvents: { status: ReduxRequestEvents.SUCCEEDED },
      };

      const state = reducer(initialState, actions.fetchEventsNextPage({}));

      expect(state.eventsOffset).toBe(EVENTS_LIMIT);
    });

    it('does not increment the offset when all events are already fetched', () => {
      const initialState = {
        ...slice.getInitialState(),
        eventsOffset: 0,
        eventsHasFetchedAll: true,
        fetchEvents: { status: ReduxRequestEvents.SUCCEEDED },
      };

      const state = reducer(initialState, actions.fetchEventsNextPage({}));

      expect(state.eventsOffset).toBe(0);
    });

    it('does not increment the offset when a fetch is still in progress', () => {
      const initialState = {
        ...slice.getInitialState(),
        eventsOffset: 0,
        eventsHasFetchedAll: false,
        fetchEvents: { status: ReduxRequestEvents.REQUESTED },
      };

      const state = reducer(initialState, actions.fetchEventsNextPage({}));

      expect(state.eventsOffset).toBe(0);
    });
  });
});
