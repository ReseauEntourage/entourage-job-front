// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { EventWithParticipants } from '@/src/api/types';
import {
  selectEvents,
  selectEventsHasFetchedAll,
  selectEventsOffset,
  selectSelectedEvent,
} from './events.selectors';
import { slice } from './events.slice';

// `as any`: these selectors only read `state.events.*`, but the module's
// exported `RootState` type also requires the shared `api` reducer key (for
// the RTK-Query-backed status selectors in the same file) — not relevant here.
const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): any => ({
  events: { ...slice.getInitialState(), ...overrides },
});

describe('events.selectors', () => {
  describe('selectEvents', () => {
    it('returns the events list', () => {
      const events = [{ salesForceId: 'event-1' }] as any;
      expect(selectEvents(buildState({ events }))).toEqual(events);
    });
  });

  describe('selectEventsOffset', () => {
    it('returns the events offset', () => {
      expect(selectEventsOffset(buildState({ eventsOffset: 25 }))).toBe(25);
    });
  });

  describe('selectEventsHasFetchedAll', () => {
    it('returns the eventsHasFetchedAll flag', () => {
      expect(
        selectEventsHasFetchedAll(buildState({ eventsHasFetchedAll: true }))
      ).toBe(true);
      expect(
        selectEventsHasFetchedAll(buildState({ eventsHasFetchedAll: false }))
      ).toBe(false);
    });
  });

  describe('selectSelectedEvent', () => {
    it('returns the selected event', () => {
      const selectedEvent = {
        salesForceId: 'event-1',
      } as EventWithParticipants;
      expect(selectSelectedEvent(buildState({ selectedEvent }))).toEqual(
        selectedEvent
      );
    });

    it('returns null when there is no selected event', () => {
      expect(selectSelectedEvent(buildState())).toBeNull();
    });
  });
});
