jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { EventDirectoryFilters } from '@/src/features/backoffice/events/EventDirectory/useEventDirectoryQueryParams';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { slice } from './events.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

const buildFilters = (
  overrides: Partial<EventDirectoryFilters> = {}
): EventDirectoryFilters => ({
  ...overrides,
});

describe('events saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchEventsRequested', () => {
    it('stores the returned events on success', async () => {
      const store = createTestStore();
      const events = [{ salesForceId: 'event-1' }] as any;
      mockedApi.getAllEvents.mockResolvedValue({ data: events } as any);

      store.dispatch(actions.fetchEventsRequested(buildFilters()));
      await flushPromises();

      expect(store.getState().events.events).toEqual(events);
      expect(store.getState().events.fetchEvents.status).toBe('SUCCEEDED');
    });

    it('dispatches fetchEventsFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getAllEvents.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchEventsRequested(buildFilters()));
      await flushPromises();

      expect(store.getState().events.fetchEvents.status).toBe('FAILED');
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
    it('fetches the next page when not all events were fetched and no fetch is in flight', async () => {
      const store = createTestStore({
        events: {
          ...slice.getInitialState(),
          eventsHasFetchedAll: false,
        },
      });
      mockedApi.getAllEvents.mockResolvedValue({ data: [] } as any);

      store.dispatch(actions.fetchEventsNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllEvents).toHaveBeenCalled();
    });

    it('does nothing when all events have already been fetched', async () => {
      const store = createTestStore({
        events: {
          ...slice.getInitialState(),
          eventsHasFetchedAll: true,
        },
      });

      store.dispatch(actions.fetchEventsNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllEvents).not.toHaveBeenCalled();
    });

    it('does nothing when a fetch is already in flight', async () => {
      const store = createTestStore({
        events: {
          ...slice.getInitialState(),
          eventsHasFetchedAll: false,
          fetchEvents: { status: 'REQUESTED' as any },
        },
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
      expect(store.getState().events.fetchSelectedEvent.status).toBe(
        'SUCCEEDED'
      );
    });

    it('dispatches fetchSelectedEventFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getEvent.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.fetchSelectedEventRequested({ eventId: 'event-1' })
      );
      await flushPromises();

      expect(store.getState().events.fetchSelectedEvent.status).toBe('FAILED');
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
        store.getState().events.fetchSelectedEventParticipants.status
      ).toBe('SUCCEEDED');
    });

    it('dispatches fetchSelectedEventParticipantsFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getEventParticipants.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.fetchSelectedEventParticipantsRequested({ eventId: 'event-1' })
      );
      await flushPromises();

      expect(
        store.getState().events.fetchSelectedEventParticipants.status
      ).toBe('FAILED');
    });
  });

  describe('updateUserParticipationRequested', () => {
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

      expect(store.getState().events.updateUserParticipation.status).toBe(
        'SUCCEEDED'
      );
      expect(store.getState().events.selectedEvent?.isParticipating).toBe(true);
      expect(store.getState().events.selectedEvent?.participants).toEqual(
        participants
      );
    });

    it('dispatches updateUserParticipationFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.updateEventParticipation.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.updateUserParticipationRequested({
          eventSalesForceId: 'event-1',
          isParticipating: true,
        })
      );
      await flushPromises();

      expect(store.getState().events.updateUserParticipation.status).toBe(
        'FAILED'
      );
      expect(mockedApi.getEventParticipants).not.toHaveBeenCalled();
    });
  });
});
