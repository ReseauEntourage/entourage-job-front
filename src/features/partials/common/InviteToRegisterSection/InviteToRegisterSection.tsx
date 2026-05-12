import React from 'react';
import { Button, Section } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { StyledContent } from './InviteToRegisterSection.styles';

interface InviteToRegisterSectionProps {
  as: 'Coach';
  onClick: () => void;
}

export const InviteToRegisterSection = ({
  as,
  onClick,
}: InviteToRegisterSectionProps) => {
  const titleByAs = {
    Coach:
      'Rejoignez une large communauté de coachs bénévoles qui agissent pour que l’isolement et la précarité ne soit pas un frein à la recherche d’emploi.',
  };

  const CtaByAs = {
    Coach: {
      label: 'Je deviens coach',
    },
  };

  return (
    <Section style="primary">
      <StyledContent>
        <H2 title={titleByAs[as]} color="white" center />
        <Button
          variant="secondary"
          rounded
          size="medium"
          onClick={onClick}
          dataTestId="button-register"
          weight="bold"
        >
          {CtaByAs[as].label}
        </Button>
      </StyledContent>
    </Section>
  );
};
