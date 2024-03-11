import React from 'react'
import { Section } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';

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

export const Figures = () => {
  return (
    <Section id="profiles">
        <H2 title="Et le mieux c'est que ça marche" color="black" center />
    </Section>
  )
}
