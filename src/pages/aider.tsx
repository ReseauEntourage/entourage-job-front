import React from 'react';
import { Layout } from '@/src/components/layouts/Layout';
import { GA_TAGS } from '@/src/constants/tags';
import { openModal } from '@/src/features/modals/Modal';
import { NewsletterPartial } from '@/src/features/partials/common/NewsletterPartial';
import { WhyUseEp } from '@/src/features/partials/common/WhyUserEP/WhyUseEp';
import { PageHero } from '@/src/features/partials/utils/PageHero';
import { gaEvent } from '@/src/lib/gtag';
import { STORAGE_KEYS } from '../constants';
import { PinnedCommunicationModale } from '../features/modals/PopupModal/PinnedCommunicationModale';
import { InviteToRegisterSection } from '../features/partials/common/InviteToRegisterSection/InviteToRegisterSection';
import { ShareSection } from '../features/partials/common/ShareSection/ShareSection';
import { CoachFormatHighlights } from '../features/partials/pages/Aider/CoachFormatHighlights/CoachFormatHighlights';
import { CoachHowItWorks } from '../features/partials/pages/Aider/CoachHowItWorks/CoachHowItWorks';
import { CoachReassurance } from '../features/partials/pages/Aider/CoachReassurance/CoachReassurance';
import { CoachRessources } from '../features/partials/pages/Aider/CoachRessources/CoachRessources';
import { CoachingVideo } from '../features/partials/pages/Aider/CoachingVideo/CoachingVideo';
import { WhoAreCandidates } from '../features/partials/pages/Aider/WhoAreCandidates/WhoAreCandidates';
import { useUtm } from '../hooks/queryParams/useUTM';
import { useMount } from '../hooks/utils';

const Aider = () => {
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
    <Layout title="Aider - Entourage Pro">
      <PageHero
        title={
          <>
            Devenez coach Entourage Pro
            <br />
            et donnez le coup de pouce
            <br />
            qui change tout.
          </>
        }
        description={
          <>
            Partagez votre expérience et votre réseau pour soutenir des
            candidats en situation de précarité et isolés dans leur recherche
            d’emploi. Une façon simple, humaine et flexible de vous engager en
            faveur de l’égalité des chances !
          </>
        }
        img="/static/img/coach-hero-desktop.png"
        alt="Un candidat Entourage Pro et sa coach"
        cta={{
          label: 'Je deviens coach',
          onClick: () => gaEvent(GA_TAGS.PAGE_AIDER_CTA_BANNER_CLICK),
          href: '/wizard',
        }}
      />

      <CoachFormatHighlights />

      <CoachHowItWorks />

      <WhoAreCandidates />

      <CoachingVideo />

      <CoachReassurance />

      <CoachRessources />

      <WhyUseEp as="Coach" />

      <InviteToRegisterSection
        as="Coach"
        onClick={() => gaEvent(GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC)}
      />

      <NewsletterPartial tag={GA_TAGS.PAGE_AIDER_INSCRIPTION_NEWSLETTER_CLIC} />
      <ShareSection />
    </Layout>
  );
};

export default Aider;
