import React from 'react';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardToggleList } from '../Card/CardToggleList/CardToggleList';

export interface ProfileContractsProps {
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileContracts = ({
  isEditable = false,
  smallCard = false,
}: ProfileContractsProps) => {
  const contractsValues = [
    {
      name: 'Alternance',
      value: true,
    },
    {
      name: 'Contrat à durée déterminée (CDD)',

      value: false,
    },
    {
      name: 'Contrat à durée indéterminée (CDI)',
      value: false,
    },
    {
      name: "Contrat d'insertion",
      value: false,
    },
    {
      name: 'Interim',
      value: false,
    },
  ];

  const isCompleted = true;

  if (!isEditable && !isCompleted) {
    return null;
  }

  return (
    <ProfilePartCard
      title="Types de contrats recherchés"
      isEditable={isEditable}
      isCompleted={isCompleted}
      smallCard={smallCard}
    >
      <CardToggleList items={contractsValues} isEditable={isEditable} />
    </ProfilePartCard>
  );
};
