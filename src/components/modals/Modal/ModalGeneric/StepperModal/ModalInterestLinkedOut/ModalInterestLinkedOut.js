import React from 'react';
import { Api } from 'src/api';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formInterestLinkedOut } from 'src/components/forms/schema/formInterestLinkedOut';
import { StepperModal } from 'src/components/modals/Modal/ModalGeneric/StepperModal';
import { SuccessModalContent } from 'src/components/modals/SuccessModalContent';

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
              text="Merci pour votre message."
            />
          );
        },
      ]}
    />
  );
};
