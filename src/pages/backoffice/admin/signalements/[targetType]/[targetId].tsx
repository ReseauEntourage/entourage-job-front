import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { ReportTargetType } from '@/src/api/types';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { ReportTargetPage } from '@/src/features/backoffice/admin/reports';

const ReportTargetAdmin = () => {
  const router = useRouter();
  const { query, isReady } = router;
  const targetType = query.targetType as ReportTargetType | undefined;
  const targetId = query.targetId as string | undefined;

  // Opened once from a Slack alert: a reload must not open it again
  const dropAction = useCallback(() => {
    const { action, ...rest } = router.query;
    if (action === undefined) {
      return;
    }
    router.replace({ pathname: router.pathname, query: rest }, undefined, {
      shallow: true,
    });
  }, [router]);

  return (
    <LayoutBackOffice title="Signalement">
      {!isReady || !targetType || !targetId ? (
        <LoadingScreen />
      ) : (
        <ReportTargetPage
          targetType={targetType}
          targetId={targetId}
          openResolve={query.action === 'resolve'}
          onResolveOpened={dropAction}
        />
      )}
    </LayoutBackOffice>
  );
};

export default ReportTargetAdmin;
