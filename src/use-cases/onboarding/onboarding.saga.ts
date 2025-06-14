import { call, delay, put, select, take, takeLatest } from 'typed-redux-saga';
import { currentUserActions, selectAuthenticatedUser } from '../current-user';
import { Api } from 'src/api';
import { DocumentNames } from 'src/constants';
import {
  selectOnboardingCurrentStep,
  selectOnboardingData,
  selectUserRoleOnboarding,
} from './onboarding.selectors';
import { slice } from './onboarding.slice';
import {
  findNextNotSkippableStep,
  parseOnboadingProfileFields,
} from './onboarding.utils';

const {
  setOnboardingStep,
  sendStepDataOnboardingRequested,
  sendStepDataOnboardingSucceeded,
  sendStepDataOnboardingFailed,
  setOnboardingIsLoading,
  launchOnboarding,
  endOnboarding,
  setOnboardingCurrentStepData,
} = slice.actions;

export function* launchOnboardingSaga() {
  const currentUser = yield* select(selectAuthenticatedUser);
  const nextStep = findNextNotSkippableStep(0, currentUser);
  yield* put(setOnboardingStep(nextStep));
}

export function* sendStepDataOnboardingSaga() {
  const data = yield* select(selectOnboardingData);
  const userRole = yield* select(selectUserRoleOnboarding);
  const currentStep = yield* select(selectOnboardingCurrentStep);
  const user = yield* select(selectAuthenticatedUser);

  const { id: userId } = user;

  if (!userRole) {
    throw new Error('User role is not defined in onboarding state');
  }

  const stepData = data[currentStep]?.[userRole];
  const {
    externalCv,
    hasAcceptedEthicsCharter,
    nationality,
    accommodation,
    hasSocialWorker,
    resources,
    studiesLevel,
    workingExperience,
    jobSearchDuration,
    ...otherData
  } = stepData;

  const socialSituationFields = {
    nationality,
    accommodation,
    hasSocialWorker,
    resources,
    studiesLevel,
    workingExperience,
    jobSearchDuration,
  };

  const userProfileFields = parseOnboadingProfileFields(otherData);
  try {
    yield* call(() => Api.putUserProfile(userId, userProfileFields));

    // Check if step contains externalCv and user has uploaded one, upload it and wait for it to complete
    // externalCv is an array of File
    if (externalCv && externalCv[0]) {
      const formData = new FormData();
      formData.append('file', externalCv[0]);
      yield* put(currentUserActions.uploadExternalCvRequested(formData));

      // wait for the query to complete
      const action = yield* take([
        currentUserActions.uploadExternalCvSucceeded.type,
        currentUserActions.uploadExternalCvFailed.type,
      ]);

      while (
        action.type !== currentUserActions.uploadExternalCvSucceeded.type &&
        action.type !== currentUserActions.uploadExternalCvFailed.type
      ) {
        yield* delay(1000);
      }
    }

    // Check if user has accepted the ethics charter
    if (hasAcceptedEthicsCharter === true) {
      yield* call(() =>
        Api.postReadDocument(
          { documentName: DocumentNames.CharteEthique },
          userId
        )
      );
    }

    if (Object.keys(stepData).includes('nationality')) {
      yield* call(() =>
        Api.updateUserSocialSituation(userId, {
          hasCompletedSurvey: true,
          ...socialSituationFields,
        })
      );
    }
    yield* put(sendStepDataOnboardingSucceeded());

    // calculate with updated user data
    const nextStep = findNextNotSkippableStep(
      currentStep,
      yield* select(selectAuthenticatedUser)
    );
    yield* put(setOnboardingStep(nextStep));
    if (currentStep === nextStep) {
      yield* put(endOnboarding());
    }

    const isLastStep = nextStep === currentStep; // If next step is the same as the current step, it means we are on the last step
    if (isLastStep) {
      // Refresh the user to get the updated data
      yield* put(currentUserActions.fetchCompleteUserRequested());
    }
  } catch {
    yield* put(
      sendStepDataOnboardingFailed({
        error: 'NOT_SAVE_DATA',
      })
    );
  }
}

export function* setOnboardingCurrentStepDataSaga() {
  yield* put(setOnboardingIsLoading(true));
  yield* put(sendStepDataOnboardingRequested());
}

export function* setOnboardingStepSaga() {
  // Necessary to force render of form on step change
  yield* put(setOnboardingIsLoading(false));
}

export function* saga() {
  yield* takeLatest(launchOnboarding, launchOnboardingSaga);
  yield* takeLatest(
    sendStepDataOnboardingRequested,
    sendStepDataOnboardingSaga
  );
  yield* takeLatest(
    setOnboardingCurrentStepData,
    setOnboardingCurrentStepDataSaga
  );
  yield* takeLatest(setOnboardingStep, setOnboardingStepSaga);
}
