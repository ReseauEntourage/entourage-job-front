import React from 'react';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { UserWithUserCandidate } from 'src/api/types';
import { formEditProfileDescriptionCandidate } from 'src/components/forms/schemas/formEditProfileDescriptionCandidate';
import { formEditProfileDescriptionCoach } from 'src/components/forms/schemas/formEditProfileDescriptionCoach';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { USER_ROLES } from 'src/constants/users';

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
        description: userProfile?.description ?? undefined,
      }}
      formSchema={
        user.role === USER_ROLES.CANDIDATE
          ? formEditProfileDescriptionCandidate
          : formEditProfileDescriptionCoach
      }
      onSubmit={(values) => {
        updateUserProfile({
          description: values.description,
        });
      }}
    />
  );
};
