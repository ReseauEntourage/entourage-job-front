import React from 'react';
import { useDispatch } from 'react-redux';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { formEditProfileDescription } from 'src/components/forms/schemas/formEditProfileDescription';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { authenticationActions } from 'src/use-cases/authentication';
import {
  StyledParametresDescriptionPlaceholder,
  StyledParametresDescriptionParagraphe,
  StyledParametresDescriptionEditText,
} from './ParametresDescription.styles';

export const ParametresDescription = () => {
  const user = useAuthenticatedUser();
  const { id, userProfile } = user;

  const dispatch = useDispatch();

  const openDescriptionModal = () => {
    openModal(
      <ModalEdit
        title="Ecrire votre présentation"
        defaultValues={{
          description: userProfile?.description,
        }}
        formSchema={formEditProfileDescription}
        onSubmit={async (values, closeModal) => {
          try {
            await Api.putUserProfile(id, values);
            closeModal();
            dispatch(
              authenticationActions.setUser({
                ...user,
                userProfile: {
                  ...user.userProfile,
                  description: values.description,
                },
              })
            );
            UIkit.notification(
              'Vos informations personnelles ont bien été mises à jour',
              'success'
            );
          } catch (error) {
            console.error(error);
            UIkit.notification(
              "Une erreur c'est produite lors de la mise à jour de votre présentation",
              'danger'
            );
          }
        }}
      />
    );
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
