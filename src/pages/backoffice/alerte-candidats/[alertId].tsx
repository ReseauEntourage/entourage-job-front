import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AlertCandidates } from '@/src/components/backoffice/alertCandidates/AlertCandidates';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { selectCurrentUser } from 'src/use-cases/current-user';

const AlertCandidatesPage = () => {
  const router = useRouter();
  const { alertId } = router.query;
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!alertId || typeof alertId !== 'string') {
      return;
    }
    if (!currentUser) {
      router.push('/login');
    }
  }, [alertId, currentUser, router]);

  if (!currentUser || !alertId) {
    return null;
  }

  return (
    <LayoutBackOffice title="Candidats correspondants">
      <AlertCandidates alertId={alertId as string} />
    </LayoutBackOffice>
  );
};

export default AlertCandidatesPage;
