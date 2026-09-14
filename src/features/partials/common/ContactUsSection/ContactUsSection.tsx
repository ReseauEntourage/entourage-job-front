import React from 'react';
import { Button, Section } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { Text } from '@/src/components/ui/Text';
import { StyledSectionContent } from './ContactUsSection.styles';

interface ContactUsSectionProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  href?: string;
  onClick: () => void;
}

export const ContactUsSection = ({
  title = 'Une question, une précision ?',
  description = 'Notre équipe est à votre disposition !',
  ctaLabel = 'Nous contacter',
  href,
  onClick,
}: ContactUsSectionProps) => {
  return (
    <Section style="primary">
      <StyledSectionContent>
        <H2 title={title} color="white" center />
        {description && (
          <Text color="white" size="large" center>
            {description}
          </Text>
        )}
        <Button
          variant="secondary"
          rounded
          size="medium"
          onClick={onClick}
          href={href}
          dataTestId="button-contact"
        >
          {ctaLabel}
        </Button>
      </StyledSectionContent>
    </Section>
  );
};
