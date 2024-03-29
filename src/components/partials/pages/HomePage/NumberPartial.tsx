import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { NumberGrid } from 'src/components/partials/utils/NumberGrid';
import { Section } from 'src/components/utils';

const staticNumbers = [
  { value: 400, description: 'candidats accompagnés', animate: true },
  {
    value: '72%',
    description: 'de sorties positives en 2022',
  },
  {
    value: 700,
    description: "entreprises mobilisées dans l'inclusion",
    animate: true,
  },
];

export const NumberPartial = () => {
  return (
    <Section style="muted" id="profiles">
      <h2 className="uk-text-bold uk-text-center">
        Et le mieux c&apos;est que{' '}
        <span className="uk-text-primary">ça marche</span> !
      </h2>
      <p className="uk-text-center uk-margin-medium-bottom">
        Miah, Abdul, Laith... ont retrouvé un emploi grâce à Entourage Pro
      </p>
      <NumberGrid numbers={staticNumbers} />

      <div className="uk-margin-medium-top">
        <LiteYouTubeEmbed
          id="1cfmgC2IqWs"
          title="Présentation Entourage Pro"
          aspectWidth={1280}
          aspectHeight={720}
        />
      </div>
    </Section>
  );
};
