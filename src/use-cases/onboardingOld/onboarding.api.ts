import { Api } from '@/src/api';
import { UpdateCompanyDto } from '@/src/api/types';
import { DocumentNames } from '@/src/constants';
import { CompanyGoal } from '@/src/constants/company';
import {
  CompanyStepData,
  OnboardingFlow,
  OnboardingFormData,
  OnboardingStep,
} from '@/src/features/backoffice/onboardingLegacy/Onboarding.types';
import { api } from '@/src/store/api/api.slice';
import { currentUserActions, selectAuthenticatedUser } from '../current-user';
import { slice } from './onboarding.slice';
import { findNextNotSkippableStep } from './onboarding.utils';

const { setOnboardingStep, endOnboarding, setOnboardingIsLoading } =
  slice.actions;

// `'NOT_SAVE_DATA'` (not `null`): RTK Query treats a `queryFn` result with a
// falsy `error` and no `data` as invalid.
export type SendStepDataOnboardingError = 'NOT_SAVE_DATA';

/**
 * Triggered only by `onboarding.listeners.ts` (the auto-submit chain on
 * `setOnboardingCurrentStepData`) — not observed directly by any component,
 * so no `fixedCacheKey` is exported for consumers.
 */
export const SEND_STEP_DATA_ONBOARDING_FIXED_CACHE_KEY =
  'sendStepDataOnboarding';

interface SendStepDataOnboardingArg {
  flow: OnboardingFlow;
  currentStep: OnboardingStep;
  stepData: OnboardingFormData;
  userId: string;
}

/** Translates `sendStepDataOnboardingSaga`. */
export const onboardingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendStepDataOnboarding: builder.mutation<void, SendStepDataOnboardingArg>({
      queryFn: async ({ flow, stepData, userId }) => {
        const hasAcceptedEthicsCharter =
          'hasAcceptedEthicsCharter' in stepData
            ? (stepData.hasAcceptedEthicsCharter as boolean)
            : undefined;

        try {
          // Check if user has accepted the ethics charter
          if (hasAcceptedEthicsCharter === true) {
            await Api.postReadDocument(
              { documentName: DocumentNames.CharteEthique },
              userId
            );
          }

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
            await Api.updateCompany(companyFields);

            // Upload company logo
            if (logo && logo[0]) {
              const formData = new FormData();
              formData.append('file', logo[0]);
              await Api.updateCompanyLogo(formData);
            }
          }

          return { data: undefined };
        } catch {
          return { error: 'NOT_SAVE_DATA' as SendStepDataOnboardingError };
        }
      },
      onQueryStarted: async (
        { flow, currentStep },
        { dispatch, getState, queryFulfilled }
      ) => {
        try {
          await queryFulfilled;

          const currentUser = selectAuthenticatedUser(getState() as never);
          const nextStep = findNextNotSkippableStep(
            currentStep,
            currentUser,
            flow
          );
          dispatch(setOnboardingStep(nextStep));

          if (currentStep === nextStep) {
            // If next step is the same as the current step, it means we are
            // on the last step.
            dispatch(endOnboarding());
            // Refresh the user to get the updated data
            dispatch(currentUserActions.fetchCurrentProfileCompleteRequested());
          }
        } catch {
          dispatch(setOnboardingIsLoading(false));
        }
      },
    }),
  }),
});
