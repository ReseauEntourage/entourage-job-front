import React from 'react';
import { IlluCV, IlluDossierCandidat } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardToggleList } from '../Card/CardToggleList/CardToggleList';

export interface ProfileContactPreferencesProps {
  isEditable?: boolean;
  smallCard?: boolean;
}

const illuProps = {
  width: 50,
  height: 50,
};

export const ProfileContactPreferences = ({
  isEditable = false,
  smallCard = false,
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

  const isCompleted = true;

  return (
    <ProfilePartCard
      title="Prise de contact"
      isEditable={isEditable}
      isCompleted={isCompleted}
      smallCard={smallCard}
    >
      <CardToggleList items={preferencesValues} />
    </ProfilePartCard>
  );
};
