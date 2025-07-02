import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { IlluDiscussionBanc, IlluOrdiCV } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import {
  CardToggleList,
  SwitchItem,
} from '../Card/CardToggleList/CardToggleList';

export interface ProfileContactPreferencesProps {
  userRole: UserRoles;
  isEditable?: boolean;
  smallCard?: boolean;
}

const illuProps = {
  width: 40,
  height: 40,
};

export const ProfileContactPreferences = ({
  userRole,
  isEditable = false,
  smallCard = false,
}: ProfileContactPreferencesProps) => {
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);
  const [items, setItems] = useState<SwitchItem[]>([]);

  const allContactWays = useMemo(() => {
    if (userRole === UserRoles.CANDIDATE) {
      return [
        {
          name: 'Je préfère être accompagné en visio',
          icon: <IlluOrdiCV {...illuProps} />,
          key: 'allowRemoteEvents',
        },
        {
          name: 'Je préfère être accompagné en présentiel',
          icon: <IlluDiscussionBanc {...illuProps} />,
          key: 'allowPhysicalEvents',
        },
      ];
    }
    return [
      {
        name: 'Je préfère accompagner en visio',
        icon: <IlluOrdiCV {...illuProps} />,
        key: 'allowRemoteEvents',
      },
      {
        name: 'Je préfère accompagner en présentiel',
        icon: <IlluDiscussionBanc {...illuProps} />,
        key: 'allowPhysicalEvents',
      },
    ];
  }, [userRole]);

  const generateItems = useCallback(() => {
    return allContactWays.map((c) => ({
      name: c.name,
      icon: c.icon,
      value: user.userProfile[c.key] ?? false,
    }));
  }, [allContactWays, user.userProfile]);

  useEffect(() => {
    setItems(generateItems());
  }, [generateItems]);

  const isCompleted = items.some((item) => item.value);

  const onChange = (changedItems) => {
    setItems(changedItems);
    const data = changedItems.reduce((acc, item) => {
      const key = allContactWays.find((c) => c.name === item.name)?.key;
      if (!key) {
        return acc;
      }
      acc[key] = item.value;
      return acc;
    }, {});
    updateUserProfile(data);
  };
  if (!isEditable && !isCompleted) {
    return null;
  }

  return (
    <ProfilePartCard
      title="Prise de contact"
      isEditable={isEditable}
      isCompleted={isCompleted}
      isEmpty={false}
      smallCard={smallCard}
    >
      <CardToggleList
        items={items}
        isEditable={isEditable}
        onChange={(changedItems) => onChange(changedItems)}
      />
    </ProfilePartCard>
  );
};
