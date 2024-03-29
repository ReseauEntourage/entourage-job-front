import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  onboardingActions,
  selectCurrentOnboardingStep,
  validateLastStepOnboardingSelectors,
} from 'src/use-cases/onboarding';
import { FlattenedOnboardingFormData } from './Onboarding.types';
import { parseOnboadingFields } from './Onboarding.utils';

export const useOnboarding = () => {
  const dispatch = useDispatch();

  const onboardingCurrentStep = useSelector(selectCurrentOnboardingStep);

  useEffect(() => {
    dispatch(onboardingActions.launchOnboarding());
  }, []);

  const onSubmitLastStepOnboarding = useCallback(
    (fields: Partial<FlattenedOnboardingFormData>) => {
      const fieldsToSend = parseOnboadingFields(fields);
      dispatch(
        onboardingActions.validateLastStepOnboardingRequested(fieldsToSend)
      );
    },
    [dispatch]
  );

  const onSubmitFirstSecondStepOnboarding = useCallback(
    (fields: Partial<FlattenedOnboardingFormData>) => {
      const fieldsToSend = parseOnboadingFields(fields);
      dispatch(
        onboardingActions.validateFirstSecondStepOnboardingRequested(
          fieldsToSend
        )
      );
    },
    [dispatch]
  );

  const onBeforeStep = useCallback(() => {
    dispatch(onboardingActions.decreaseOnboardingStep());
  }, [dispatch]);

  const validateLastStepOnboardingStatus = useSelector(
    validateLastStepOnboardingSelectors.selectValidateLastStepOnboardingStatus
  );

  useEffect(() => {
    if (validateLastStepOnboardingStatus === ReduxRequestEvents.SUCCEEDED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: 'Profil complété avec succès',
        })
      );
    }
  }, [validateLastStepOnboardingStatus, dispatch]);

  return {
    onboardingCurrentStep,
    onSubmitLastStepOnboarding,
    onSubmitFirstSecondStepOnboarding,
    onBeforeStep,
  };
};
