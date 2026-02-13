import React, { useCallback } from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Text } from '@/src/components/ui';
import { ModalEditProfileDescription } from '@/src/features/headers/HeaderProfile/ProfileIntroduction/ModalEditProfileIntroduction';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { ProfilePartCard } from '../Card/Card/Card';
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
        icon: <SvgIcon name="IlluCV" width={90} height={90} />,
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
