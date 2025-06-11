import React, { useCallback, useEffect, useState } from 'react';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { IlluCV, IlluDossierCandidat } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import {
  CardToggleList,
  SwitchItem,
} from '../Card/CardToggleList/CardToggleList';

export interface ProfileContactPreferencesProps {
  isEditable?: boolean;
  smallCard?: boolean;
}

const illuProps = {
  width: 40,
  height: 40,
};

const allContactWays = [
  {
    name: 'Je préfère être accompagné en visio',
    icon: <IlluCV {...illuProps} />,
    key: 'allowRemoteEvents',
  },
  {
    name: 'Je préfère être accompagné en présentiel',
    icon: <IlluDossierCandidat {...illuProps} />,
    key: 'allowPhysicalEvents',
  },
];

export const ProfileContactPreferences = ({
  isEditable = false,
  smallCard = false,
}: ProfileContactPreferencesProps) => {
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);
  const [items, setItems] = useState<SwitchItem[]>([]);

  const generateItems = useCallback(() => {
    return allContactWays.map((c) => ({
      name: c.name,
      icon: c.icon,
      value: user.userProfile[c.key] ?? false,
    }));
  }, [user.userProfile]);

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
