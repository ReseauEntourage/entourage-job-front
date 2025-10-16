import React from 'react';
import { useSelector } from 'react-redux';
import { selectShouldLaunchOnboarding } from '@/src/use-cases/onboarding';
import { Layout } from 'src/components/Layout';
import { Onboarding } from './onboarding/Onboarding';

export const LayoutBackOffice = ({
  children,
  title = 'Espace personnel',
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const shouldLaunchOnboarding = useSelector(selectShouldLaunchOnboarding);

  return (
    <Layout title={`${title} - Entourage Pro`} noIndex isBackoffice>
      {shouldLaunchOnboarding && <Onboarding />}
      {children}
    </Layout>
  );
};
