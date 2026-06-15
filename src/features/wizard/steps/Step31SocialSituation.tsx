import React, { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from 'src/components/ui';
import { Content } from 'src/features/backoffice/onboarding/steps/step-social-situation/Content';
import { useDispatch } from 'react-redux';
import { currentUserActions } from 'src/use-cases/current-user';

interface Step31SocialSituationProps {
  onNext: () => void;
}

export const Step31SocialSituation = ({ onNext }: Step31SocialSituationProps) => {
  const dispatch = useDispatch();
  const formMethods = useForm({
    defaultValues: {},
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    shouldUnregister: false,
  });

  const handleSubmit = formMethods.handleSubmit((values) => {
    dispatch(currentUserActions.updateSocialSituationRequested(values));
    onNext();
  });

  return (
    <div>
      <h2>Votre situation sociale</h2>
      <p>
        Ces informations restent confidentielles et nous permettent de mieux
        comprendre les besoins de nos bénéficiaires.
      </p>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit}>
          <Content />
          <div style={{ marginTop: 24 }}>
            <Button type="submit">Continuer</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
