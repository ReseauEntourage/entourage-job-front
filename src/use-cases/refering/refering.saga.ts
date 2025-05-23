import { call, put, select, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import { isConflictError } from 'src/api/axiosErrors';
import { flattenReferingData } from 'src/components/backoffice/referer/Refering/Refering.utils';
import { formatCareerPathSentence } from 'src/utils/Formatting';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import {
  selectDefinedReferingSelectedProgram,
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
  const selectedProgram = yield* select(selectDefinedReferingSelectedProgram);

  const {
    searchBusinessLine0,
    searchBusinessLine1,
    searchAmbition0,
    searchAmbition1,
    confirmReferingRules,
    ...flattenedData
  } = flattenReferingData(data);

  try {
    yield* call(() =>
      Api.postUserRefering({
        ...flattenedData,
        program: selectedProgram,
        searchAmbitions: searchBusinessLine0
          ? formatCareerPathSentence({ searchAmbition0, searchAmbition1 })
              .searchAmbitions
          : undefined,
        searchBusinessLines: searchBusinessLine0
          ? formatCareerPathSentence({
              searchBusinessLine0,
              searchBusinessLine1,
            }).searchBusinessLines
          : undefined,
        department: flattenedData.department.value,
        helpNeeds: flattenedData.helpNeeds
          ? flattenedData.helpNeeds.map((expectation) => ({
              name: expectation,
            }))
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
