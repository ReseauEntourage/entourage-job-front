import React from 'react';
import { useUpdateProfile } from '../../../useUpdateProfile';
import { getFormEditHelps } from 'src/components/forms/schemas/formEditHelps';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

export const ParametresHelpModal = ({
  role,
  title,
}: {
  role: typeof USER_ROLES.CANDIDATE | typeof USER_ROLES.COACH;
  title: string;
}) => {
  const user = useAuthenticatedUser();
  const { userProfile } = user;

  const { helpField, updateUserProfile, closeModal } = useUpdateProfile(user);

  if (!helpField || !userProfile || !(helpField in userProfile)) return null;

  return (
    <ModalEdit
      title={title}
      closeOnNextRender={closeModal}
      formSchema={getFormEditHelps(role)}
      submitText="Sauvegarder"
      defaultValues={{
        helps: userProfile[helpField].map(({ name }) => name) || [],
      }}
      onSubmit={({ helps }) =>
        updateUserProfile({
          [helpField]: helps.map((help) => ({
            name: help,
          })),
        })
      }
    />
  );
};
