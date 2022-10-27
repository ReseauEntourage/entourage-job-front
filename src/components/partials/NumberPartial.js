import React from 'react';
import { Section } from 'src/components/utils';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import NumberGrid from 'src/components/partials/NumberGrid';

const staticNumbers = [
  { value: 300, description: 'candidats accompagnés', animated: true },
  {
    value: '61%',
    description: 'de sorties positives',
  },
  { value: 500, description: "entreprises mobilisées dans l'inclusion" },
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
