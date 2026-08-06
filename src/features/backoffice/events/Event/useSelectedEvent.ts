import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEventId } from '@/src/hooks/queryParams/useEventId';
import {
  eventsActions,
  fetchSelectedEventSelectors,
  FETCH_SELECTED_EVENT_FIXED_CACHE_KEY,
  selectSelectedEvent,
  useFetchSelectedEventMutation,
} from '@/src/use-cases/events';
import { notificationsActions } from '@/src/use-cases/notifications';
import { assertIsDefined } from '@/src/utils/asserts';

export function useSelectedEvent() {
  const eventId = useEventId();
  const dispatch = useDispatch();

  const isFetchSelectedEventFailed = useSelector(
    fetchSelectedEventSelectors.selectIsFetchSelectedEventFailed
  );
  const selectedEvent = useSelector(selectSelectedEvent);
  const [, { reset: resetFetchSelectedEvent }] = useFetchSelectedEventMutation({
    fixedCacheKey: FETCH_SELECTED_EVENT_FIXED_CACHE_KEY,
  });

  useEffect(() => {
    if (eventId) {
      dispatch(
        eventsActions.fetchSelectedEventRequested({
          eventId,
        })
      );
    }
  }, [dispatch, eventId]);

  useEffect(() => {
    if (isFetchSelectedEventFailed) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: 'Une erreur est survenue',
        })
      );
    }
  }, [dispatch, isFetchSelectedEventFailed]);

  useEffect(() => {
    return () => {
      resetFetchSelectedEvent();
    };
  }, [resetFetchSelectedEvent]);

  return {
    selectedEvent,
  };
}

export function useSelectSelectedEvent() {
  const selectedEvent = useSelector(selectSelectedEvent);

  assertIsDefined(selectedEvent, 'No selected event');

  return selectedEvent;
}
