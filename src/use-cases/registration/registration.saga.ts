import { call, put, select, takeLatest } from 'typed-redux-saga';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import { selectIsLastRegistrationStep } from './registration.selectors';
import { slice } from './registration.slice';

const {
  createUserFailed,
  setRegistrationCurrentStepData,
  setRegistrationStep,
  setRegistrationIsLoading,
} = slice.actions;

export function* setRegistrationCurrentStepDataSaga() {
  const isLastRegistrationStep = yield* select(selectIsLastRegistrationStep);
  if (isLastRegistrationStep) {
    yield* put(setRegistrationIsLoading(true));
    // const data = yield* select(sselectRegistrationData);

    try {
      // TODO send info to API
      // yield* put(createUserSucceeded());
    } catch (err) {
      yield* put(createUserFailed());
    }
  }
}

export function* setRegistrationStepSaga() {
  // Necessary to force render of form on step change
  yield* call(() => asyncTimeout(500));
  yield* put(setRegistrationIsLoading(false));
}

export function* saga() {
  yield* takeLatest(
    setRegistrationCurrentStepData,
    setRegistrationCurrentStepDataSaga
  );
  yield* takeLatest(setRegistrationStep, setRegistrationStepSaga);
}
