import React from 'react';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardToggleList } from '../Card/CardToggleList/CardToggleList';

export interface ProfileNotificationsPreferencesProps {
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileNotificationsPreferences = ({
  isEditable = false,
  smallCard = false,
}: ProfileNotificationsPreferencesProps) => {
  const notificationsValues = [
    {
      name: 'Recevoir des recommandations de coachs qui pourraient m’accompagner',
      value: false,
    },
    {
      name: 'Recevoir des invitations pour les prochains événements',
      value: false,
    },
  ];

  return (
    <ProfilePartCard
      title="Notifications email"
      isEditable={isEditable}
      smallCard={smallCard}
      isEmpty={false}
    >
      <CardToggleList items={notificationsValues} isEditable={isEditable} />
    </ProfilePartCard>
  );
};
