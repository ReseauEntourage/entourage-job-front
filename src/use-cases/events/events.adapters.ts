import { EventDirectoryFilters } from '@/src/features/backoffice/events/EventDirectory/useEventDirectoryQueryParams';
import { Event, EventWithParticipants } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const fetchEventsAdapter = createRequestAdapter(
  'fetchEvents'
).withPayloads<EventDirectoryFilters, Event[]>();

export const fetchSelectedEventAdapter = createRequestAdapter(
  'fetchSelectedEvent'
).withPayloads<
  {
    eventId: string;
  },
  EventWithParticipants
>();

export const fetchSelectedEventParticipantsAdapter = createRequestAdapter(
  'fetchSelectedEventParticipants'
).withPayloads<
  {
    eventId: string;
  },
  EventWithParticipants['participants']
>();

export const updateUserParticipationAdapter = createRequestAdapter(
  'updateUserParticipation'
).withPayloads<
  {
    eventSalesForceId: string;
    isParticipating: boolean;
  },
  { isParticipating: boolean }
>();
