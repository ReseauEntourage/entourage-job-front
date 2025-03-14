import React from 'react';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardToggleList } from '../Card/CardToggleList/CardToggleList';
import { ProfileHelps } from 'src/constants/helps';
import { UserRole } from 'src/constants/users';

export interface ProfileHelpsAndOffersProps {
  role: UserRole;
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileHelpsAndOffers = ({
  role,
  isEditable = false,
  smallCard = false,
}: ProfileHelpsAndOffersProps) => {
  const helpsValues = ProfileHelps.map((help) => ({
    name: help.shortTitle[role],
    value: false,
    icon: help.icon,
  }));

  const isCompleted = true;

  return (
    <ProfilePartCard
      title="Demandes de coup de pouce"
      isEditable={isEditable}
      isCompleted={isCompleted}
      smallCard={smallCard}
    >
      <CardToggleList items={helpsValues} isEditable={isEditable} />
    </ProfilePartCard>
  );
};
