import React from 'react';
import { CardToggleList } from '../Card/CardToggleList/CardToggleList';

export interface ProfileContractsProps {
  isEditable?: boolean;
}

export const ProfileContracts = ({
  isEditable = false,
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

  return (
    <CardToggleList
      title="Types de contrats"
      isEditable={isEditable}
      items={contractsValues}
    />
  );
};
