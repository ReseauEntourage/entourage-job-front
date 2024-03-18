import React, { useRef } from 'react';
import { Layout } from 'src/components/Layout';

import { Impact } from 'src/components/partials/common/Impact';
import { Decouvrir } from 'src/components/partials/pages/Orienter/Decouvrir';
import { EnSavoirPlus } from 'src/components/partials/pages/Orienter/EnSavoirPlus';
import { Inscrire } from 'src/components/partials/pages/Orienter/Inscrire';
import { Opportunites } from 'src/components/partials/pages/Orienter/Opportunites';
import { Publier } from 'src/components/partials/pages/Orienter/Publier';
import { VideoSection } from 'src/components/partials/pages/Orienter/VideoSection';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import {
  LogoList,
  // Reviews,
} from 'src/components/partials/utils/LogoList';
import { Reviews } from 'src/components/partials/utils/Reviews';
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
  const refInscrire = useRef(null);
  const refPublier = useRef(null);
  const handleClick = (element) => {
    if (element.current) {
      element.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Layout title="Orienter - Entourage Pro">
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
            Entourage Pro, accélérez leur retour à l&lsquo;emploi !
          </>
        }
      />

      <Decouvrir
        handleClick={handleClick}
        refInscrire={refInscrire}
        refPublier={refPublier}
      />

      <Inscrire innerRef={refInscrire} />

      <VideoSection
        videoId="gUuaeDxlqTE"
        videoTitle="Rencontre avec Najaf, ancien candidat Entourage Pro à Paris"
        coloredBackground
      />
      <Publier innerRef={refPublier} />

      <VideoSection
        videoId="WLmDL-pB1NE"
        videoTitle="Atelier décroche un Job - L'Accélérateur (EITI) X Entourage Pro"
      />

      <Opportunites />

      {/* change style */}
      <Reviews
        reviews={reviews}
        title="Plus de 60 entreprises partenaires nous font confiance à Entourage Pro"
      />

      {/* already done => only remove uikit */}
      {isDesktop && (
        <Section style="default">
          <H2
            title={
              <>
                <span className="orange">Ils travaillent</span> avec Entourage
                Pro
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
