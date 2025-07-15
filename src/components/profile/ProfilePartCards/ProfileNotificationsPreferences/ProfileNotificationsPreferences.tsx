import React from 'react';
import { UserProfile } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardToggleList } from '../Card/CardToggleList/CardToggleList';

export interface ProfileNotificationsPreferencesProps {
  userProfile: UserProfile;
  smallCard?: boolean;
}

export const ProfileNotificationsPreferences = ({
  userProfile,
  smallCard = false,
}: ProfileNotificationsPreferencesProps) => {
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);
  const notificationPreferenceName =
    user.role === UserRoles.COACH
      ? "Recevoir des recommandations de candidats qui ont besoin d'aide"
      : 'Recevoir des recommandations de coachs qui pourraient m’accompagner';
  const [items, setItems] = React.useState([
    {
      name: notificationPreferenceName,
      key: 'optInRecommendations',
      value: userProfile.optInRecommendations,
    },
  ]);

  const onChange = (changedItems) => {
    setItems(changedItems);
    const userProfileData = changedItems.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    updateUserProfile(userProfileData);
  };

  return (
    <ProfilePartCard
      title="Notifications email"
      smallCard={smallCard}
      isEmpty={false}
      isEditable
    >
      <CardToggleList items={items} onChange={onChange} isEditable />
    </ProfilePartCard>
  );
};
