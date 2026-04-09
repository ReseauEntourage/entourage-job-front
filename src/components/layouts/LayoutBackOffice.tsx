import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from '@/src/components/layouts/Layout';
import { Onboarding } from '@/src/features/backoffice/onboardingLegacy/Onboarding';
import { useAchievementProgressionModal } from '@/src/hooks/gamification/useAchievementProgressionModal';
import { gamificationActions } from '@/src/use-cases/gamification';
import { selectShouldLaunchOnboarding } from '@/src/use-cases/onboardingOld';

export const LayoutBackOffice = ({
  children,
  title = 'Espace personnel',
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const dispatch = useDispatch();
  const shouldLaunchOnboarding = useSelector(selectShouldLaunchOnboarding);

  useEffect(() => {
    dispatch(gamificationActions.fetchAchievementProgressionInitial());
  }, [dispatch]);

  useAchievementProgressionModal();

  return (
    <Layout title={`${title} - Entourage Pro`} noIndex isBackoffice>
      {shouldLaunchOnboarding && <Onboarding />}
      {children}
    </Layout>
  );
};
