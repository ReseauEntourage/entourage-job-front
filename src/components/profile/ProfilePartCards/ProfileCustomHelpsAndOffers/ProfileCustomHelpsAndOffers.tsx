import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { IlluBulleQuestionCheck } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { Button, Text } from 'src/components/utils';
import { USER_ROLES, UserRole } from 'src/constants/users';
import { StyledItem } from './ProfileCustomHelpsAndOffers.styles';

export interface KeySkillsProps {
  id: string;
  ownProfile?: boolean;
  isEditable?: boolean;
  firstName: string;
  role: UserRole;
  items: string[];
  smallCard?: boolean;
}

export const ProfileCustomHelpsAndOffers = ({
  id,
  firstName,
  role,
  items,
  ownProfile = false,
  isEditable = false,
  smallCard = false,
}: KeySkillsProps) => {
  const router = useRouter();
  const isCompleted = items.length > 0;

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
      {items.length > 0 &&
        items.map((item, index) => (
          <StyledItem key={index}>
            <Text>{item}</Text>

            {isEditable ? (
              <Button style="custom-primary-inverted" onClick={editModal}>
                Modifier
              </Button>
            ) : (
              <Button
                style="custom-primary-inverted"
                onClick={openConversation}
              >
                Répondre
              </Button>
            )}
          </StyledItem>
        ))}
    </ProfilePartCard>
  );
};
