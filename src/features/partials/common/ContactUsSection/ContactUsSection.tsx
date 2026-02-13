import React from 'react';
import { Button, Section } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { Text } from '@/src/components/ui/Text';
import { StyledSectionContent } from './ContactUsSection.styles';

export const ContactUsSection = ({ onClick }: { onClick: () => void }) => {
  return (
    <Section style="primary">
      <StyledSectionContent>
        <H2 title="Une question, une précision ?" color="white" center />
        <Text color="white" size="large" center>
          Notre équipe est à votre disposition !
        </Text>
        <Button
          variant="secondary"
          rounded
          size="medium"
          onClick={onClick}
          dataTestId="button-contact"
        >
          Nous contacter
        </Button>
      </StyledSectionContent>
    </Section>
  );
};
