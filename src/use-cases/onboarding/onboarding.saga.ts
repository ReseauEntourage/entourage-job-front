import { call, delay, put, select, take, takeLatest } from 'typed-redux-saga';
import { currentUserActions, selectAuthenticatedUser } from '../current-user';
import { Api } from 'src/api';
import { CompanyGoal, UpdateCompanyDto } from 'src/api/types';
import {
  CandidateCoachStepData,
  CompanyStepData,
  OnboardingFlow,
} from 'src/components/backoffice/onboarding/Onboarding.types';
import { DocumentNames } from 'src/constants';
import {
  selectOnboardingCurrentStep,
  selectOnboardingData,
  selectOnboardingFlow,
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
  const flow = yield* select(selectOnboardingFlow);

  if (!flow) {
    throw new Error('Onboarding flow is not defined');
  }

  const nextStep = findNextNotSkippableStep(0, currentUser, flow);
  yield* put(setOnboardingStep(nextStep));
}

export function* sendStepDataOnboardingSaga() {
  const data = yield* select(selectOnboardingData);
  const flow = yield* select(selectOnboardingFlow);
  const currentStep = yield* select(selectOnboardingCurrentStep);
  const user = yield* select(selectAuthenticatedUser);

  const { id: userId } = user;

  if (!flow) {
    throw new Error('Onboarding flow is not defined in onboarding state');
  }

  const stepData = data[currentStep]?.[flow];

  if (!stepData) {
    throw new Error('Step data not found for the current step and flow');
  }

  const hasAcceptedEthicsCharter =
    'hasAcceptedEthicsCharter' in stepData
      ? (stepData.hasAcceptedEthicsCharter as boolean)
      : undefined;

  // Check if user has accepted the ethics charter
  if (hasAcceptedEthicsCharter === true) {
    yield* call(() =>
      Api.postReadDocument(
        { documentName: DocumentNames.CharteEthique },
        userId
      )
    );
  }

  try {
    // Extract fields based on the onboarding flow
    if (flow === OnboardingFlow.COMPANY) {
      const {
        description,
        logo,
        businessSectorIds,
        departmentId,
        url,
        linkedInUrl,
        hiringUrl,
        goal,
      } = stepData as CompanyStepData;

      let companyGoalValue: CompanyGoal | undefined;
      if (goal) {
        if (goal.length > 1) {
          companyGoalValue = CompanyGoal.BOTH;
        } else {
          const [firstGoal] = goal;
          companyGoalValue = firstGoal as CompanyGoal;
        }
      } else {
        companyGoalValue = undefined;
      }

      // Create an object for company profile data
      const companyFields: UpdateCompanyDto = {
        description,
        url,
        linkedInUrl,
        hiringUrl,
        goal: companyGoalValue,
        departmentId: departmentId?.value as string,
        businessSectorIds:
          businessSectorIds?.map(
            (businessSectorId) => businessSectorId.value
          ) ?? undefined,
      };

      // Update the company user profile
      yield* call(() => Api.updateCompany(companyFields));

      // Upload company logo
      if (logo && logo[0]) {
        const formData = new FormData();
        formData.append('file', logo[0]);
        yield* call(() => Api.updateCompanyLogo(formData));
      }
    } else {
      // Handle CANDIDATE and COACH flows
      const {
        externalCv,
        nationality,
        accommodation,
        hasSocialWorker,
        resources,
        studiesLevel,
        workingExperience,
        jobSearchDuration,
        ...otherData
      } = stepData as CandidateCoachStepData;

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

      if (Object.keys(stepData).includes('nationality')) {
        yield* call(() =>
          Api.updateUserSocialSituation(userId, {
            hasCompletedSurvey: true,
            ...socialSituationFields,
          })
        );
      }
    }
    yield* put(sendStepDataOnboardingSucceeded());

    const nextStep = findNextNotSkippableStep(
      currentStep,
      yield* select(selectAuthenticatedUser),
      flow
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
