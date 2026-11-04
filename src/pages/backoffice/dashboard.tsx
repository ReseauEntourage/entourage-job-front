import React from 'react';
import { useSelector } from 'react-redux';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { UserRoles } from '@/src/constants/users';
import { AdminDashboard, Dashboard } from '@/src/features/backoffice/dashboard';
import { selectCurrentUser } from '@/src/use-cases/current-user';

const DashboardPage = () => {
  // The nullable selector: the page can render before the user is loaded
  const currentUser = useSelector(selectCurrentUser);

  return (
    <LayoutBackOffice title="Mon tableau de bord">
      {currentUser?.role === UserRoles.ADMIN ? (
        <AdminDashboard />
      ) : (
        <Dashboard />
      )}
    </LayoutBackOffice>
  );
};

export default DashboardPage;
