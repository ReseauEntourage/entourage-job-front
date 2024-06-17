import React from 'react';
import {
  ContainerWithTextCentered,
  Section,
  Typography,
} from 'src/components/utils';
import { H4 } from 'src/components/utils/Headings';

export const OpportunityError = () => {
  return (
    <Section>
      <ContainerWithTextCentered>
        <H4
          title={"Les opportunités n'ont pas pu être chargées correctement."}
        />
        <Typography>
          Contacte l&apos;équipe Entourage Pro pour en savoir plus.
        </Typography>
      </ContainerWithTextCentered>
    </Section>
  );
};
