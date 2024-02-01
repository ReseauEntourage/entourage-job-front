import React from 'react';
import { StyledParametresPlaceholder } from '../HeaderParametres.styles';
import { openModal } from 'src/components/modals/Modal';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { ModalEditProfileDescription } from './ModalEditProfileDescription';
import {
  StyledParametresDescriptionEditText,
  StyledParametresDescriptionParagraphe,
} from './ParametresDescription.styles';
import { StyledHeaderProfileDescription } from 'src/components/backoffice/Backoffice.styles';

export const ParametresDescription = () => {
  const user = useAuthenticatedUser();
  const { userProfile } = user;

  const openDescriptionModal = () => {
    openModal(<ModalEditProfileDescription user={user} />);
  };

  return (
    <StyledHeaderProfileDescription>
      {userProfile?.description ? (
        <StyledParametresDescriptionParagraphe data-testid="parametres-description">
          &ldquo;{userProfile.description}&rdquo;
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
    </StyledHeaderProfileDescription>
  );
};
