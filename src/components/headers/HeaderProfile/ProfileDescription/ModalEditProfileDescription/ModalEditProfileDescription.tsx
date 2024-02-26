import React from 'react';
import { UserWithUserCandidate } from 'src/api/types';
import { useUpdateProfile } from 'src/components/backoffice/parametres/useUpdateProfile';
import { formEditProfileDescription } from 'src/components/forms/schemas/formEditProfileDescription';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';

export const ModalEditProfileDescription = ({
  user,
}: {
  user: UserWithUserCandidate;
}) => {
  const { userProfile } = user;
  const { updateUserProfile, closeModal } = useUpdateProfile(user);
  return (
    <ModalEdit
      title="Ecrire votre présentation"
      closeOnNextRender={closeModal}
      defaultValues={{
        description: userProfile?.description,
      }}
      formSchema={formEditProfileDescription}
      onSubmit={(values) => {
        updateUserProfile({
          description: values.description,
        });
      }}
    />
  );
};
