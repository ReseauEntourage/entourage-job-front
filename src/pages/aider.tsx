import React from 'react';

import MainImg from 'public/static/img/aider-banner-desktop.jpg';
import MainImgMobile from 'public/static/img/aider-banner-mobile.jpg';
import Layout from 'src/components/Layout';
import { NewsletterPartial, SharePartial } from 'src/components/partials';
import CoachContainer from 'src/components/partials/Aider/CoachContainer';
import HelpCards from 'src/components/partials/Aider/HelpCards';
import InfoContainer from 'src/components/partials/Aider/InfoContainer';
import { ImageTitle } from 'src/components/partials/ImageTitleNew';
import { Grid, Section } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';

const Aider = () => {
  return (
    <Layout title="Aider - LinkedOut">
      <ImageTitle
        title="Vous souhaitez aider&nbsp;?"
        description="Engagez-vous et aidez les candidats LinkedOut à retrouver un réseau, que vous soyez disponibles quelques minutes ou quelques mois."
        img={MainImg}
        imgMobile={MainImgMobile}
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