import React from 'react';
import { NumberGrid } from 'src/components/partials/NumberGrid';
import { Section } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { Subtitle } from 'src/components/utils/Subtitle';

const numbers = [
  {
    value: '93%',
    description:
      "des candidats se déclarent remobilisés dans leur recherche d'emploi",
  },
  {
    value: '61%',
    description: 'des candidats retrouvent un emploi dans les 6 mois',
  },
  {
    value: '92%',
    description:
      'des structures sociales partenaires sont satisfaites de leur expérience',
  },
  {
    value: '100%',
    description:
      'des partenaires perçoivent LinkedOut comme un apport complémentaire',
  },
];

export const Impact = () => {
  // Component logic here

  return (
    <Section style="default">
      <H2
        title={
          <>
            Notre <span className="orange">impact</span>
          </>
        }
        color="black"
        center
      />
      <NumberGrid numbers={numbers} numbersPerRow={4} />
      <Subtitle
        text={<>Source&nbsp;: Mesure d&apos;impact 2021 Archipel & Co</>}
        center
      />
    </Section>
  );
};
