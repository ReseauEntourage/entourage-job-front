import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import { UserRoles } from '@/src/constants/users';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import {
  selectCurrentUser,
  selectCurrentUserCompany,
} from '@/src/use-cases/current-user';
import {
  createUserSelectors,
  registrationActions,
  selectCreateUserError,
  selectIsRegistrationLoading,
  selectRegistrationCurrentStep,
  selectRegistrationNextStep,
  selectRegistrationSelectedFlow,
  selectRegistrationShouldSkipStep,
} from '@/src/use-cases/registration';
import { notificationsActions } from 'src/use-cases/notifications';
import { useWizardStepCandidateInfo } from './steps/StepInfos/useWizardStepCandidateInfo';
import { useWizardStepCoachInfo } from './steps/StepInfos/useWizardStepCoachInfo';
import { useWizardStepAccount } from './steps/useWizardStepAccount';
import { useWizardStepCandidateEligibility } from './steps/useWizardStepCandidateEligibility';
import { useWizardStepCompanyRole } from './steps/useWizardStepCompanyRole';
import { useWizardStepCompanySelection } from './steps/useWizardStepCompanySelection';
import { useWizardStepNetworkPreview } from './steps/useWizardStepNetworkPreview';
import { useWizardStepNudges } from './steps/useWizardStepNudges';
import { useWizardStepRefererAccount } from './steps/useWizardStepRefererAccount';
import { useWizardStepSectorsJobs } from './steps/useWizardStepSectorsJobs';

export interface UseRegistrationWizardReturn {
  wizardSteps: WizardStep[];
  currentWizardIdx: number;
  currentWizardStep: WizardStep | null;
  incrementStep: () => Promise<void>;
  decrementStep: () => void;
  canGoBack: boolean;
  isLoading: boolean;
  effectiveFlow: RegistrationFlow | null;
}

export function useRegistrationWizard(): UseRegistrationWizardReturn {
  const dispatch = useDispatch();

  const selectedFlow = useSelector(selectRegistrationSelectedFlow);
  const currentUser = useSelector(selectCurrentUser);
  const currentUserCompany = useSelector(selectCurrentUserCompany);
  const currentStep = useSelector(selectRegistrationCurrentStep);
  const isLoading = useSelector(selectIsRegistrationLoading);
  const nextStep = useSelector(selectRegistrationNextStep);
  const shouldSkipStep = useSelector(selectRegistrationShouldSkipStep);
  const createUserStatus = useSelector(
    createUserSelectors.selectCreateUserStatus
  );
  const createUserError = useSelector(selectCreateUserError);

  // Step hooks (always called, rules of hooks)
  const { step: candidateInfoStep } = useWizardStepCandidateInfo();
  const { step: candidateEligibilityStep } =
    useWizardStepCandidateEligibility();
  const { step: coachInfoStep } = useWizardStepCoachInfo();
  const { step: companyRoleStep } = useWizardStepCompanyRole();
  const { step: companySelectionStep } = useWizardStepCompanySelection();
  const { step: accountStep } = useWizardStepAccount();
  const { step: refererAccountStep } = useWizardStepRefererAccount();
  const { step: nudgesStep } = useWizardStepNudges();
  const { step: sectorsJobsStep } = useWizardStepSectorsJobs();
  const { step: networkPreviewStep } = useWizardStepNetworkPreview();

  // Quand selectedFlow est null (utilisateur déjà connecté en onboarding),
  // on déduit le flow depuis son rôle pour afficher les étapes passées dans le stepper
  const effectiveFlow = useMemo(() => {
    if (selectedFlow) {
      return selectedFlow;
    }
    if (!currentUser) {
      return null;
    }
    if (currentUserCompany) {
      return RegistrationFlow.COMPANY;
    }
    switch (currentUser.role) {
      case UserRoles.CANDIDATE:
        return RegistrationFlow.CANDIDATE;
      case UserRoles.COACH:
        return RegistrationFlow.COACH;
      case UserRoles.REFERER:
        return RegistrationFlow.REFERER;
      default:
        return null;
    }
  }, [selectedFlow, currentUser, currentUserCompany]);

  // Steps array derived from effective flow
  const wizardSteps: WizardStep[] = useMemo(() => {
    switch (effectiveFlow) {
      case RegistrationFlow.CANDIDATE:
        return [
          nudgesStep,
          sectorsJobsStep,
          networkPreviewStep,
          candidateInfoStep,
          candidateEligibilityStep,
          accountStep,
        ];
      case RegistrationFlow.COACH:
        return [
          nudgesStep,
          sectorsJobsStep,
          networkPreviewStep,
          coachInfoStep,
          accountStep,
        ];
      case RegistrationFlow.REFERER:
        return [refererAccountStep];
      case RegistrationFlow.COMPANY:
        return [
          companyRoleStep,
          companySelectionStep,
          nudgesStep,
          sectorsJobsStep,
          coachInfoStep,
          networkPreviewStep,
          accountStep,
        ];
      default:
        return [];
    }
  }, [
    effectiveFlow,
    candidateInfoStep,
    candidateEligibilityStep,
    coachInfoStep,
    companyRoleStep,
    companySelectionStep,
    accountStep,
    refererAccountStep,
    nudgesStep,
    sectorsJobsStep,
    networkPreviewStep,
  ]);

  // currentStep starts at 0 (REGISTRATION_FIRST_STEP) after flow selection
  const currentWizardIdx = useMemo(
    () => Math.max(0, currentStep),
    [currentStep]
  );

  const currentWizardStep = wizardSteps[currentWizardIdx] ?? null;

  // Auto-skip steps when skippedBy condition is met
  useEffect(() => {
    if (shouldSkipStep) {
      dispatch(
        registrationActions.moveForwardInRegistration({ step: nextStep })
      );
    }
  }, [nextStep, shouldSkipStep, dispatch]);

  // Show error notification on failed account creation
  useEffect(() => {
    if (createUserStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message:
            createUserError === 'DUPLICATE_EMAIL'
              ? 'Cette adresse email est déjà utilisée'
              : "Une erreur est survenue lors de l'inscription",
        })
      );
    }
  }, [createUserStatus, createUserError, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(registrationActions.createUserReset());
    };
  }, [dispatch]);

  const incrementStep = useCallback(async () => {
    if (!currentWizardStep?.onSubmit) {
      return;
    }
    const result = await currentWizardStep.onSubmit();
    if (result === false) {
      return;
    }
    // Step advancement is driven by Redux state changes (no explicit dispatch needed)
  }, [currentWizardStep]);

  const decrementStep = useCallback(() => {
    dispatch(registrationActions.moveBackwardInRegistration());
  }, [dispatch]);

  const canGoBack = currentWizardIdx > 0;

  return {
    wizardSteps,
    currentWizardIdx,
    currentWizardStep,
    incrementStep,
    decrementStep,
    canGoBack,
    isLoading,
    effectiveFlow,
  };
}
