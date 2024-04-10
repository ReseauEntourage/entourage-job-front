import React, { useCallback, useRef } from 'react';
import { Layout } from 'src/components/Layout';
import { NewsletterPartial } from 'src/components/partials/common/NewsletterPartial';
import { SharePartial } from 'src/components/partials/common/SharePartial';
import { AiderDecouvrir } from 'src/components/partials/pages/Aider/AiderDecouvrir';
import { AiderOpportunites } from 'src/components/partials/pages/Aider/AiderOpportunites';
import { AiderRejoindre } from 'src/components/partials/pages/Aider/AiderRejoindre';
import {
  AiderProgramme360,
  AiderProgrammeCoupDePouce,
} from 'src/components/partials/pages/Aider/Programmes';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { Reviews } from 'src/components/partials/utils/Reviews';
import { Section } from 'src/components/utils';
import { GA_TAGS } from 'src/constants/tags';

const reviewContent = [
  {
    review: (
      <>
        “ Entourage Pro m’apporte une ouverture d’esprit encore plus grande,{' '}
        l’envie d’aider les autres se concrétise vraiment avec ce projet ! ”
      </>
    ),
    author: 'Chloé',
    industry: 'coach de Soraya',
    image: '',
  },
  {
    review: (
      <>
        “ Je me suis retrouvé confronté à un tout autre univers, ça m’a fait
        évoluer... Zabiullah m’appelle « mon ami » maintenant ! ”
      </>
    ),
    author: 'Damien',
    industry: 'coach de Zabiullah',
    image: '',
  },
  {
    review: (
      <>
        “ C’est hyper enrichissant humainement. Chaque minute que tu passes est
        utile au candidat, à sa progression,à la manière dont il voit les
        choses. ”
      </>
    ),
    author: 'Marie',
    industry: 'coach de Léo',
    image: '',
  },
];

const Aider = () => {
  const refCoupDePouce = useRef(null);
  const refProgramme360 = useRef(null);
  const handleClick = useCallback((element) => {
    if (element.current) {
      element.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, []);
  return (
    <Layout title="Aider - Entourage Pro">
      <ImageTitle
        title="Vous souhaitez aider&nbsp;?"
        description={
          <>
            Ça tombe bien, nos candidates et candidats
            <br />
            ont besoin de vous&nbsp;!
          </>
        }
        img="/static/img/aider-banner-desktop.jpg"
        imgMobile="/static/img/aider-banner-mobile.jpg"
        alt="Un candidat Entourage Pro et sa coach"
      />
      <AiderDecouvrir
        handleClick={handleClick}
        refCoupDePouce={refCoupDePouce}
        refProgramme360={refProgramme360}
      />
      <AiderProgrammeCoupDePouce innerRef={refCoupDePouce} />
      <AiderProgramme360 innerRef={refProgramme360} />
      <AiderOpportunites />
      <Reviews
        title="Paroles de coachs ! Quelques témoignages"
        reviews={reviewContent}
      />
      <AiderRejoindre />
      <NewsletterPartial tag={GA_TAGS.PAGE_AIDER_INSCRIPTION_NEWSLETTER_CLIC} />
      <Section style="muted">
        <SharePartial />
      </Section>
    </Layout>
  );
};

export default Aider;
