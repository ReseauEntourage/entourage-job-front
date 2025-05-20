import React from 'react';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { useModalContext } from '../Modal';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { formFeedback } from './formFeedback';

export function FeedbackModal() {
  const nextAvailibility = false;
  const user = useAuthenticatedUser();
  const { updateUserProfile } = useUpdateProfile(user);
  const { onClose } = useModalContext();

  const onSubmit = ({ unavailabilityReason }) => {
    updateUserProfile({ isAvailable: nextAvailibility, unavailabilityReason });
    onClose?.();
  };

  return (
    <ModalGeneric
      title="Dites-nous en plus !"
      description="Votre avis nous intéresse. Pourriez-vous prendre un instant pour nous expliquer pourquoi vous n'êtes plus disponible ?"
      onClose={() => {
        updateUserProfile({ isAvailable: nextAvailibility });
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
