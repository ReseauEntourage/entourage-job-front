import React from 'react';
import { Layout } from 'src/components/Layout';
import { useOnboardingCheck } from 'src/hooks/useOnboardingCheck';
import { Onboarding } from './onboarding/Onboarding';

export const LayoutBackOffice = ({
  children,
  title = 'Espace personnel',
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const { shouldLaunchOnboarding } = useOnboardingCheck();

  return (
    <Layout title={`${title} - Entourage Pro`} noIndex isBackoffice>
      {shouldLaunchOnboarding && <Onboarding />}
      {children}
    </Layout>
  );
};
