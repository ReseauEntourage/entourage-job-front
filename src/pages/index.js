import React from 'react';
import { Layout } from 'src/components/Layout';

import {
  ActionPartial,
  CandidatListPartial,
  LandingPagePartial,
  NumberPartial,
  AnnouncementPartial,
  LinkedInPartial,
  HowItWorks,
} from 'src/components/partials';

const Index = () => {
  return (
    <Layout>
      <LandingPagePartial />
      <CandidatListPartial />
      <AnnouncementPartial />
      <HowItWorks style="default" />
      <NumberPartial />
      <ActionPartial style="default" />
      <LinkedInPartial />
    </Layout>
  );
};

export default Index;
