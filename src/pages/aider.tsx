import React from 'react';

import { Layout } from 'src/components/Layout';
import { NewsletterPartial, SharePartial } from 'src/components/partials';
import { CoachContainer } from 'src/components/partials/Aider/CoachContainer/CoachContainer';
import { HelpCards } from 'src/components/partials/Aider/HelpCards/HelpCards';
import { InfoContainer } from 'src/components/partials/Aider/InfoContainer/InfoContainer';
import { ImageTitle } from 'src/components/partials/ImageTitleNew';
import { Grid, Section } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';

const Aider = () => {
  return (
    <Layout title="Aider - LinkedOut">
      <ImageTitle
        title="Vous souhaitez aider&nbsp;?"
        description="Engagez-vous et aidez les candidats LinkedOut à retrouver un réseau, que vous soyez disponibles quelques minutes ou quelques mois."
        img="/static/img/aider-banner-desktop.jpg"
        imgMobile="/static/img/aider-banner-mobile.jpg"
        alt="Un candidat LinkedOut et sa coach"
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
