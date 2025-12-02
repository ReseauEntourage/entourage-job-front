import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEventId } from '@/src/hooks/queryParams/useEventId';
import {
  eventsActions,
  fetchSelectedEventSelectors,
  selectSelectedEvent,
} from '@/src/use-cases/events';
import { notificationsActions } from 'src/use-cases/notifications';
import { assertIsDefined } from 'src/utils/asserts';

export function useSelectedEvent() {
  const eventId = useEventId();
  const dispatch = useDispatch();

  const isFetchSelectedEventFailed = useSelector(
    fetchSelectedEventSelectors.selectIsFetchSelectedEventFailed
  );
  const selectedEvent = useSelector(selectSelectedEvent);

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
      dispatch(eventsActions.fetchSelectedEventReset());
    };
  }, [dispatch]);

  return {
    selectedEvent,
  };
}

export function useSelectSelectedEvent() {
  const selectedEvent = useSelector(selectSelectedEvent);

  assertIsDefined(selectedEvent, 'No selected event');

  return selectedEvent;
}
