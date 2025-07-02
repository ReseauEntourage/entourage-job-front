import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { UserProfileNudge } from '@/src/api/types';
import { openModal } from '@/src/components/modals/Modal';
import { LucidIcon } from '@/src/components/utils/Icons/LucidIcon';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { IlluBulleQuestionCheck } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { Button, Text } from 'src/components/utils';
import { UserRoles } from 'src/constants/users';
import {
  StyledButtonContainer,
  StyledContentContainer,
  StyledItem,
} from './ProfileCustomNudges.styles';
import { ProfileCustomNudgesModalEdit } from './ProfileCustomNudgesModalEdit';

export interface KeySkillsProps {
  userId: string;
  ownProfile?: boolean;
  isEditable?: boolean;
  firstName: string;
  role: UserRoles;
  customNudges: UserProfileNudge[];
  smallCard?: boolean;
}

export const ProfileCustomNudges = ({
  userId,
  firstName,
  role,
  customNudges,
  ownProfile = false,
  isEditable = false,
  smallCard = false,
}: KeySkillsProps) => {
  const router = useRouter();
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);
  const isCompleted = customNudges.length > 0;
  const isOwnProfile = userId === user?.id;

  const openEditModal = useCallback(
    (id?: string) => {
      openModal(
        <ProfileCustomNudgesModalEdit
          dispatchOnSubmit={(fields) => {
            let newCustomNudges = customNudges;
            if (id) {
              newCustomNudges = newCustomNudges.filter((n) => n.id !== id);
            }
            updateUserProfile({
              customNudges: [
                ...newCustomNudges,
                {
                  id: id || undefined,
                  content: fields.content,
                } as UserProfileNudge,
              ],
            });
          }}
          customNudge={
            customNudges.find((nudge) => nudge.id === id) as UserProfileNudge
          }
        />
      );
    },
    [customNudges, updateUserProfile]
  );

  const deleteCustomNudge = useCallback(
    (id: string) => {
      updateUserProfile({
        customNudges: customNudges.filter((nudge) => nudge.id !== id),
      });
    },
    [customNudges, updateUserProfile]
  );

  const openConversation = () => {
    router.push(`/backoffice/messaging?userId=${userId}`);
  };

  const title = useMemo(() => {
    if (isEditable && ownProfile && role === UserRoles.CANDIDATE) {
      return 'Détaillez vos besoins';
    }
    return role === UserRoles.CANDIDATE
      ? `Demandes de ${firstName}`
      : 'Détaillez vos offres';
  }, [isEditable, ownProfile, role, firstName]);

  return (
    <ProfilePartCard
      title={title}
      isCompleted={isCompleted}
      isEditable={isEditable}
      smallCard={smallCard}
      fallback={{
        content: (
          <Text>
            {user.role === UserRoles.CANDIDATE
              ? 'Détaillez précisement vos besoins pour que les coachs puissent vous accompagner plus facilement'
              : 'Détaillez les coups de pouces que vous pouvez offrir aux candidats.'}
          </Text>
        ),
        icon: <IlluBulleQuestionCheck />,
      }}
      ctaCallback={isEditable ? () => openEditModal() : undefined}
      ctaTitle="Ajouter"
    >
      {customNudges?.map((customNudge, index) => (
        <StyledItem key={index}>
          <StyledContentContainer>
            <Text>{customNudge.content}</Text>
          </StyledContentContainer>

          {isEditable && (
            <StyledButtonContainer>
              <Button
                variant="secondary"
                onClick={() => openEditModal(customNudge.id)}
                rounded="circle"
              >
                <LucidIcon name="Pencil" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => deleteCustomNudge(customNudge.id)}
                rounded="circle"
              >
                <LucidIcon name="Trash" />
              </Button>
            </StyledButtonContainer>
          )}
          {!isEditable && !isOwnProfile && (
            <Button variant="secondary" onClick={openConversation} rounded>
              Répondre
            </Button>
          )}
        </StyledItem>
      ))}
    </ProfilePartCard>
  );
};
