import React, { useCallback } from 'react';
import { ModalEditProfileDescription } from '@/src/components/headers/HeaderProfile/ProfileIntroduction/ModalEditProfileIntroduction';
import { openModal } from '@/src/components/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { IlluCV } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { Text } from 'src/components/utils';
import { StyledDescriptionContainer } from './ProfileDescription.styles';

export interface ProfileDescriptionProps {
  description: string | null;
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileDescription = ({
  description,
  isEditable = false,
  smallCard = false,
}: ProfileDescriptionProps) => {
  const user = useAuthenticatedUser();
  const isCompleted = !!description;

  const openEditModal = useCallback(() => {
    openModal(<ModalEditProfileDescription user={user} />);
  }, [user]);

  return (
    <ProfilePartCard
      title="Présentation"
      isCompleted={isCompleted}
      isEditable={isEditable}
      ctaCallback={openEditModal}
      //     iaGenerated
      fallback={{
        content: <Text>Vous n’avez pas encore rédigé de présentation</Text>,
        icon: <IlluCV />,
      }}
      smallCard={smallCard}
    >
      {description && (
        <StyledDescriptionContainer>
          <Text>{description}</Text>
        </StyledDescriptionContainer>
      )}
    </ProfilePartCard>
  );
};
