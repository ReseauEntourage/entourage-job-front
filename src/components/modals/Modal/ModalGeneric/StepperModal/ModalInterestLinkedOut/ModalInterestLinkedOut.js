import React from 'react';
import SuccessModalContent from 'src/components/modals/SuccessModalContent';
import StepperModal from 'src/components/modals/Modal/ModalGeneric/StepperModal';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import interestLinkedOutSchema from 'src/components/forms/schema/formInterestLinkedOut';
import Api from 'src/api/index.ts';

const ModalInterestLinkedOut = () => {
  return (
    <StepperModal
      title="Formulaire de contact"
      composers={[
        (closeModal, nextStep) => {
          return (
            <FormWithValidation
              submitText="Envoyer"
              formSchema={interestLinkedOutSchema}
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

export default ModalInterestLinkedOut;
