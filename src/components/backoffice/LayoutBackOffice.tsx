import React from 'react';
import { useSelector } from 'react-redux';
import { selectShouldLaunchOnboarding } from '@/src/use-cases/onboarding/onboarding.selectors';
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
<<<<<<< HEAD
=======
  const hasAcceptedEthicsCharter = user?.readDocuments.some(
    (doc) => doc.documentName === 'CharteEthique'
  );
  const userRoleHasOnboarding =
    userRole === UserRoles.CANDIDATE || userRole === UserRoles.COACH;
  const displayOnboarding =
    !hasAcceptedEthicsCharter &&
    shouldLaunchOnboarding &&
    userRoleHasOnboarding;
>>>>>>> d99c7299 (Update src/components/backoffice/LayoutBackOffice.tsx)

  return (
    <Layout title={`${title} - Entourage Pro`} noIndex isBackoffice>
      {shouldLaunchOnboarding && <Onboarding />}
      {children}
    </Layout>
  );
};
