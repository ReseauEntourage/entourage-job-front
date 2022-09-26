import React from 'react';
import Layout from 'src/components/Layout';

import {
  ActionPartial,
  CandidatListPartial,
  LandingPagePartial,
  NumberPartial,
} from 'src/components/partials';

import Header from 'src/components/headers/Header';
import HowItWorks from 'src/components/partials/HowItWorks';
import AnnouncementPartial from 'src/components/partials/AnnouncementPartial';
import LinkedInPartial from 'src/components/partials/LinkedInPartial';

const Index = () => {
  return (
    <Layout>
      <LandingPagePartial />
      <Header isHome />
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
