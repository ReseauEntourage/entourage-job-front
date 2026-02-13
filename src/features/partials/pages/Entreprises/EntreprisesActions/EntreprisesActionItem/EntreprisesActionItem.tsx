import React from 'react';
import { Button, Text } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import {
  StyledEntreprisesActionItemContainer,
  StyledEntreprisesActionItemContent,
} from './EntreprisesActionItem.styles';

export interface EntreprisesActionsItemProps {
  action: {
    illu: React.ReactNode;
    title: string;
    description: string;
    cta: {
      label: string;
      href: string;
    };
  };
}

export const EntreprisesActionsItem = ({
  action,
}: EntreprisesActionsItemProps) => {
  return (
    <StyledEntreprisesActionItemContainer>
      {action.illu}
      <StyledEntreprisesActionItemContent>
        <H5 title={action.title} center />
        <Text center>
          Relecture de CV, préparation aux entretiens... En quelques clics, vos
          collaborateurs peuvent devenir coachs bénévoles et donnner des coups
          de pouce à nos candidat.e.s.
        </Text>
      </StyledEntreprisesActionItemContent>
      <Button variant="secondary" rounded href={action.cta.href}>
        {action.cta.label}
      </Button>
    </StyledEntreprisesActionItemContainer>
  );
};
