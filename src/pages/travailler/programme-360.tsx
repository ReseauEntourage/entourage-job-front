import React from 'react';
import { Layout } from 'src/components/Layout';
import { CandidateTestimoniesOrientation } from 'src/components/partials/common/CandidateTestimoniesOrientation';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial/NewsletterPartial';
import { PartnersWorkingWithUs } from 'src/components/partials/common/Partners/PartnersWorkingWithUs/PartnersWorkingWithUs';
import { SharePartial } from 'src/components/partials/common/SharePartial';
import { Participer } from 'src/components/partials/pages/Travailler/360/Participer';
import { Rejoindre } from 'src/components/partials/pages/Travailler/360/Rejoindre';
import { Steps } from 'src/components/partials/pages/Travailler/360/Steps';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { Section } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';

const Programme360 = () => {
  return (
    <Layout title="Format 360 - Entourage Pro">
      <ImageTitle
        title="Entourage Pro, un tremplin vers l’emploi"
        description={
          <>
            Vous êtes dans une situation de précarité ou d’exclusion ? <br />{' '}
            Vous avez un projet professionnel mais vous n’avez pas de réseau ?
          </>
        }
        img="/static/img/travailler-banner.jpg"
        imgMobile="/static/img/travailler-banner.jpg"
        alt="Candidats Entourage Pro en recherche d’emploi"
        cta={{
          label: 'Rejoindre Entourage Pro',
          href: '/inscription',
          style: 'custom-secondary-inverted',
          dataTest: 'banner-cta',
        }}
      />
      <Participer />
      <Rejoindre />
      <Steps />
      <CandidateTestimoniesOrientation noTitle noVideo style="muted" />
      <PartnersWorkingWithUs />
      <Section style="custom-primary">
        <NewsletterPartial
          padding={false}
          tag={GA_TAGS.PAGE_AIDER_INSCRIPTION_NEWSLETTER_CLIC}
        />
      </Section>
      <Section style="custom-primary">
        <SharePartial />
      </Section>
    </Layout>
  );
};

export default Programme360;
