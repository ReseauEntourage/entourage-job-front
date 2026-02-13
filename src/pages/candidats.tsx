import React from 'react';

import { Layout } from '@/src/components/layouts/Layout';
import { CandidateTestimoniesOrientation } from '@/src/features/partials/common/CandidateTestimoniesOrientation';
import { SearchCandidates } from '@/src/features/partials/pages/Candidats/SearchCandidates';
import { ShareCandidatesCVTutorial } from '@/src/features/partials/pages/Candidats/ShareCandidatesCVTutorial';

const Candidats = () => {
  return (
    <Layout title="Les candidats - Entourage Pro">
      <SearchCandidates />
      <ShareCandidatesCVTutorial />
      <CandidateTestimoniesOrientation style="default" />
    </Layout>
  );
};
export default Candidats;
