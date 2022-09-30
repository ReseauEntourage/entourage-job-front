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
import { useMount } from 'src/hooks/utils';
import { openModal } from 'src/components/modals/Modal';
import SailInfoModal from 'src/components/modals/SailInfoModal';

const Index = () => {
  useMount(() => {
    if (!process.env.HIDE_HOME_POPUP) {
      setTimeout(() => {
        openModal(<SailInfoModal />);
      }, 1500);
    }
  });

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
