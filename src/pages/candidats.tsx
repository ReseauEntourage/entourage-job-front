import React from 'react';

import { Layout } from 'src/components/Layout';
import {
  ShareCandidatesCVTutorial,
  CandidateTestimoniesOrientation,
  SearchCandidates,
} from 'src/components/partials';

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
