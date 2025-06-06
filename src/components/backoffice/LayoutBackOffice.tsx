import React from 'react';
import { useSelector } from 'react-redux';
import { Layout } from 'src/components/Layout';
import { UserRoles } from 'src/constants/users';
import { selectAuthenticatedUser } from 'src/use-cases/current-user';
import { selectShouldLaunchOnboarding } from 'src/use-cases/onboarding';
import { Onboarding } from './onboarding/Onboarding';

export const LayoutBackOffice = ({
  children,
  title = 'Espace personnel',
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const user = useSelector(selectAuthenticatedUser);
  const userRole = user?.role;
  const shouldLaunchOnboarding = useSelector(selectShouldLaunchOnboarding);

  const userRoleHasOnboarding =
    userRole === UserRoles.CANDIDATE || userRole === UserRoles.COACH;

  return (
    <Layout title={`${title} - Entourage Pro`} noIndex isBackoffice>
      {shouldLaunchOnboarding && userRoleHasOnboarding && <Onboarding />}
      {children}
    </Layout>
  );
};
