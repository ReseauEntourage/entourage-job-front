import React from 'react';
import { useSelector } from 'react-redux';
import { Layout } from '@/src/components/layouts/Layout';
import { Onboarding } from '@/src/features/backoffice/onboardingLegacy/Onboarding';
import { useAchievementProgressionModal } from '@/src/hooks/gamification/useAchievementProgressionModal';
import { useGetAchievementProgressionQuery } from '@/src/use-cases/gamification';
import { selectShouldLaunchOnboarding } from '@/src/use-cases/onboardingOld';

export const LayoutBackOffice = ({
  children,
  title = 'Espace personnel',
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const shouldLaunchOnboarding = useSelector(selectShouldLaunchOnboarding);

  useGetAchievementProgressionQuery();

  useAchievementProgressionModal();

  return (
    <Layout title={`${title} - Entourage Pro`} noIndex isBackoffice>
      {shouldLaunchOnboarding && <Onboarding />}
      {children}
    </Layout>
  );
};
