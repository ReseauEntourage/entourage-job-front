import { useRouter } from 'next/router';
import React from 'react';
import { ReportTargetType } from '@/src/api/types';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { ReportTargetPage } from '@/src/features/backoffice/admin/reports';

const ReportTargetAdmin = () => {
  const { query, isReady } = useRouter();
  const targetType = query.targetType as ReportTargetType | undefined;
  const targetId = query.targetId as string | undefined;

  return (
    <LayoutBackOffice title="Signalement">
      {!isReady || !targetType || !targetId ? (
        <LoadingScreen />
      ) : (
        <ReportTargetPage targetType={targetType} targetId={targetId} />
      )}
    </LayoutBackOffice>
  );
};

export default ReportTargetAdmin;
