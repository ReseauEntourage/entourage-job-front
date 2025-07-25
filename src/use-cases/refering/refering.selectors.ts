import _ from 'lodash';
import {
  LastStepContent,
  REFERING_FIRST_STEP,
  ReferingErrorMessages,
  ReferingFormData,
  ReferingFormDataKeys,
  ReferingLastStepContent,
  ReferingStep,
  ReferingStepContent,
  ReferingStepContents,
  SkippedByKeysUnion,
} from 'src/components/backoffice/referer/Refering/Refering.types';
import {
  flattenReferingData,
  incrementReferingStep,
} from 'src/components/backoffice/referer/Refering/Refering.utils';
import { assertIsDefined } from 'src/utils/asserts';
import { referCandidateAdapter } from './refering.adapters';
import { RootState } from './refering.slice';

export const referCandidateSelectors =
  referCandidateAdapter.getSelectors<RootState>(
    (state) => state.refering.referCandate
  );

export function selectReferCandidateError(state: RootState) {
  return state.refering.referCandidateError;
}

export function selectIsEmptyReferingData(state: RootState) {
  return _.isEmpty(state.refering.data);
}

export function selectReferingData(state: RootState) {
  return state.refering.data;
}

export function selectReferingCurrentStep(
  state: RootState
): ReferingStep | null {
  return state.refering.currentStep;
}

export function selectDefinedReferingCurrentStep(state: RootState) {
  const currentStep = selectReferingCurrentStep(state);

  assertIsDefined(currentStep, ReferingErrorMessages.CURRENT_STEP);

  return currentStep;
}

export function selectReferingNextStep(state: RootState): ReferingStep {
  const currentStep = selectDefinedReferingCurrentStep(state);
  return incrementReferingStep(currentStep);
}

export function selectIsFirstReferingStep(state: RootState): boolean {
  return state.refering.currentStep === REFERING_FIRST_STEP;
}

export function selectIsLastReferingStep(state: RootState): boolean {
  const nextStep = selectReferingNextStep(state);
  const isFirstStep = selectIsFirstReferingStep(state);

  if (isFirstStep) {
    return false;
  }

  return !ReferingStepContents[nextStep];
}

export function selectIsReferingLoading(state: RootState) {
  return state.refering.isLoading;
}

export function selectReferingCurrentStepData(
  state: RootState
): ReferingFormData | null {
  const currentStep = selectDefinedReferingCurrentStep(state);
  return state.refering.data[currentStep] || null;
}

export function selectReferingCurrentStepContent(
  state: RootState
): ReferingStepContent {
  const currentStep = selectDefinedReferingCurrentStep(state);

  const stepContent = ReferingStepContents[currentStep];

  assertIsDefined(stepContent, ReferingErrorMessages.STEP_CONTENT);

  return stepContent;
}

export function selectReferingConfirmationStepContent(): ReferingLastStepContent {
  return LastStepContent;
}

export function selectReferingDataFromOtherStep(
  state: RootState
): Partial<ReferingFormData> | null {
  const isFirstStep = selectIsFirstReferingStep(state);
  const stepContent = selectReferingCurrentStepContent(state);

  if (!isFirstStep && stepContent.dependsOn) {
    const data = selectReferingData(state);
    const allStepsData = flattenReferingData(data);

    // Flatten the union of all the form values to get each key and its value
    // That way we are able to use the name of the specific field key to get its value if another form in the refering process needs the value of a preceding form
    const res = stepContent.dependsOn.reduce((acc, curr) => {
      return { ...acc, [curr]: allStepsData[curr] };
    }, {} as ReferingFormData);
    return res;
  }

  return null;
}

export function selectReferingShouldSkipStep(state: RootState) {
  const valuesFromOtherStep = selectReferingDataFromOtherStep(state);
  const stepContent = selectReferingCurrentStepContent(state);

  const skippedByArray = stepContent.skippedBy;
  let skipNextStep = false;

  if (skippedByArray && valuesFromOtherStep) {
    const keys = Object.keys(skippedByArray) as SkippedByKeysUnion[];

    // All conditions should be met to skip the step
    keys.some((key) => {
      let thisKeyShouldSkip = false;

      // Keys with simple logic
      if (valuesFromOtherStep[key as ReferingFormDataKeys]) {
        // check if skippedByArray[key] contains a value from valuesFromOtherStep[key]
        if (Array.isArray(valuesFromOtherStep[key as ReferingFormDataKeys])) {
          thisKeyShouldSkip = _.isEqual(
            valuesFromOtherStep[key as ReferingFormDataKeys],
            skippedByArray[key]
          );
        } else {
          thisKeyShouldSkip = _.includes(
            skippedByArray[key] as string[],
            valuesFromOtherStep[key as ReferingFormDataKeys]
          );
        }
      }
      return (skipNextStep = skipNextStep || thisKeyShouldSkip);
    });
  }
  return skipNextStep;
}
