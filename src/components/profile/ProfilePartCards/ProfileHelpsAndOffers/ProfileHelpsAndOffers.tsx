import React from 'react';
import { CardToggleList } from '../Card/CardToggleList/CardToggleList';
import { ProfileHelps } from 'src/constants/helps';
import { UserRole } from 'src/constants/users';

export interface ProfileHelpsAndOffersProps {
  role: UserRole;
  isEditable?: boolean;
}

export const ProfileHelpsAndOffers = ({
  role,
  isEditable = false,
}: ProfileHelpsAndOffersProps) => {
  const helpsValues = ProfileHelps.map((help) => ({
    name: help.shortTitle[role],
    value: false,
    icon: help.icon,
  }));

  return (
    <CardToggleList
      title="Demandes de coup de pouce"
      isEditable={isEditable}
      items={helpsValues}
    />
  );
};
