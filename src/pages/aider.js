import React from 'react';
import { Button, Grid, Section } from 'src/components/utils';
import { NewsletterPartial, SharePartial } from 'src/components/partials';
import { EXTERNAL_LINKS } from 'src/constants';
import Layout from 'src/components/Layout';
import { gaEvent } from 'src/lib/gtag';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';
import { fbEvent } from 'src/lib/fb';

import ImageTitle from 'src/components/partials/ImageTitleNew';
import HelpCards from 'src/components/partials/Aider/HelpCards';
import InfoContainer from 'src/components/partials/Aider/InfoContainer';
import MainImg from 'public/static/img/aider-banner-desktop.jpg';
import MainImgMobile from 'public/static/img/aider-banner-mobile.jpg';
import CoachContainer from 'src/components/partials/Aider/CoachContainer';

const Aider = () => {
  return (
    <Layout title="Aider - LinkedOut">
      <ImageTitle
        title="Vous souhaitez aider&nbsp;?"
        description="Engagez-vous et aidez les candidats LinkedOut à retrouver un réseau, que vous soyez disponibles quelques minutes ou quelques mois."
        img={MainImg}
        imgMobile={MainImgMobile}
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
