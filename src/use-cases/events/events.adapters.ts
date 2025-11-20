import { EventDirectoryFilters } from '@/src/components/backoffice/events/EventDirectory/useEventDirectoryQueryParams';
import { Event } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const fetchEventsAdapter = createRequestAdapter(
  'fetchEvents'
).withPayloads<EventDirectoryFilters, Event[]>();
