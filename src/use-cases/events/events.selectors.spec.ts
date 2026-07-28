// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { EventWithParticipants } from '@/src/api/types';
import {
  fetchEventsSelectors,
  fetchSelectedEventParticipantsSelectors,
  fetchSelectedEventSelectors,
  selectEvents,
  selectEventsHasFetchedAll,
  selectEventsOffset,
  selectSelectedEvent,
  updateUserParticipationSelectors,
} from './events.selectors';
import { RootState, slice } from './events.slice';

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    events: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

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

  const statusSelectors: [string, (state: RootState) => string, string][] = [
    [
      'fetchEventsSelectors.selectFetchEventsStatus',
      fetchEventsSelectors.selectFetchEventsStatus,
      'fetchEvents',
    ],
    [
      'fetchSelectedEventSelectors.selectFetchSelectedEventStatus',
      fetchSelectedEventSelectors.selectFetchSelectedEventStatus,
      'fetchSelectedEvent',
    ],
    [
      'fetchSelectedEventParticipantsSelectors.selectFetchSelectedEventParticipantsStatus',
      fetchSelectedEventParticipantsSelectors.selectFetchSelectedEventParticipantsStatus,
      'fetchSelectedEventParticipants',
    ],
    [
      'updateUserParticipationSelectors.selectUpdateUserParticipationStatus',
      updateUserParticipationSelectors.selectUpdateUserParticipationStatus,
      'updateUserParticipation',
    ],
  ];

  statusSelectors.forEach(([name, selector, stateKey]) => {
    describe(name, () => {
      it(`reads the status from events.${stateKey}`, () => {
        const state = buildState({
          [stateKey]: { status: 'SUCCEEDED' },
        } as any);

        expect(selector(state)).toBe('SUCCEEDED');
      });
    });
  });
});
