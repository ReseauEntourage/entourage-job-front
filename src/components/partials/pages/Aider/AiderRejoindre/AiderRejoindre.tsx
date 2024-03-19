import React from 'react';
import { Section } from 'src/components/utils';
import {
  Button,
  StyledCenteredButtonContainer,
} from 'src/components/utils/Button';
import { H2 } from 'src/components/utils/Headings';
import { Subtitle } from 'src/components/utils/Subtitle';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

export const AiderRejoindre = () => {
  return (
    <Section>
      <H2 title="La mission de coach vous interesse ?" color="black" center />
      <Subtitle center>
        Inscrivez-vous au prochain webinaire d’information pour valider votre
        entrée dans le parcours
      </Subtitle>
      <StyledCenteredButtonContainer>
        <Button
          style="custom-secondary-inverted"
          href="/inscription"
          onClick={() => {
            gaEvent(GA_TAGS.PAGE_AIDER_REJOINDRE_INSCRIPTION_CLICK);
          }}
        >
          Devenir coach
        </Button>
      </StyledCenteredButtonContainer>
    </Section>
  );
};
