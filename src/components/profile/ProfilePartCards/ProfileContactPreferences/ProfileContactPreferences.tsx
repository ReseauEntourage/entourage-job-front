import React from 'react';
import { IlluCV, IlluDossierCandidat } from 'assets/icons/icons';
import { CardToggleList } from '../Card/CardToggleList/CardToggleList';

export interface ProfileContactPreferencesProps {
  isEditable?: boolean;
}

const illuProps = {
  width: 50,
  height: 50,
};

export const ProfileContactPreferences = ({
  isEditable = false,
}: ProfileContactPreferencesProps) => {
  const preferencesValues = [
    {
      name: 'Je préfère être accompagné en visio',
      value: true,
      icon: <IlluCV {...illuProps} />,
    },
    {
      name: 'Je préfère être accompagné en présentiel',
      value: true,
      icon: <IlluDossierCandidat {...illuProps} />,
    },
  ];

  return (
    <CardToggleList
      title="Prise de contact"
      isEditable={isEditable}
      items={preferencesValues}
    />
  );
};
