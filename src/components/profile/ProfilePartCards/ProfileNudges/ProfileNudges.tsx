import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Api } from '@/src/api';
import { Nudge } from '@/src/api/types';
import { nudgesIcons } from '@/src/constants/nudges';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardToggleList } from '../Card/CardToggleList/CardToggleList';

interface NudgeItem {
  id: string;
  name: string;
  value: boolean;
}

export interface ProfileNudgesProps {
  userRole: UserRoles;
  nudges: Nudge[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileNudges = ({
  userRole,
  nudges,
  isEditable = false,
  smallCard = false,
}: ProfileNudgesProps) => {
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);
  const [allNudges, setAllNudges] = useState<Nudge[]>([]);
  const [items, setItems] = useState<NudgeItem[]>([]);

  const isCompleted = nudges?.length > 0;

  const titleKey = useMemo(() => {
    return userRole === UserRoles.CANDIDATE ? 'nameRequest' : 'nameOffer';
  }, [userRole]);

  const cardTitle = useMemo(() => {
    return userRole === UserRoles.CANDIDATE
      ? 'Demandes de coup de pouce'
      : 'Offres de coup de pouce';
  }, [userRole]);

  const fetchAllNudges = async () => {
    try {
      const { data } = await Api.getAllNudges({
        limit: 50,
        offset: 0,
      });
      setAllNudges(data);
    } catch (error) {
      console.error('Error fetching nudges:', error);
    }
  };

  const generateItems = useCallback(
    (nudgesToConvert: Nudge[]) => {
      return nudgesToConvert.map((n) => ({
        id: n.id,
        name: n[titleKey],
        value: nudges?.some((userNudge) => userNudge.id === n.id),
        icon: nudgesIcons[n.value],
      }));
    },
    [titleKey, nudges]
  );

  const onChange = (changedItems) => {
    setItems(changedItems);
    updateUserProfile({
      nudges: changedItems
        .filter((nudge) => nudge.value === true)
        .map((nudge) => ({
          id: nudge.id,
        })),
    });
  };

  useEffect(() => {
    if (isEditable) {
      fetchAllNudges();
    }
  }, [isEditable]);

  useEffect(() => {
    if (allNudges.length > 0) {
      setItems(generateItems(allNudges));
    }
  }, [allNudges, generateItems]);

  if (!isEditable && !isCompleted) {
    return null;
  }

  return (
    <ProfilePartCard
      title={cardTitle}
      isEditable={isEditable}
      isCompleted={isCompleted}
      isEmpty={false}
      smallCard={smallCard}
    >
      {isEditable ? (
        <CardToggleList
          items={items}
          isEditable={isEditable}
          onChange={(changedItems) => onChange(changedItems)}
        />
      ) : (
        <CardToggleList items={generateItems(nudges)} isEditable={false} />
      )}
    </ProfilePartCard>
  );
};
