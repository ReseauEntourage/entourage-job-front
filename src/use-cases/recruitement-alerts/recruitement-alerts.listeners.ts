import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import {
  FETCH_RECRUITEMENT_ALERTS_FIXED_CACHE_KEY,
  recruitementAlertsApi,
} from './recruitement-alerts.api';
import { slice } from './recruitement-alerts.slice';

const { actions } = slice;

/** Translates `fetchRecruitementAlertsSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchRecruitementAlertsAction,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      recruitementAlertsApi.endpoints.fetchRecruitementAlerts.initiate(
        undefined,
        { fixedCacheKey: FETCH_RECRUITEMENT_ALERTS_FIXED_CACHE_KEY }
      )
    );
  },
});

/** Translates `createRecruitementAlertSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.createRecruitementAlertAction,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      recruitementAlertsApi.endpoints.createRecruitementAlert.initiate(
        action.payload
      )
    );
  },
});

/** Translates `deleteRecruitementAlertSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.deleteRecruitementAlertAction,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      recruitementAlertsApi.endpoints.deleteRecruitementAlert.initiate(
        action.payload
      )
    );
  },
});

/** Translates `updateRecruitementAlertSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.updateRecruitementAlertAction,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      recruitementAlertsApi.endpoints.updateRecruitementAlert.initiate(
        action.payload
      )
    );
  },
});

/** Translates `fetchRecruitementAlertMatchingSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.fetchRecruitementAlertMatchingAction,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      recruitementAlertsApi.endpoints.fetchRecruitementAlertMatching.initiate(
        action.payload
      )
    );
  },
});
