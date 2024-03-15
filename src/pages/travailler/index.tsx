import React, { useRef } from 'react';
import { Layout } from 'src/components/Layout';

import { Decouvrir } from 'src/components/partials/pages/Travailler/Decouvrir';
import { Impact } from 'src/components/partials/common/Impact';
import { VideoSection } from 'src/components/partials/pages/Orienter/VideoSection';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { LogoList } from 'src/components/partials/utils/LogoList';
import { Reviews } from 'src/components/partials/utils/Reviews';
import { Section } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { PARTNERS } from 'src/constants/partners';
import { useIsDesktop } from 'src/hooks/utils';
import { Programme360, ProgrammeCoupDePouce } from 'src/components/partials/pages/Travailler/Programmes';

const reviews = [
    {
      image: '/static/img/temoignage-entreprise-stephane-danny.jpg',
      author: 'Elicia',
      authorStatus: 'accompagnée par l’Accélérateur a trouvé chez Kiko',
      review: (
        <>
          “ Maintenant j’arrive à plus parler aux gens, à aller vers les autres, c’est grâce à LinkedOut. Je faisais la paresseuse avant, et là, ça m’a donné envie de me donner à fond.”
        </>
      ),
    },
    {
      image: '/static/img/temoignage-entreprise-gregoire-mbemba.jpg',
      author: 'Mike',
      authorStatus: "candidat EntouragePro",
      review: (
        <>
          “ LinkedOut vous vous êtes bougés pour moi, et par le réseau j’ai pu rencontrer plein de professionnels qui m’ont motivés dans ma recherche”
        </>
      ),
    },
    {
      image: '/static/img/temoignage-entreprise-gregoire-mbemba.jpg',
      author: 'Grégoire',
      authorStatus: "Recruteur de M'Bemba Dani Alu",
      review: (
        <>
          “ Le recrutement de M'Bemba a ressoudé les équipes. Elles se sont investies dans un projet. Elles peuvent être très fières d’avoir fait en sorte que M'Bemba soit épanoui et polyvalent dans l’atelier.”
        </>
      ),
    },
  ];

const Travailler = () => {
  const isDesktop = useIsDesktop();
  const refCoupDePouce = useRef(null);
  const refProgramme360 = useRef(null);
  const handleClick = (element) => {
    if (element.current) {
      element.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Layout title="Travailler - Entourage Pro">
      <ImageTitle
        img="/static/img/orienter-banner.jpg"
        title="Entourage Pro, un tremplin vers l’emploi"
        textColor="black"
        description={`Vous êtes dans une situation de précarité ou d’exclusion\xa0? Vous avez un projet professionnel mais vous n’avez pas de réseau\xa0?`}
      />

      <Decouvrir
        handleClick={handleClick}
        refCoupDePouce={refCoupDePouce}
        refProgramme360={refProgramme360}
      />

        <ProgrammeCoupDePouce innerRef={refCoupDePouce} />
        <Programme360 innerRef={refProgramme360} />
      {/* <Inscrire innerRef={refInscrire} /> */}
      <VideoSection
        videoId="gUuaeDxlqTE"
        videoTitle="Rencontre avec Najaf, ancien candidat Entourage Pro à Paris"
        coloredBackground
      />
      {/* <Publier innerRef={refPublier} /> */}

      <VideoSection
        videoId="WLmDL-pB1NE"
        videoTitle="Atelier décroche un Job - L'Accélérateur (EITI) X Entourage Pro"
      />


      {/* change style */}
      <Reviews
        reviews={reviews}
        title="Ils nous racontent leur expérience"
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
    </Layout>
  );
};

export default Travailler;
