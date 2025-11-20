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

export function* saga() {
  yield* takeLatest(fetchEventsWithFilters, fetchEventsWithFiltersSaga);
  yield* takeLeading(fetchEventsNextPage, fetchEventsNextPageSaga);
  yield* takeLatest(fetchEventsRequested, fetchEventsRequestedSaga);
}
