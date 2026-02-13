import React from 'react';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { User } from 'src/api/types';
import { UserRoles } from 'src/constants/users';
import { formEditProfileDescriptionCandidate } from 'src/features/forms/schemas/formEditProfileDescriptionCandidate';
import { formEditProfileDescriptionCoach } from 'src/features/forms/schemas/formEditProfileDescriptionCoach';

export const ModalEditProfileDescription = ({ user }: { user: User }) => {
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
        user.role === UserRoles.CANDIDATE
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
