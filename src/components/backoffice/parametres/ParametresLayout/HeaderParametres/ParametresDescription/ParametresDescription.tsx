import React from 'react';
import { StyledParametresPlaceholder } from '../HeaderParametres.styles';
import { openModal } from 'src/components/modals/Modal';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { ModalEditProfileDescription } from './ModalEditProfileDescription';
import {
  StyledParametresDescriptionContainer,
  StyledParametresDescriptionEditText,
  StyledParametresDescriptionParagraphe,
} from './ParametresDescription.styles';

export const ParametresDescription = () => {
  const user = useAuthenticatedUser();
  const { userProfile } = user;

  const openDescriptionModal = () => {
    openModal(<ModalEditProfileDescription user={user} />);
  };

  return (
    <StyledParametresDescriptionContainer>
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
        <StyledParametresPlaceholder
          onClick={() => openDescriptionModal()}
          data-testid="parametres-description-placeholder"
        >
          Ajouter une description pour vous présenter à la communauté
        </StyledParametresPlaceholder>
      )}
    </StyledParametresDescriptionContainer>
  );
};
