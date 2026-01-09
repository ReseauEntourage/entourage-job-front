import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Dashboard } from '@/src/features/backoffice/dashboard';

const DashboardPage = () => {
  return (
    <LayoutBackOffice title="Mon tableau de bord">
      <Dashboard />
    </LayoutBackOffice>
  );
};

export default DashboardPage;
