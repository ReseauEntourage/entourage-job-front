import React from 'react';
import { StepperModal } from '@/src/features/modals/Modal/ModalGeneric/StepperModal';
import { SuccessModalContent } from '@/src/features/modals/SuccessModalContent';
import { Api } from 'src/api';
import { FormWithValidation } from 'src/features/forms/FormWithValidation';
import { formInterestLinkedOut } from 'src/features/forms/schemas/formInterestLinkedOut';

export const ModalInterestLinkedOut = () => {
  return (
    <StepperModal
      title="Formulaire de contact"
      composers={[
        (closeModal, nextStep) => {
          return (
            <FormWithValidation
              submitText="Envoyer"
              formSchema={formInterestLinkedOut}
              onCancel={closeModal}
              onSubmit={(fields, setError) => {
                return Api.postContactContactUs(fields)
                  .then(() => {
                    return nextStep();
                  })
                  .catch(() => {
                    setError("Une erreur s'est produite");
                  });
              }}
            />
          );
        },
        (closeModal) => {
          return (
            <SuccessModalContent
              closeModal={closeModal}
              text="Merci pour votre message !"
            />
          );
        },
      ]}
    />
  );
};
