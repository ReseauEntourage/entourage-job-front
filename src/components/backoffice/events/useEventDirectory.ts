import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { eventsActions } from '@/src/use-cases/events';
import {
  fetchEventsSelectors,
  selectEvents,
  selectEventsHasFetchedAll,
} from '@/src/use-cases/events/events.selectors';
import { useIsAtBottom } from 'src/hooks/useIsAtBottom';
import { usePrevious } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';
import { useEventDirectoryQueryParams } from './EventDirectory/useEventDirectoryQueryParams';

// Manage directory requests and filters
export function useEventDirectory() {
  const dispatch = useDispatch();

  /*
   ** Events selections
   */
  const isFetchEventsIdle = useSelector(
    fetchEventsSelectors.selectIsFetchEventsIdle
  );

  const isFetchEventsRequested = useSelector(
    fetchEventsSelectors.selectIsFetchEventsRequested
  );

  const isEventLoading = isFetchEventsIdle || isFetchEventsRequested;

  const isFetchEventsStatusFailed = useSelector(
    fetchEventsSelectors.selectIsFetchEventsFailed
  );

  const events = useSelector(selectEvents);

  /**
   * Filters and params
   */
  const eventDirectoryFiltersParams = useEventDirectoryQueryParams();

  const prevEventDirectoryFiltersParams = usePrevious(
    eventDirectoryFiltersParams
  );

  useEffect(() => {
    if (
      !_.isEqual(prevEventDirectoryFiltersParams, eventDirectoryFiltersParams)
    ) {
      dispatch(
        eventsActions.fetchEventsWithFilters(eventDirectoryFiltersParams)
      );
    }
  }, [dispatch, eventDirectoryFiltersParams, prevEventDirectoryFiltersParams]);

  /**
   * Effects
   */
  useEffect(() => {
    if (isFetchEventsStatusFailed) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Une erreur est survenue`,
        })
      );
    }
  }, [dispatch, isFetchEventsStatusFailed]);

  useEffect(() => {
    return () => {
      dispatch(eventsActions.resetEventsOffset());
    };
  }, [dispatch]);

  // Get state to check if all items have been fetched
  const eventsHasFetchedAll = useSelector(selectEventsHasFetchedAll);

  // Manage offset and events request when scrolling to the bottom of the page
  useIsAtBottom(() => {
    // Only fetch more events if there are more to fetch
    if (!eventsHasFetchedAll) {
      dispatch(eventsActions.fetchEventsNextPage(eventDirectoryFiltersParams));
    }
  });

  return {
    events,
    isEventLoading,
    eventDirectoryFiltersParams,
  };
}
