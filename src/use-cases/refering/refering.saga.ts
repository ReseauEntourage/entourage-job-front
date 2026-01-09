import { call, put, select, takeLatest } from 'typed-redux-saga';
import { Nudge } from '@/src/api/types';
import { flattenReferingData } from '@/src/features/backoffice/referer/Refering/Refering.utils';
import { Api } from 'src/api';
import { isConflictError } from 'src/api/axiosErrors';
import { formatCareerPathSentence } from 'src/utils/Formatting';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import {
  selectIsLastReferingStep,
  selectReferingData,
} from './refering.selectors';
import { slice } from './refering.slice';

const {
  referCandidateSucceeded,
  referCandidateRequested,
  referCandidateFailed,
  setReferingCurrentStepData,
  setReferingIsLoading,
  setReferingStep,
} = slice.actions;

export function* referCandidateSagaRequested() {
  const data = yield* select(selectReferingData);

  const {
    businessSectorId0,
    businessSectorId1,
    occupation0,
    occupation1,
    confirmReferingRules,
    nudgeIds,
    ...flattenedData
  } = flattenReferingData(data);

  try {
    yield* call(() =>
      Api.postUserRefering({
        ...flattenedData,
        sectorOccupations: formatCareerPathSentence({
          businessSectorId0,
          businessSectorId1,
          occupation0,
          occupation1,
        }),
        department: flattenedData.department.value,
        nudges: nudgeIds?.length
          ? nudgeIds.map((id) => {
              return {
                id,
              } as Nudge;
            })
          : undefined,
      })
    );
    yield* put(referCandidateSucceeded());
  } catch (err) {
    if (isConflictError(err)) {
      yield* put(
        referCandidateFailed({
          error: 'DUPLICATE_EMAIL',
        })
      );
    } else {
      yield* put(referCandidateFailed(null));
    }
  }
}

export function* setReferingCurrentStepDataSaga() {
  const isLastReferingStep = yield* select(selectIsLastReferingStep);
  if (isLastReferingStep) {
    yield* put(setReferingIsLoading(true));
    yield* put(referCandidateRequested());
  }
}

export function* setReferingStepSaga() {
  // Necessary to force render of form on step change
  yield* call(() => asyncTimeout(500));
  yield* put(setReferingIsLoading(false));
}

export function* saga() {
  yield* takeLatest(referCandidateRequested, referCandidateSagaRequested);
  yield* takeLatest(setReferingCurrentStepData, setReferingCurrentStepDataSaga);
  yield* takeLatest(setReferingStep, setReferingStepSaga);
}
