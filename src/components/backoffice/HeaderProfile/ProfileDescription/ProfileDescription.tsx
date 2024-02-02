import React from 'react';
import { StyledProfilePlaceholder } from '../HeaderProfile.styles';
import { openModal } from 'src/components/modals/Modal';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { ModalEditProfileDescription } from './ModalEditProfileDescription';
import {
  StyledDescriptionContainer,
  StyledDescriptionEditText,
  StyledDescriptionParagraphe,
} from './ProfileDescription.styles';

interface ProfileDescriptionProps {
  isEditable?: boolean;
  description: string;
}

export const ProfileDescription = ({
  isEditable = false,
  description,
}: ProfileDescriptionProps) => {
  const user = useAuthenticatedUser();

  const openDescriptionModal = () => {
    openModal(<ModalEditProfileDescription user={user} />);
  };

  return (
    <StyledDescriptionContainer>
      {description && (
        <StyledDescriptionParagraphe data-testid="profile-description">
          &ldquo;{description}&rdquo;
          {isEditable && (
            <StyledDescriptionEditText onClick={() => openDescriptionModal()}>
              Modifier la description
            </StyledDescriptionEditText>
          )}
        </StyledDescriptionParagraphe>
      )}
      {isEditable && !description && (
        <StyledProfilePlaceholder
          onClick={() => openDescriptionModal()}
          data-testid="profile-description-placeholder"
        >
          Ajouter une description pour vous présenter à la communauté
        </StyledProfilePlaceholder>
      )}
    </StyledDescriptionContainer>
  );
};
