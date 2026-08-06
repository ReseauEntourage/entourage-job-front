import React from 'react';
import { FormWithValidation } from '@/src/features/forms/FormWithValidation';
import { ModalGeneric } from '@/src/features/modals/Modal/ModalGeneric';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { useModalContext } from '../Modal';
import { formFeedback } from './formFeedback';

export function FeedbackModal() {
  const nextUnavailableAt = new Date().toISOString();
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);
  const { onClose } = useModalContext();

  const onSubmit = ({ unavailabilityReason }) => {
    updateUserProfile({
      unavailableAt: nextUnavailableAt,
      unavailabilityReason,
    });
    onClose?.();
  };

  return (
    <ModalGeneric
      title="Dites-nous en plus !"
      description="Votre avis nous intéresse. Pourriez-vous prendre un instant pour nous expliquer pourquoi vous n'êtes plus disponible ?"
      onClose={() => {
        updateUserProfile({ unavailableAt: nextUnavailableAt });
        onClose?.();
      }}
    >
      {user.role && (
        <FormWithValidation
          onSubmit={onSubmit}
          formSchema={formFeedback(user.role)}
          noCompulsory
        />
      )}
    </ModalGeneric>
  );
}
