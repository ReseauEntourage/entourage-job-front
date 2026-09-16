import React from 'react';
import { Button, Section } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { Text } from '@/src/components/ui/Text';
import { StyledSectionContent } from './CtaSection.styles';

interface CtaSectionProps {
  title: string;
  description: string;
  ctaLabel: string;
  href?: string;
  dataTestId: string;
  onClick: () => void;
}

export const CtaSection = ({
  title,
  description,
  ctaLabel,
  href,
  dataTestId,
  onClick,
}: CtaSectionProps) => {
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
          size="large"
          onClick={onClick}
          href={href}
          dataTestId={dataTestId}
          weight="bold"
        >
          {ctaLabel}
        </Button>
      </StyledSectionContent>
    </Section>
  );
};
