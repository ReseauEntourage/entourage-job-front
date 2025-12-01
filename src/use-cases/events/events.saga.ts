import { call, put, select, takeLatest, takeLeading } from 'typed-redux-saga';
import { EventMode, EventType } from '@/src/constants/events';
import { Api } from 'src/api';
import { EVENTS_LIMIT } from 'src/constants';
import { mutateToArray } from 'src/utils';
import {
  selectEventsHasFetchedAll,
  selectEventsOffset,
} from './events.selectors';
import { slice } from './events.slice';

const {
  fetchEventsRequested,
  fetchEventsSucceeded,
  fetchEventsFailed,
  fetchEventsNextPage,
  resetEventsOffset,
  fetchEventsWithFilters,
  fetchSelectedEventRequested,
  fetchSelectedEventSucceeded,
  fetchSelectedEventFailed,
  updateUserParticipationRequested,
  updateUserParticipationSucceeded,
  updateUserParticipationFailed,
  fetchSelectedEventParticipantsRequested,
  fetchSelectedEventParticipantsSucceeded,
  fetchSelectedEventParticipantsFailed,
} = slice.actions;

function* fetchEventsNextPageSaga(
  action: ReturnType<typeof fetchEventsNextPage>
) {
  const hasFetchedAll = yield* select(selectEventsHasFetchedAll);

  if (!hasFetchedAll) {
    yield* put(fetchEventsRequested(action.payload));
  }
}

function* fetchEventsWithFiltersSaga(
  action: ReturnType<typeof fetchEventsWithFilters>
) {
  yield* put(resetEventsOffset());
  yield* put(fetchEventsRequested(action.payload));
}

function* fetchEventsRequestedSaga(
  action: ReturnType<typeof fetchEventsRequested>
) {
  try {
    const offset = yield* select(selectEventsOffset);
    const limit = EVENTS_LIMIT;

    const { departmentIds, search, modes, eventTypes } = action.payload;

    const response = yield* call(() =>
      Api.getAllEvents({
        departmentIds: mutateToArray(departmentIds),
        modes: mutateToArray(modes) as EventMode[],
        eventTypes: mutateToArray(eventTypes) as EventType[],
        search,
        offset,
        limit,
      })
    );
    yield* put(fetchEventsSucceeded(response.data));
  } catch {
    yield* put(fetchEventsFailed());
  }
}

function* fetchSelectedEventSaga(
  action: ReturnType<typeof fetchSelectedEventRequested>
) {
  const { eventId } = action.payload;
  try {
    const { data: event } = yield* call(() => Api.getEvent(eventId));
    yield* put(fetchSelectedEventSucceeded({ ...event }));
  } catch {
    yield* put(fetchSelectedEventFailed());
  }
}

function* fetchSelectedEventParticipantsSaga(
  action: ReturnType<typeof fetchSelectedEventParticipantsRequested>
) {
  const { eventId } = action.payload;
  try {
    const { data } = yield* call(() => Api.getEventParticipants(eventId));
    yield* put(fetchSelectedEventParticipantsSucceeded(data));
  } catch {
    yield* put(fetchSelectedEventParticipantsFailed());
  }
}

function* updateUserParticipationSaga(
  action: ReturnType<typeof updateUserParticipationRequested>
) {
  const { eventSalesForceId, isParticipating } = action.payload;
  try {
    yield* call(() =>
      Api.updateEventParticipation(eventSalesForceId, isParticipating)
    );
    yield* put(updateUserParticipationSucceeded({ isParticipating }));
    yield* put(
      fetchSelectedEventParticipantsRequested({ eventId: eventSalesForceId })
    );
  } catch {
    yield* put(updateUserParticipationFailed());
  }
}

export function* saga() {
  yield* takeLatest(fetchEventsWithFilters, fetchEventsWithFiltersSaga);
  yield* takeLeading(fetchEventsNextPage, fetchEventsNextPageSaga);
  yield* takeLatest(fetchEventsRequested, fetchEventsRequestedSaga);
  yield* takeLatest(
    fetchSelectedEventParticipantsRequested,
    fetchSelectedEventParticipantsSaga
  );
  yield* takeLatest(fetchSelectedEventRequested, fetchSelectedEventSaga);
  yield* takeLatest(
    updateUserParticipationRequested,
    updateUserParticipationSaga
  );
}
