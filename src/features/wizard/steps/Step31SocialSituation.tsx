import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Button, Text } from 'src/components/ui';
import { H2 } from 'src/components/ui/Headings';
import {
  StyledOnboardingActions,
  StyledOnboardingStepContainer,
} from 'src/features/backoffice/onboarding/onboarding.styles';
import { Content } from 'src/features/backoffice/onboarding/steps/step-social-situation/Content';
import { currentUserActions } from 'src/use-cases/current-user';

interface Step31SocialSituationProps {
  onNext: () => void;
}

export const Step31SocialSituation = ({
  onNext,
}: Step31SocialSituationProps) => {
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
    <StyledOnboardingStepContainer>
      <H2 title="Votre situation sociale" />
      <Text>
        Ces informations restent confidentielles et nous permettent de mieux
        comprendre les besoins de nos bénéficiaires.
      </Text>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit}>
          <Content />
          <StyledOnboardingActions>
            <Button onClick={() => handleSubmit()} size="large">
              Étape suivante
            </Button>
          </StyledOnboardingActions>
        </form>
      </FormProvider>
    </StyledOnboardingStepContainer>
  );
};
