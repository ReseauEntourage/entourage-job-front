import React from 'react';
import { Layout } from 'src/components/Layout';

import {
  ActionPartial,
  CandidatListPartial,
  LandingPagePartial,
  NumberPartial,
  HowItWorks,
} from 'src/components/partials/pages/HomePage';

const Index = () => {
  return (
    <Layout>
      <LandingPagePartial />
      <CandidatListPartial />
      <HowItWorks style="default" />
      <NumberPartial />
      <ActionPartial style="default" />
    </Layout>
  );
};

export default Index;
