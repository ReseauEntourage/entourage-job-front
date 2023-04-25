import React from 'react';

import Layout from 'src/components/Layout.tsx';
import { ShareCandidatesCVTutorial } from 'src/components/partials';
import SearchCandidates from 'src/components/partials/SearchCandidates';
import CandidateTestimoniesOrientation from 'src/components/partials/CandidateTestimoniesOrientation.tsx';

const Candidats = () => {
  return (
    <Layout title="Les candidats - LinkedOut">
      <SearchCandidates />
      <ShareCandidatesCVTutorial />
      <CandidateTestimoniesOrientation style="default" />
    </Layout>
  );
};
export default Candidats;
