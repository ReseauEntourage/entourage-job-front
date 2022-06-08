import React from 'react';
import { Section } from 'src/components/utils';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import NumberGrid from 'src/components/partials/NumberGrid';

const staticNumbers = [
  { value: '45', description: 'Candidats recrutés' },
  {
    value: '71%',
    description: 'De sorties positives',
    subDescription: 'calculé sur les candidats étant allé au bout du parcours',
  },
  { value: '32', description: 'Entreprises ont recruté' },
  { value: '263', description: "Offres d'emploi reçues" },
  {
    value: (
      <div className="uk-margin-small-bottom">
        Administration / Logistique
        <br />
        Distribution / BTP
      </div>
    ),
    description: 'Sont les secteurs qui ont le plus recruté',
  },
];

const NumberPartial = () => {
  return (
    <Section style="muted" id="profiles">
      <h2 className="uk-text-bold uk-text-center">
        Et le mieux c&apos;est que{' '}
        <span className="uk-text-primary">ça marche</span> !
      </h2>
      <p className="uk-text-center uk-margin-medium-bottom">
        Miah, Abdul, Laith... ont retrouvé un emploi grâce à LinkedOut
      </p>
      <NumberGrid numbers={staticNumbers} />
      <div className="uk-flex uk-flex-center uk-margin-small-top">
        <span className="uk-text-meta uk-text-center">
          * chiffres de la promo #2
        </span>
      </div>

      <div className="uk-margin-medium-top">
        <LiteYouTubeEmbed
          id="1cfmgC2IqWs"
          title="Présentation LinkedOut"
          aspectWidth={1280}
          aspectHeight={720}
        />
      </div>
    </Section>
  );
};

export default NumberPartial;
