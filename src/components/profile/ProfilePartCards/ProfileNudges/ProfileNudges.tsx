import React, { useEffect, useMemo } from 'react';
import { Api } from '@/src/api';
import { Nudge, UserProfileNudge } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { ProfilePartCard } from '../Card/Card/Card';
import { CardToggleList } from '../Card/CardToggleList/CardToggleList';

export interface ProfileNudgesProps {
  userRole: UserRoles;
  userProfileNudges: UserProfileNudge[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileNudges = ({
  userRole,
  userProfileNudges,
  isEditable = false,
  smallCard = false,
}: ProfileNudgesProps) => {
  const [nudges, setNudges] = React.useState<Nudge[]>([]);

  const predefinedNudges = userProfileNudges.filter(
    (userProfileNudge) => !!userProfileNudge.nudge
  );
  const isCompleted = predefinedNudges.length > 0;
  const titleKey = useMemo(() => {
    return userRole === UserRoles.CANDIDATE ? 'nameRequest' : 'nameOffer';
  }, [userRole]);

  const cardTitle = useMemo(() => {
    return userRole === UserRoles.CANDIDATE
      ? 'Demandes de coup de pouce'
      : 'Offres de coup de pouce';
  }, [userRole]);

  // const values = predefinedNudges.map(({ nudge }) => ({
  //   name: (userRole === UserRoles.CANDIDATE
  //     ? nudge?.nameRequest
  //     : nudge?.nameOffer) as string,
  //   value: true,
  //   icon: null,
  // }));

  const fetchNudges = async () => {
    return Api.getAllNudges({
      search: '',
      limit: 50,
      offset: 0,
    });
  };

  useEffect(() => {
    fetchNudges()
      .then(({ data }) => {
        setNudges(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const items = useMemo(() => {
    return nudges.map((nudge) => {
      return {
        name: nudge[titleKey] as string,
        value: true,
        icon: null,
      };
    });
  }, [nudges, titleKey]);

  return (
    <ProfilePartCard
      title={cardTitle}
      isEditable={isEditable}
      isCompleted={isCompleted}
      smallCard={smallCard}
      isEmpty={false}
    >
      <CardToggleList items={items} isEditable={isEditable} />
    </ProfilePartCard>
  );
};
