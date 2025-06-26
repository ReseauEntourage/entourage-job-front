import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { Dashboard } from 'src/components/backoffice/dashboard';

const DashboardPage = () => {
  return (
    <LayoutBackOffice title="Mon tableau de bord">
      <Dashboard />
    </LayoutBackOffice>
  );
};

export default DashboardPage;
