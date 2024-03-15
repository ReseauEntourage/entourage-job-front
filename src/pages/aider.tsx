import React from 'react';
import { Layout } from 'src/components/Layout';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial';
import { SharePartial } from 'src/components/partials/common/SharePartial';

import { CoachContainer } from 'src/components/partials/pages/Aider/CoachContainer';
import { HelpCards } from 'src/components/partials/pages/Aider/HelpCards';
import { InfoContainer } from 'src/components/partials/pages/Aider/InfoContainer';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { Grid, Section } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';

const Aider = () => {
  return (
    <Layout title="Aider - Entourage Pro">
      <ImageTitle
        title="Vous souhaitez aider&nbsp;?"
        description="Engagez-vous et aidez les candidats Entourage Pro à retrouver un réseau, que vous soyez disponibles quelques minutes ou quelques mois."
        img="/static/img/aider-banner-desktop.jpg"
        imgMobile="/static/img/aider-banner-mobile.jpg"
        alt="Un candidat Entourage Pro et sa coach"
      />
      <HelpCards />
      <InfoContainer />
      <CoachContainer />
      <Section style="default">
        <Grid gap="large" column>
          <NewsletterPartial
            padding={false}
            tag={GA_TAGS.PAGE_AIDER_INSCRIPTION_NEWSLETTER_CLIC}
          />
          <SharePartial />
        </Grid>
      </Section>
    </Layout>
  );
};

export default Aider;
