import React from 'react';
import { Layout } from 'src/components/Layout';

import {
  ActionPartial,
  CandidatListPartial,
  LandingPagePartial,
  // LinkedInPartial,
  HowItWorks,
} from 'src/components/partials/';

import { NumberPartial } from 'src/components/partials/pages/HomePage/NumberPartial';

const Index = () => {
  return (
    <Layout>
      <LandingPagePartial />
      <CandidatListPartial />
      <HowItWorks style="default" />
      <NumberPartial />
      <ActionPartial style="default" />
      {/* <LinkedInPartial /> */}
    </Layout>
  );
};

export default Index;
