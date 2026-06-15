import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'src/components/ui';
import { OnboardingStatus } from 'src/constants/onboarding';
import { currentUserActions } from 'src/use-cases/current-user';
import { wizardActions } from 'src/use-cases/wizard';
import {
  StyledDoneContainer,
  StyledDoneIcon,
  StyledDoneSubtitle,
  StyledDoneTitle,
} from './WizardDone.styles';

export const WizardDone = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(wizardActions.setWizardCompleted());
    dispatch(
      currentUserActions.updateOnboardingStatusRequested({
        onboardingStatus: OnboardingStatus.COMPLETED,
      })
    );
  }, [dispatch]);

  const handleGoToDashboard = () => {
    router.push('/backoffice/dashboard');
  };

  return (
    <StyledDoneContainer>
      <StyledDoneIcon>🎉</StyledDoneIcon>
      <StyledDoneTitle>Bienvenue dans la communauté !</StyledDoneTitle>
      <StyledDoneSubtitle>
        Votre profil est maintenant créé. Découvrez les membres qui peuvent vous
        aider et commencez à tisser des liens.
      </StyledDoneSubtitle>
      <Button onClick={handleGoToDashboard}>Accéder à mon espace</Button>
    </StyledDoneContainer>
  );
};
