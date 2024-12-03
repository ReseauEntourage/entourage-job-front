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
    value: '440',
    description: 'candidat(e)s accompagné(e)s depuis le lancement',
  },
  {
    value: '72%',
    description:
      'des candidat(e)s parvenus au bout du parcours ont retrouvé un travail',
  },
  {
    value: '130',
    description: 'entreprises ont recruté',
  },
  {
    value: '93%',
    description:
      'des candidat(e)s ont repris confiance en eux et en leurs capacités',
  },
];

export const Impact = ({
  tag,
}: {
  tag?: (typeof GA_TAGS)[keyof typeof GA_TAGS];
}) => {
  return (
    <Section style="custom-primary">
      <H2
        title={
          <>
            Notre <span className="orange">impact</span> en chiffres
          </>
        }
        color="black"
        center
      />
      <NumberGrid numbers={numbers} numbersPerRow={4} />
      <StyledCenteredButtonContainer>
        <Button
          style="custom-secondary-inverted"
          href={process.env.URL_MESURE_D_IMPACT}
          isExternal
          newTab
          onClick={() => {
            if (tag) gaEvent(tag);
          }}
        >
          Télécharger la mesure d&lsquo;impact
        </Button>
      </StyledCenteredButtonContainer>
    </Section>
  );
};
