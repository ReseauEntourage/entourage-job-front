import { call, put, select, takeLatest } from 'typed-redux-saga';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import { selectIsLastOnboardingStep } from './onboarding.selectors';
import { slice } from './onboarding.slice';

const {
  createUserFailed,
  setOnboardingCurrentStepData,
  setOnboardingStep,
  setOnboardingIsLoading,
} = slice.actions;

export function* setOnboardingCurrentStepDataSaga() {
  const isLastOnboardingStep = yield* select(selectIsLastOnboardingStep);
  if (isLastOnboardingStep) {
    yield* put(setOnboardingIsLoading(true));
    // const data = yield* select(selectOnboardingData);

    try {
      // TODO send info to API
      // yield* put(createUserSucceeded());
    } catch (err) {
      yield* put(createUserFailed());
    }
  }
}

export function* setOnboardingStepSaga() {
  // Necessary to force render of form on step change
  yield* call(() => asyncTimeout(500));
  yield* put(setOnboardingIsLoading(false));
}

export function* saga() {
  yield* takeLatest(
    setOnboardingCurrentStepData,
    setOnboardingCurrentStepDataSaga
  );
  yield* takeLatest(setOnboardingStep, setOnboardingStepSaga);
}
