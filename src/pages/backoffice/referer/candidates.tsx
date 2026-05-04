import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { RefererCandidatesList } from '@/src/features/backoffice/referer/RefererCandidatesList/RefererCandidatesList';

const RefererCandidatesPage = () => {
  return (
    <LayoutBackOffice title="Suivi de vos candidats orientés">
      <RefererCandidatesList />
    </LayoutBackOffice>
  );
};

export default RefererCandidatesPage;
