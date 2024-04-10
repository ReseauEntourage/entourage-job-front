import React, { useCallback, useRef } from 'react';
import { Layout } from 'src/components/Layout';

import { Impact } from 'src/components/partials/common/Impact';
import { Partners } from 'src/components/partials/common/Partners';
import { VideoSection } from 'src/components/partials/pages/Orienter/VideoSection';
import {
  TravaillerProgramme360,
  TravaillerProgrammeCoupDePouce,
} from 'src/components/partials/pages/Travailler/Programmes';
import { TravaillerDecouvrir } from 'src/components/partials/pages/Travailler/TravaillerDecouvrir';
import { ImageTitle } from 'src/components/partials/utils/ImageTitle';
import { Reviews } from 'src/components/partials/utils/Reviews';
import { GA_TAGS } from 'src/constants/tags';

const reviews = [
  {
    image: '/static/img/temoignage-entreprise-stephane-danny.jpg',
    author: 'Elicia',
    authorStatus: 'accompagnée par l’Accélérateur a trouvé chez Kiko',
    review: (
      <>
        “ Maintenant j’arrive à plus parler aux gens, à aller vers les autres,
        c’est grâce à LinkedOut. Je faisais la paresseuse avant, et là, ça m’a
        donné envie de me donner à fond.”
      </>
    ),
  },
  {
    image: '/static/img/temoignage-entreprise-gregoire-mbemba.jpg',
    author: 'Mike',
    authorStatus: 'candidat EntouragePro',
    review: (
      <>
        “ LinkedOut vous vous êtes bougés pour moi, et par le réseau j’ai pu
        rencontrer plein de professionnels qui m’ont motivés dans ma recherche”
      </>
    ),
  },
  {
    image: '/static/img/temoignage-entreprise-gregoire-mbemba.jpg',
    author: 'Grégoire',
    authorStatus: "Recruteur de M'Bemba Dani Alu",
    review: (
      <>
        “ Le recrutement de M&lsquo;Bemba a ressoudé les équipes. Elles se sont
        investies dans un projet. Elles peuvent être très fières d’avoir fait en
        sorte que M&lsquo;Bemba soit épanoui et polyvalent dans l’atelier.”
      </>
    ),
  },
];

const Travailler = () => {
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
    <Layout title="Travailler - Entourage Pro">
      <ImageTitle
        img="/static/img/orienter-banner.jpg"
        title="Entourage Pro, un tremplin vers l’emploi"
        textColor="black"
        description={`Vous êtes dans une situation de précarité ou d’exclusion\xa0? Vous avez un projet professionnel mais vous n’avez pas de réseau\xa0?`}
      />

      <TravaillerDecouvrir
        handleClick={handleClick}
        refCoupDePouce={refCoupDePouce}
        refProgramme360={refProgramme360}
      />

      <TravaillerProgrammeCoupDePouce innerRef={refCoupDePouce} />
      <TravaillerProgramme360 innerRef={refProgramme360} />

      <VideoSection
        videoId="gUuaeDxlqTE"
        videoTitle="Rencontre avec Najaf, ancien candidat Entourage Pro à Paris"
        coloredBackground
      />

      <Reviews reviews={reviews} title="Ils nous racontent leur expérience" />

      <Partners />

      <Impact tag={GA_TAGS.PAGE_TRAVAILLER_MESURE_IMPACT_CLICK} />
    </Layout>
  );
};

export default Travailler;
