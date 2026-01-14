import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Section } from '@/src/components/ui';
import { OnboardingStatus } from '@/src/constants/onboarding';
import { StepsSummary } from '@/src/features/backoffice/onboarding/steps-summary/StepsSummary';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '@/src/features/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';

const OnboardingHome = () => {
  const authenticatedUser = useAuthenticatedUser();
  const router = useRouter();

  useEffect(() => {
    // If the user has already completed the onboarding, redirect to the run page
    if (
      authenticatedUser &&
      authenticatedUser.onboardingStatus === OnboardingStatus.IN_PROGRESS
    ) {
      router.push('/backoffice/onboarding/run');
    }
  }, [authenticatedUser, router]);

  if (
    authenticatedUser &&
    authenticatedUser.onboardingStatus === OnboardingStatus.IN_PROGRESS
  ) {
    return null; // Or a loading spinner while redirecting
  }

  return (
    <LayoutBackOffice title="Bien démarrer">
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <HeaderBackoffice
            title="Bienvenue dans la communauté Entourage Pro"
            description="Prêt à faire vos premiers pas ? On vous a préparé une petite formation avant de vous lancer !"
            noSeparator
          />
        </Section>
      </StyledBackgroundedHeaderBackoffice>
      <Section className="custom-page">
        <StepsSummary />
      </Section>
    </LayoutBackOffice>
  );
};

export default OnboardingHome;
