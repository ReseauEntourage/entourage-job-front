import React from 'react';
import { openModal } from '../components/modals/Modal';
import { PinnedCommunicationModale } from '../components/modals/PopupModal/PinnedCommunicationModale';
import { STORAGE_KEYS } from '../constants';
import { useUtm } from '../hooks/queryParams/useUTM';
import { useMount } from '../hooks/utils';
import { Layout } from 'src/components/Layout';
import { CandidateTestimoniesOrientation } from 'src/components/partials/common/CandidateTestimoniesOrientation';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial';
import { NousSoutenir } from 'src/components/partials/common/NousSoutenir';
import { PartnersSupportUs } from 'src/components/partials/common/Partners/PartnersSupportUs/PartnersSupportUs';
import { PartnersWorkingWithUs } from 'src/components/partials/common/Partners/PartnersWorkingWithUs/PartnersWorkingWithUs';
import { CandidatListPartial } from 'src/components/partials/pages/HomePage';
import { Decouvrir } from 'src/components/partials/pages/HomePage/Decouvrir';
import { Engagement } from 'src/components/partials/pages/HomePage/Engagement';
import { Figures } from 'src/components/partials/pages/HomePage/Figures';
import { Rejoindre } from 'src/components/partials/pages/HomePage/Rejoindre';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

const Index = () => {
  useUtm();
  useMount(() => {
    const closed = localStorage.getItem(
      STORAGE_KEYS.PINNED_COMMUNICATION_CLOSED
    );
    if (process.env.NEXT_PUBLIC_PINNED_COMMUNICATION_TITLE && !closed) {
      setTimeout(() => {
        openModal(<PinnedCommunicationModale />);
      }, 1500);
    }
  });
  return (
    <Layout>
      <ImageTitle
        title={
          <>
            Le premier réseau
            <br /> professionnel solidaire
          </>
        }
        img="/static/img/home-banner.jpg"
        imgMobile="/static/img/home-banner.jpg"
        alt="Entourage Pro réseau solidaire professionnel"
        cta={[
          {
            label: 'Devenir candidat(e)',
            href: '/travailler',
            variant: 'primary',
            dataTest: 'banner-cta',
            onClick: () => {
              gaEvent(GA_TAGS.HOME_BANNER_CANDIDAT_CLICK);
            },
          },
          {
            label: 'Devenir coach',
            href: '/aider',
            variant: 'secondary',
            dataTest: 'banner-cta',
            onClick: () => {
              gaEvent(GA_TAGS.HOME_BANNER_COACH_CLICK);
            },
          },
        ]}
      />
      <Decouvrir />
      <Rejoindre />
      <CandidatListPartial />
      <CandidateTestimoniesOrientation
        noVideo
        style="muted"
        title="Ils en parlent mieux que nous"
      />
      <Figures />
      <Engagement />
      <PartnersSupportUs tag={GA_TAGS.HOME_PARTNERS_CLICK} displayCta={false} />
      <PartnersWorkingWithUs tag={GA_TAGS.HOME_PARTNERS_CLICK} />
      <NousSoutenir />
      <NewsletterPartial tag={GA_TAGS.HOME_INSCRIPTION_NEWSLETTER_CLIC} />
    </Layout>
  );
};

export default Index;
