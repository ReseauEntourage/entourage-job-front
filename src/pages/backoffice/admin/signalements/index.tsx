import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { ReportTargetList } from '@/src/features/backoffice/admin/reports';

const ReportsAdmin = () => {
  return (
    <LayoutBackOffice title="Signalements">
      <ReportTargetList />
    </LayoutBackOffice>
  );
};

export default ReportsAdmin;
