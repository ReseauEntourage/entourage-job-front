import React from 'react';
import { formEditCompanyDescription } from '@/src/features/forms/schemas/formEditCompanyDescription';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';
import { useUpdateCompany } from '@/src/hooks/useUpdateCompany';

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
      description="Ces informations seront visibles par tous les utilisateurs de la plateforme"
      defaultValues={{
        description: description || '',
      }}
      formSchema={formEditCompanyDescription}
      onSubmit={(values, onClose: () => void) => {
        updateCompany({
          description: values.description,
        });
        onClose();
      }}
    />
  );
};
