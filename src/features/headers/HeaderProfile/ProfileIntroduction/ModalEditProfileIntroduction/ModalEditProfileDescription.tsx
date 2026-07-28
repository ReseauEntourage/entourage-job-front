import React from 'react';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { formEditProfileDescriptionCandidate } from '@/src/features/forms/schemas/formEditProfileDescriptionCandidate';
import { formEditProfileDescriptionCoach } from '@/src/features/forms/schemas/formEditProfileDescriptionCoach';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';

export const ModalEditProfileDescription = ({ user }: { user: User }) => {
  const userProfile = useCurrentUserProfile();
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
