import React from 'react';
import { formEditCompanyDescription } from '@/src/components/forms/schemas/formEditCompanyDescription';
import { useUpdateCompany } from '@/src/hooks/useUpdateCompany';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';

export const ModalEditCompanyDescription = ({
  description,
}: {
  description: string | null;
}) => {
  const { updateCompany, closeModal } = useUpdateCompany();

  return (
    <ModalEdit
      title="Ecrire une description de votre entreprise"
      closeOnNextRender={closeModal}
      defaultValues={{
        description: description || '',
      }}
      formSchema={formEditCompanyDescription}
      description="Ces informations seront visibles par tous les candidats de la plateforme"
      onSubmit={(values, onClose: () => void) => {
        updateCompany({
          description: values.description,
        });
        onClose();
      }}
    />
  );
};
