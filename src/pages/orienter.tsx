import React, { useRef } from 'react';
import { Layout } from 'src/components/Layout';
import {
  LogoList,
  // Reviews,
} from 'src/components/partials';
import { EnSavoirPlus } from 'src/components/partials/EnSavoirPlus';
import { ImageTitle } from 'src/components/partials/ImageTitle';
import { Reviews } from 'src/components/partials/Reviews';

import { Decouvrir } from 'src/components/partials/pages/Orienter/Decouvrir';
import { Impact } from 'src/components/partials/pages/Orienter/Impact';
import { Inscrire } from 'src/components/partials/pages/Orienter/Inscrire';
import { Opportunites } from 'src/components/partials/pages/Orienter/Opportunites';
import { Publier } from 'src/components/partials/pages/Orienter/Publier';
import { VideoSection } from 'src/components/partials/pages/Orienter/VideoSection';
import { Section } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { PARTNERS } from 'src/constants/partners';
import { useIsDesktop } from 'src/hooks/utils';

const reviews = [
  {
    image: '/static/img/temoignage-entreprise-stephane-danny.jpg',
    author: 'Stéphane',
    authorStatus: 'Recruteur de Danny',
    company: 'Les copains de Bastien',
    review: (
      <>
        &ldquo;Bien plus qu&apos;un candidat standard, on sent qu&apos;il y a un
        enjeu personnel et une dimension impactante&nbsp;!&ldquo;
      </>
    ),
  },
  {
    image: '/static/img/temoignage-entreprise-gregoire-mbemba.jpg',
    author: 'Grégoire',
    company: 'Dani Alu',
    authorStatus: "Recruteur de M'Bemba",
    review: (
      <>
        &ldquo;Le recrutement de M&apos;Bemba a ressoudé les équipes. Elles se
        sont investies dans un projet. Elles peuvent être très fières d’avoir
        fait en sorte que M&apos;Bemba soit épanoui et polyvalent dans
        l’atelier.&ldquo;
      </>
    ),
  },
];

const Orienter = () => {
  const isDesktop = useIsDesktop();
  const refDecouvrir1 = useRef(null);
  const refDecouvrir2 = useRef(null);
  const handleClick = (i: number) => {
    if (i === 1) {
      refDecouvrir1.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    } else {
      refDecouvrir2.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  return (
    <Layout title="Orienter - LinkedOut">
      {/* change picture AND component */}
      <ImageTitle
        img="/static/img/orienter-banner.jpg"
        // img={"/static/img/orienter-banner.png"}
        title={
          <>
            <span className="uk-text-primary">Travaillons ensemble</span> pour
            l&apos;accès&nbsp;à&nbsp;l’emploi
          </>
        }
        textColor="black"
        description={
          <>
            Vous accompagnez des personnes en situation d&lsquo;exclusion ? Avec
            LinkedOut, accélérez leur retour à l&ldquo;emploi !
          </>
        }
      />

      <Decouvrir handleClick={handleClick} />

      <Inscrire />
      <div ref={refDecouvrir1} />

      <VideoSection
        videoId="gUuaeDxlqTE"
        videoTitle="Rencontre avec Najaf, ancien candidat LinkedOut à Paris"
        coloredBackground
      />
      <Publier />
      <div ref={refDecouvrir2} />

      <VideoSection
        videoId="WLmDL-pB1NE"
        videoTitle="Atelier décroche un Job - L'Accélérateur (EITI) X Linkedout"
      />

      <Opportunites />

      {/* change style */}
      <Reviews
        reviews={reviews}
        title="Plus de 60 entreprises partenaires nous font confiance à LinkedOut"
      />

      {/* already done => only remove uikit */}
      {isDesktop && (
        <Section style="default">
          <H2
            title={
              <>
                <span className="orange">Ils travaillent</span> avec LinkedOut
              </>
            }
            color="black"
            center
          />
          <LogoList logos={PARTNERS.ORIENTATION} carousel />
        </Section>
      )}
      <Impact />
      <EnSavoirPlus />
    </Layout>
  );
};

export default Orienter;
