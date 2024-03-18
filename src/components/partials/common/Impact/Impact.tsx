import React from 'react';
import { NumberGrid } from 'src/components/partials/utils/NumberGrid';
import {
  Button,
  StyledCenteredButtonContainer,
  Section,
} from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

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
      'des partenaires perçoivent Entourage Pro comme un apport complémentaire',
  },
];

export const Impact = ({
  tag,
}: {
  tag?: (typeof GA_TAGS)[keyof typeof GA_TAGS];
}) => {
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
      <StyledCenteredButtonContainer>
        <Button
          style="custom-secondary-inverted"
          href="" // TODO : lien pdf brochure mesure d'impact
          onClick={() => {
            if (tag) gaEvent(tag);
          }}
        >
          Télécharger la mesure d`&lsquo;impact
        </Button>
      </StyledCenteredButtonContainer>
    </Section>
  );
};
