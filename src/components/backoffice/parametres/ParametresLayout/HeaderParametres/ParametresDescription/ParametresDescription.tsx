import React from 'react';
import { openModal } from 'src/components/modals/Modal';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { ModalEditProfileDescription } from './ModalEditProfileDescription';
import {
  StyledParametresDescriptionPlaceholder,
  StyledParametresDescriptionParagraphe,
  StyledParametresDescriptionEditText,
} from './ParametresDescription.styles';

export const ParametresDescription = () => {
  const user = useAuthenticatedUser();
  const { userProfile } = user;

  const openDescriptionModal = () => {
    openModal(<ModalEditProfileDescription user={user} />);
  };

  return (
    <div>
      {userProfile?.description ? (
        <StyledParametresDescriptionParagraphe data-testid="parametres-description">
          {userProfile.description}
          <br />
          <StyledParametresDescriptionEditText
            onClick={() => openDescriptionModal()}
          >
            Modifier la description
          </StyledParametresDescriptionEditText>
        </StyledParametresDescriptionParagraphe>
      ) : (
        <StyledParametresDescriptionPlaceholder
          onClick={() => openDescriptionModal()}
          data-testid="parametres-description-placeholder"
        >
          Ajouter une description pour vous présenter à la communauté
        </StyledParametresDescriptionPlaceholder>
      )}
    </div>
  );
};
