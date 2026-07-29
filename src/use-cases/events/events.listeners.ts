import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import {
  eventsApi,
  FETCH_EVENTS_FIXED_CACHE_KEY,
  FETCH_SELECTED_EVENT_FIXED_CACHE_KEY,
  FETCH_SELECTED_EVENT_PARTICIPANTS_FIXED_CACHE_KEY,
  UPDATE_USER_PARTICIPATION_FIXED_CACHE_KEY,
} from './events.api';
import {
  selectEventsHasFetchedAll,
  selectEventsOffset,
} from './events.selectors';
import { slice } from './events.slice';

const { actions } = slice;

/** Translates `fetchEventsWithFiltersSaga`. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchEventsWithFilters,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(actions.resetEventsOffset());
    listenerApi.dispatch(actions.fetchEventsRequested(action.payload));
  },
});

/**
 * Translates `fetchEventsNextPageSaga`: only paginate past a page that
 * itself succeeded (mirrors the original `status === SUCCEEDED` guard, not
 * just "not currently loading").
 */
listenerMiddleware.startListening({
  actionCreator: actions.fetchEventsNextPage,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as never;
    const hasFetchedAll = selectEventsHasFetchedAll(state);
    const isFetchSucceeded = eventsApi.endpoints.fetchEvents.select(
      FETCH_EVENTS_FIXED_CACHE_KEY
    )(state).isSuccess;

    if (!hasFetchedAll && isFetchSucceeded) {
      listenerApi.dispatch(actions.incrementEventsOffset());
      listenerApi.dispatch(actions.fetchEventsRequested(action.payload));
    }
  },
});

/** Translates `fetchEventsRequestedSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchEventsRequested,
  effect: (action, listenerApi) => {
    const offset = selectEventsOffset(listenerApi.getState() as never);
    listenerApi.dispatch(
      eventsApi.endpoints.fetchEvents.initiate(
        { ...action.payload, offset },
        { fixedCacheKey: FETCH_EVENTS_FIXED_CACHE_KEY }
      )
    );
  },
});

/** Translates `fetchSelectedEventSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchSelectedEventRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      eventsApi.endpoints.fetchSelectedEvent.initiate(action.payload, {
        fixedCacheKey: FETCH_SELECTED_EVENT_FIXED_CACHE_KEY,
      })
    );
  },
});

/** Translates `fetchSelectedEventParticipantsSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchSelectedEventParticipantsRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      eventsApi.endpoints.fetchSelectedEventParticipants.initiate(
        action.payload,
        { fixedCacheKey: FETCH_SELECTED_EVENT_PARTICIPANTS_FIXED_CACHE_KEY }
      )
    );
  },
});

/** Translates `updateUserParticipationSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.updateUserParticipationRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      eventsApi.endpoints.updateUserParticipation.initiate(action.payload, {
        fixedCacheKey: UPDATE_USER_PARTICIPATION_FIXED_CACHE_KEY,
      })
    );
  },
});
