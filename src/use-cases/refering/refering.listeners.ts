import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { referingApi, REFER_CANDIDATE_FIXED_CACHE_KEY } from './refering.api';
import {
  selectIsLastReferingStep,
  selectReferingData,
} from './refering.selectors';
import { slice } from './refering.slice';

/**
 * Translates `setReferingCurrentStepDataSaga`: submits the candidate when
 * the step just written is the last one.
 */
listenerMiddleware.startListening({
  actionCreator: slice.actions.setReferingCurrentStepData,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as never;
    if (!selectIsLastReferingStep(state)) {
      return;
    }

    listenerApi.dispatch(slice.actions.setReferingIsLoading(true));
    listenerApi.dispatch(
      referingApi.endpoints.referCandidate.initiate(selectReferingData(state), {
        fixedCacheKey: REFER_CANDIDATE_FIXED_CACHE_KEY,
      })
    );
  },
});

/** Translates `setReferingStepSaga` — forces a render on step change. */
listenerMiddleware.startListening({
  actionCreator: slice.actions.setReferingStep,
  effect: async (_action, listenerApi) => {
    await listenerApi.delay(500);
    listenerApi.dispatch(slice.actions.setReferingIsLoading(false));
  },
});
