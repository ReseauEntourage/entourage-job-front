jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { EVENTS_LIMIT } from '@/src/constants';
import { EventDirectoryFilters } from '@/src/features/backoffice/events/EventDirectory/useEventDirectoryQueryParams';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import {
  eventsApi,
  FETCH_EVENTS_FIXED_CACHE_KEY,
  FETCH_SELECTED_EVENT_FIXED_CACHE_KEY,
  FETCH_SELECTED_EVENT_PARTICIPANTS_FIXED_CACHE_KEY,
  UPDATE_USER_PARTICIPATION_FIXED_CACHE_KEY,
} from './events.api';
import { slice } from './events.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

const buildFilters = (
  overrides: Partial<EventDirectoryFilters> = {}
): EventDirectoryFilters => ({
  ...overrides,
});

describe('events api', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchEventsRequested (trigger listener)', () => {
    it('stores the returned events on success', async () => {
      const store = createTestStore();
      const events = [{ salesForceId: 'event-1' }] as any;
      mockedApi.getAllEvents.mockResolvedValue({ data: events } as any);

      store.dispatch(actions.fetchEventsRequested(buildFilters()));
      await flushPromises();

      expect(store.getState().events.events).toEqual(events);
      expect(
        eventsApi.endpoints.fetchEvents.select(FETCH_EVENTS_FIXED_CACHE_KEY)(
          store.getState()
        ).isSuccess
      ).toBe(true);
    });

    it('surfaces the error when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getAllEvents.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchEventsRequested(buildFilters()));
      await flushPromises();

      expect(
        eventsApi.endpoints.fetchEvents.select(FETCH_EVENTS_FIXED_CACHE_KEY)(
          store.getState()
        ).isError
      ).toBe(true);
    });
  });

  describe('fetchEventsWithFilters', () => {
    it('resets pagination and fetches events with the given filters', async () => {
      const store = createTestStore({
        events: {
          ...slice.getInitialState(),
          eventsOffset: 50,
          eventsHasFetchedAll: true,
        },
      });
      const events = [{ salesForceId: 'event-1' }] as any;
      mockedApi.getAllEvents.mockResolvedValue({ data: events } as any);

      store.dispatch(
        actions.fetchEventsWithFilters(buildFilters({ search: 'gala' }))
      );
      await flushPromises();

      expect(store.getState().events.eventsOffset).toBe(0);
      expect(store.getState().events.events).toEqual(events);
      expect(mockedApi.getAllEvents).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'gala', offset: 0 })
      );
    });
  });

  describe('fetchEventsNextPage', () => {
    it('fetches the next page when the previous page succeeded', async () => {
      const store = createTestStore({
        events: { ...slice.getInitialState(), eventsHasFetchedAll: false },
      });
      // A full page (not empty): an empty/partial page would itself flip
      // `eventsHasFetchedAll` to true via `fetchEventsSucceeded`.
      const fullPage = Array.from({ length: EVENTS_LIMIT }, (_, i) => ({
        salesForceId: `event-${i}`,
      })) as any;
      mockedApi.getAllEvents.mockResolvedValue({ data: fullPage } as any);
      await store.dispatch(
        eventsApi.endpoints.fetchEvents.initiate(
          { ...buildFilters(), offset: 0 },
          { fixedCacheKey: FETCH_EVENTS_FIXED_CACHE_KEY }
        )
      );
      mockedApi.getAllEvents.mockClear();

      store.dispatch(actions.fetchEventsNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllEvents).toHaveBeenCalled();
      expect(store.getState().events.eventsOffset).toBeGreaterThan(0);
    });

    it('does nothing when all events have already been fetched', async () => {
      const store = createTestStore({
        events: { ...slice.getInitialState(), eventsHasFetchedAll: true },
      });

      store.dispatch(actions.fetchEventsNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllEvents).not.toHaveBeenCalled();
    });

    it('does nothing when no fetch has ever succeeded yet (still idle)', async () => {
      const store = createTestStore({
        events: { ...slice.getInitialState(), eventsHasFetchedAll: false },
      });

      store.dispatch(actions.fetchEventsNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllEvents).not.toHaveBeenCalled();
    });
  });

  describe('fetchSelectedEventRequested', () => {
    it('stores the selected event on success', async () => {
      const store = createTestStore();
      const event = { salesForceId: 'event-1' } as any;
      mockedApi.getEvent.mockResolvedValue({ data: event } as any);

      store.dispatch(
        actions.fetchSelectedEventRequested({ eventId: 'event-1' })
      );
      await flushPromises();

      expect(store.getState().events.selectedEvent).toEqual(event);
      expect(
        eventsApi.endpoints.fetchSelectedEvent.select(
          FETCH_SELECTED_EVENT_FIXED_CACHE_KEY
        )(store.getState()).isSuccess
      ).toBe(true);
    });
  });

  describe('fetchSelectedEventParticipantsRequested', () => {
    it('sets the participants on the selected event on success', async () => {
      const store = createTestStore({
        events: {
          ...slice.getInitialState(),
          selectedEvent: { salesForceId: 'event-1', participants: [] } as any,
        },
      });
      const participants = [{ id: 'user-1' }] as any;
      mockedApi.getEventParticipants.mockResolvedValue({
        data: participants,
      } as any);

      store.dispatch(
        actions.fetchSelectedEventParticipantsRequested({ eventId: 'event-1' })
      );
      await flushPromises();

      expect(store.getState().events.selectedEvent?.participants).toEqual(
        participants
      );
      expect(
        eventsApi.endpoints.fetchSelectedEventParticipants.select(
          FETCH_SELECTED_EVENT_PARTICIPANTS_FIXED_CACHE_KEY
        )(store.getState()).isSuccess
      ).toBe(true);
    });
  });

  describe('updateUserParticipationRequested (trigger listener)', () => {
    it('updates isParticipating and re-fetches the participants list on success', async () => {
      const store = createTestStore({
        events: {
          ...slice.getInitialState(),
          selectedEvent: {
            salesForceId: 'event-1',
            isParticipating: false,
            participants: [],
          } as any,
        },
      });
      mockedApi.updateEventParticipation.mockResolvedValue({} as any);
      const participants = [{ id: 'user-1' }] as any;
      mockedApi.getEventParticipants.mockResolvedValue({
        data: participants,
      } as any);

      store.dispatch(
        actions.updateUserParticipationRequested({
          eventSalesForceId: 'event-1',
          isParticipating: true,
        })
      );
      await flushPromises();

      expect(store.getState().events.selectedEvent?.isParticipating).toBe(true);
      expect(store.getState().events.selectedEvent?.participants).toEqual(
        participants
      );
    });

    it('does not re-fetch participants when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.updateEventParticipation.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateUserParticipationRequested({
          eventSalesForceId: 'event-1',
          isParticipating: true,
        })
      );
      await flushPromises();

      expect(
        eventsApi.endpoints.updateUserParticipation.select(
          UPDATE_USER_PARTICIPATION_FIXED_CACHE_KEY
        )(store.getState()).isError
      ).toBe(true);
      expect(mockedApi.getEventParticipants).not.toHaveBeenCalled();
    });
  });

  describe('updateUserParticipation (direct dispatch, folded-in events.thunks.ts usage)', () => {
    it('fulfills with the API response payload on success', async () => {
      const store = createTestStore();
      mockedApi.updateEventParticipation.mockResolvedValue({} as any);

      const result = await store.dispatch(
        eventsApi.endpoints.updateUserParticipation.initiate({
          eventSalesForceId: 'event-1',
          isParticipating: true,
        })
      );

      expect(result).toMatchObject({ data: { isParticipating: true } });
      expect(mockedApi.updateEventParticipation).toHaveBeenCalledWith(
        'event-1',
        true
      );
    });

    it('surfaces the error when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.updateEventParticipation.mockRejectedValue(
        new Error('network error')
      );

      const result = await store.dispatch(
        eventsApi.endpoints.updateUserParticipation.initiate({
          eventSalesForceId: 'event-1',
          isParticipating: true,
        })
      );

      expect(result).toHaveProperty('error');
    });
  });
});
