import React from 'react';
import { Layout } from 'src/components/Layout';
import { CandidateTestimoniesOrientation } from 'src/components/partials/common/CandidateTestimoniesOrientation';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { CandidatListPartial } from 'src/components/partials/pages/HomePage';
import { Rejoindre } from 'src/components/partials/pages/HomePage/Rejoindre';
import { Figures } from 'src/components/partials/pages/HomePage/Figures';
import { Decouvrir } from 'src/components/partials/pages/HomePage/Decouvrir';
import { Engagement } from 'src/components/partials/pages/HomePage/Engagement';
import { NousSoutenir } from 'src/components/partials/common/NousSoutenir';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

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
              onClick: () => {
                gaEvent(GA_TAGS.HOME_BANNER_CANDIDAT_CLICK);
              }
            },{
              label: 'Devenir coach',
              href: '/aider',
              style: 'custom-secondary',
              dataTest: 'banner-cta',
              onClick: () => {
                gaEvent(GA_TAGS.HOME_BANNER_COACH_CLICK);
              }
            }
          ]
        }
      />
      <Decouvrir />
      <Rejoindre />
      <CandidatListPartial />
      <CandidateTestimoniesOrientation noVideo style="muted" title="Ils en parlent mieux que nous"/>
      <Figures />
      <Engagement />
      <NousSoutenir />
      <NewsletterPartial
          tag={GA_TAGS.HOME_INSCRIPTION_NEWSLETTER_CLIC}
        />
    </Layout>
  );
};

export default Index;
