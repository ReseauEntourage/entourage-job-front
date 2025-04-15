import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { UserProfileNudge } from '@/src/api/types';
import { IlluBulleQuestionCheck } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { Button, Text } from 'src/components/utils';
import { USER_ROLES, UserRole } from 'src/constants/users';
import { StyledItem } from './ProfileCustomNudges.styles';

export interface KeySkillsProps {
  id: string;
  ownProfile?: boolean;
  isEditable?: boolean;
  firstName: string;
  role: UserRole;
  userProfileNudges: UserProfileNudge[];
  smallCard?: boolean;
}

export const ProfileCustomNudges = ({
  id,
  firstName,
  role,
  userProfileNudges,
  ownProfile = false,
  isEditable = false,
  smallCard = false,
}: KeySkillsProps) => {
  const router = useRouter();
  const customUserProfileNudges = userProfileNudges.filter(
    (userProfileNudge) => !!userProfileNudge.content
  );
  const isCompleted = customUserProfileNudges.length > 0;

  const editModal = useCallback(() => {}, []);

  const openConversation = () => {
    router.push(`/backoffice/messaging?userId=${id}`);
  };

  const title = useMemo(() => {
    if (ownProfile && role === USER_ROLES.CANDIDATE) {
      return 'Détaillez vos besoins';
    }
    return role === USER_ROLES.CANDIDATE
      ? `Demandes de ${firstName}`
      : 'Détaillez vos offres';
  }, [firstName, role, ownProfile]);

  if (!isCompleted && !isEditable) {
    return null;
  }

  return (
    <ProfilePartCard
      title={title}
      isCompleted={isCompleted}
      isEditable={isEditable}
      smallCard={smallCard}
      fallback={{
        content: (
          <Text>
            Détaillez précisement vos besoins pour que les coachs puissent vous
            accompagner plus facilement
          </Text>
        ),
        icon: <IlluBulleQuestionCheck />,
      }}
    >
      {customUserProfileNudges?.map((userProfileNudge, index) => (
        <StyledItem key={index}>
          <Text>{userProfileNudge.content}</Text>

          {isEditable ? (
            <Button style="custom-primary-inverted" onClick={editModal}>
              Modifier
            </Button>
          ) : (
            <Button style="custom-primary-inverted" onClick={openConversation}>
              Répondre
            </Button>
          )}
        </StyledItem>
      ))}
    </ProfilePartCard>
  );
};
