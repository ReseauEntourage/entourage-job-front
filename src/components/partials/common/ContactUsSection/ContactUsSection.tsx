import React from 'react';
import { Button, Section } from 'src/components/utils';
import { H1 } from 'src/components/utils/Headings';
import { Text } from 'src/components/utils/Text';
import { StyledSectionContent } from './ContactUsSection.styles';

export const ContactUsSection = ({ onClick }: { onClick: () => void }) => {
  return (
    <Section style="primary">
      <StyledSectionContent>
        <H1 title="Une question, une précision  ?" color="white" center />
        <Text color="white" size="large" center>
          Nos équipes sont à votre disposition !
        </Text>
        <Button
          style="custom-secondary"
          size="large"
          onClick={onClick}
          dataTestId="button-contact"
        >
          Nous contacter
        </Button>
      </StyledSectionContent>
    </Section>
  );
};
