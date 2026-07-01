import React, { useCallback, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { User } from '@/src/api/types';
import { WizardStep } from '@/src/features/wizard/shell/wizard.types';
import { currentUserActions } from '@/src/use-cases/current-user';
import { updateSocialSituationSelectors } from '@/src/use-cases/current-user';
import { fetchCurrentUserSocialSituationSelectors } from '@/src/use-cases/current-user';
import { onboardingActions } from '@/src/use-cases/onboarding';
import { Content } from './Content';
import type { SocialSituationFormValues } from './types';

interface UseWizardStepSocialSituationProps {
  user: User | null;
}

export const useOnboardingStepSocialSituation = ({
  user,
}: UseWizardStepSocialSituationProps) => {
  const dispatch = useDispatch();
  const userRef = useRef(user);

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
  const fetchSocialSituationDeferredRef = useRef<{
    promise: Promise<boolean>;
    resolve: (value: boolean) => void;
  } | null>(null);

  const formMethods = useForm<SocialSituationFormValues>({
    defaultValues: {},
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: false,
  });

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

  const onboardingStepSocialSituation = {
    summary: {
      title: 'Dites-nous en plus sur vous',
      duration: '~1-2 minutes',
      description:
        'Décrivez-nous votre situation personnelle et professionnelle',
    },
    title:
      'Quelques infos pour vous proposer le bon soutien, tout est facultatif.',
    smallTitle: 'Votre situation',
    description: null,
    onSubmit: async () => {
      return await new Promise<boolean>((resolve) => {
        formMethods.handleSubmit(
          async (values) => {
            resolve(await waitForSocialSituationUpdate(values));
          },
          async () => {
            dispatch(
              onboardingActions.setFormErrorMessage(
                'Veuillez compléter les champs obligatoires avant de passer à l’étape suivante.'
              )
            );
            resolve(false);
          }
        )();
      });
    },
    content: (
      <FormProvider {...formMethods}>
        <Content />
      </FormProvider>
    ),
    confirmationStep: {
      title: 'Merci pour ces informations !',
      subtitle:
        'Ces informations nous aideront à mieux vous accompagner dans votre parcours.',
      submitBtnTxt: 'Passer à l’étape suivante',
      id: 'social-situation-confirmation',
    },
    isStepCompleted: async () => {
      const ok = await waitForSocialSituationFetch();
      if (!ok) {
        return false;
      }
      return !!userRef.current?.userSocialSituation?.hasCompletedSurvey;
    },
    section: 'profil',
  } as WizardStep;

  return { onboardingStepSocialSituation };
};
