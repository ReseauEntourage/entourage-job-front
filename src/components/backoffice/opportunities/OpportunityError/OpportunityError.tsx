import React from 'react';
import { ContainerWithTextCentered, Section, Text } from 'src/components/utils';
import { H4 } from 'src/components/utils/Headings';

export const OpportunityError = () => {
  return (
    <Section>
      <ContainerWithTextCentered>
        <H4 title="Les opportunités n'ont pas pu être chargées correctement." />
        <Text>Contacte l&apos;équipe Entourage Pro pour en savoir plus.</Text>
      </ContainerWithTextCentered>
    </Section>
  );
};
