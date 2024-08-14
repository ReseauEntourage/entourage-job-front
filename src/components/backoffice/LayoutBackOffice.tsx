import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Layout } from 'src/components/Layout';
import { GA_TAGS } from 'src/constants/tags';
import { gaEventWithUser } from 'src/lib/gtag';
import { selectCurrentUser } from 'src/use-cases/current-user';
import { selectShouldLaunchOnboarding } from 'src/use-cases/onboarding';
import { Onboarding } from './onboarding/Onboarding';

export const LayoutBackOffice = ({
  children,
  title = 'Espace personnel',
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const shouldLaunchOnboarding = useSelector(selectShouldLaunchOnboarding);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) {
      gaEventWithUser(GA_TAGS.BACKOFFICE_OPEN.action, {
        userHashId: currentUser.id,
        zone: currentUser.zone,
        role: currentUser.role,
      });
    }
  }, [currentUser]);

  return (
    <Layout title={`${title} - Entourage Pro`} noIndex isBackoffice>
      {shouldLaunchOnboarding && <Onboarding />}
      {children}
    </Layout>
  );
};
