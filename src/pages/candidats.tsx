import React from 'react';

import { Layout } from 'src/components/Layout';
import { SearchCandidates } from 'src/components/partials/pages/Candidats/SearchCandidates';
import { CandidateTestimoniesOrientation } from 'src/components/partials/common/CandidateTestimoniesOrientation';
import { ShareCandidatesCVTutorial } from 'src/components/partials/pages/Candidats/ShareCandidatesCVTutorial';

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
