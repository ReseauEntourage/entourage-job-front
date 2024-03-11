import React from 'react';
import { Layout } from 'src/components/Layout';
import { CandidateTestimoniesOrientation } from 'src/components/partials/common/CandidateTestimoniesOrientation';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';

import {
  // ActionPartial,
  CandidatListPartial,
  // LandingPagePartial,
  // LinkedInPartial,
  // NumberPartial,
  // HowItWorks,
} from 'src/components/partials/pages/HomePage';
import { Rejoindre } from 'src/components/partials/pages/HomePage/Rejoindre';
import { Figures } from 'src/components/partials/pages/HomePage/Figures';
import { Decouvrir } from 'src/components/partials/pages/HomePage/Decouvrir';
import { Engagement } from 'src/components/partials/pages/HomePage/Engagement';

const Index = () => {
  return (
    <Layout>
      <ImageTitle
        title="Le premier réseau professionnel solidaire"
        img="/static/img/cover-linkedout.jpg"
        imgMobile="/static/img/cover-linkedout.jpg"
        alt="entourage pro réseau solidaire professionnel"
        cta={
          [
            {
              label: 'Devenir candidat(e)',
              href: '/travailler',
              style: 'custom-secondary-inverted',
              dataTest: 'banner-cta',
            },{
              label: 'Devenir coach',
              href: '/aider',
              style: 'custom-secondary',
              dataTest: 'banner-cta',
            }
          ]
        }
      />
      <Decouvrir />

      <Rejoindre />
      <CandidatListPartial />
      <CandidateTestimoniesOrientation noVideo style="muted" title="Ils en parlent mieux que nous"/>

      {/* <LandingPagePartial /> */}
      {/* <HowItWorks style="default" /> */}
      {/* <NumberPartial /> */}
      <Figures />
      <Engagement />
      {/* <ActionPartial style="default" /> */}
      {/* <LinkedInPartial /> */}
    </Layout>
  );
};

export default Index;
