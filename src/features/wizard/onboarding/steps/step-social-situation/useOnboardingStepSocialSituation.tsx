import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@/src/api/types';
import { Alert } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import {
  FormWithValidation,
  FormWithValidationRef,
} from '@/src/features/forms/FormWithValidation';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { useStepFormSubmit } from '@/src/features/wizard/useStepFormSubmit';
import { currentUserActions } from '@/src/use-cases/current-user';
import { updateSocialSituationSelectors } from '@/src/use-cases/current-user';
import { fetchCurrentUserSocialSituationSelectors } from '@/src/use-cases/current-user';
import { onboardingActions } from '@/src/use-cases/onboarding';
import { StyledCardList } from './Content.styles';
import { socialSituationFormSchema } from './SocialSituationFormSchema';
import type { SocialSituationFormValues } from './types';

interface UseWizardStepSocialSituationProps {
  user: User | null;
}

export const useOnboardingStepSocialSituation = ({
  user,
}: UseWizardStepSocialSituationProps) => {
  const dispatch = useDispatch();
  const userRef = useRef(user);
  const formRef = useRef<FormWithValidationRef>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const isFetchSocialSituationIdle = useSelector(
    fetchCurrentUserSocialSituationSelectors.selectIsFetchCurrentUserSocialSituationIdle
  );
  const isFetchSocialSituationSucceeded = useSelector(
    fetchCurrentUserSocialSituationSelectors.selectIsFetchCurrentUserSocialSituationSucceeded
  );
  const isFetchSocialSituationFailed = useSelector(
    fetchCurrentUserSocialSituationSelectors.selectIsFetchCurrentUserSocialSituationFailed
  );

  const isUpdateSucceeded = useSelector(
    updateSocialSituationSelectors.selectIsUpdateSocialSituationSucceeded
  );
  const isUpdateFailed = useSelector(
    updateSocialSituationSelectors.selectIsUpdateSocialSituationFailed
  );

  const submitResolveRef = useRef<((value: boolean) => void) | null>(null);
  const lastSubmitFailedRef = useRef(false);
  const fetchSocialSituationDeferredRef = useRef<{
    promise: Promise<boolean>;
    resolve: (value: boolean) => void;
  } | null>(null);

  const waitForSocialSituationUpdate = useCallback(
    (values: SocialSituationFormValues) => {
      dispatch(currentUserActions.updateSocialSituationReset());
      dispatch(currentUserActions.updateSocialSituationRequested(values));

      return new Promise<boolean>((resolve) => {
        submitResolveRef.current = resolve;
      });
    },
    [dispatch]
  );

  const waitForSocialSituationFetch = useCallback(() => {
    const hasCompletedSurvey =
      userRef.current?.userSocialSituation?.hasCompletedSurvey;
    if (typeof hasCompletedSurvey === 'boolean') {
      return Promise.resolve(true);
    }

    if (fetchSocialSituationDeferredRef.current) {
      return fetchSocialSituationDeferredRef.current.promise;
    }

    if (isFetchSocialSituationIdle) {
      dispatch(currentUserActions.fetchCurrentUserSocialSituationRequested());
    }

    let resolveFn!: (value: boolean) => void;
    const promise = new Promise<boolean>((resolve) => {
      resolveFn = resolve;
    });
    fetchSocialSituationDeferredRef.current = {
      promise,
      resolve: resolveFn,
    };
    return promise;
  }, [dispatch, isFetchSocialSituationIdle]);

  useEffect(() => {
    if (!fetchSocialSituationDeferredRef.current) {
      return;
    }

    if (isFetchSocialSituationSucceeded) {
      const { resolve } = fetchSocialSituationDeferredRef.current;
      fetchSocialSituationDeferredRef.current = null;
      resolve(true);
      return;
    }

    if (isFetchSocialSituationFailed) {
      const { resolve } = fetchSocialSituationDeferredRef.current;
      fetchSocialSituationDeferredRef.current = null;
      resolve(false);
    }
  }, [isFetchSocialSituationFailed, isFetchSocialSituationSucceeded]);

  useEffect(() => {
    if (!submitResolveRef.current) {
      return;
    }

    if (isUpdateSucceeded) {
      const resolve = submitResolveRef.current;
      submitResolveRef.current = null;
      resolve(true);
      return;
    }

    if (isUpdateFailed) {
      dispatch(
        onboardingActions.setFormErrorMessage(
          'Une erreur est survenue lors de l’enregistrement de votre situation. Veuillez réessayer.'
        )
      );
      const resolve = submitResolveRef.current;
      submitResolveRef.current = null;
      resolve(false);
    }
  }, [dispatch, isUpdateFailed, isUpdateSucceeded]);

  useEffect(() => {
    return () => {
      submitResolveRef.current = null;
      fetchSocialSituationDeferredRef.current = null;
    };
  }, []);

  const handleFormWithValidationSubmit = useCallback(
    async (values: SocialSituationFormValues) => {
      const success = await waitForSocialSituationUpdate(values);
      lastSubmitFailedRef.current = !success;
    },
    [waitForSocialSituationUpdate]
  );

  const submitViaForm = useStepFormSubmit(formRef);
  const onSubmit = useCallback(async () => {
    const validated = await submitViaForm();
    if (validated === false) {
      return false;
    }
    return lastSubmitFailedRef.current ? false : undefined;
  }, [submitViaForm]);

  const onboardingStepSocialSituation: WizardStep = {
    id: 'social-situation',
    hideGenericStepHeader: undefined,
    summary: {
      title: 'Dites-nous en plus sur vous',
      duration: '~1-2 minutes',
      description:
        'Décrivez-nous votre situation personnelle et professionnelle',
    },
    title:
      'Quelques infos pour vous proposer le bon soutien, tout est facultatif.',
    description: null,
    content: (
      <StyledCardList>
        <Alert type={AlertType.Info} variant="outlined">
          Ces informations ne sont pas obligatoires, et ne seront pas
          communiquées.
        </Alert>
        <FormWithValidation
          formSchema={socialSituationFormSchema}
          defaultValues={{}}
          onSubmit={handleFormWithValidationSubmit}
          noFooter
          innerRef={formRef}
        />
      </StyledCardList>
    ),
    onSubmit,
    isStepCompleted: async () => {
      const ok = await waitForSocialSituationFetch();
      if (!ok) {
        return false;
      }
      return !!userRef.current?.userSocialSituation?.hasCompletedSurvey;
    },
    section: 'profil',
  };

  return { onboardingStepSocialSituation };
};
