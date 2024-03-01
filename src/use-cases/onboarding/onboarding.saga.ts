import { select, takeLatest } from 'typed-redux-saga';
import { selectIsLastOnboardingStep } from './onboarding.selectors';
import { slice } from './onboarding.slice';

const { setOnboardingCurrentStepData } = slice.actions;

export function* setOnboardingCurrentStepDataSaga() {
  const isLastOnboardingStep = yield* select(selectIsLastOnboardingStep);
  if (isLastOnboardingStep) {
    // TODO send info to API
  }
}

export function* saga() {
  yield* takeLatest(
    setOnboardingCurrentStepData,
    setOnboardingCurrentStepDataSaga
  );
}
