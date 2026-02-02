import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { ExtractFormSchemaValidation } from '@/src/features/forms/FormSchema';
import { formEditCompanyLinks } from '@/src/features/forms/schemas/formEditCompanyLinks';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';

interface CompanyLinksModalEditProps {
  dispatchOnSubmit: (keyValue: {
    url: string | null;
    linkedInUrl: string | null;
    hiringUrl: string | null;
  }) => void;
  url?: string | null;
  linkedInUrl?: string | null;
  hiringUrl?: string | null;
}

export const CompanyLinksModalEdit = ({
  dispatchOnSubmit,
  url,
  linkedInUrl,
  hiringUrl,
}: CompanyLinksModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formEditCompanyLinks>
  > = {
    url: url || '',
    linkedInUrl: linkedInUrl || '',
    hiringUrl: hiringUrl || '',
  };

  return (
    <ModalEdit
      title="Liens de votre entreprise"
      description="Ces informations seront visibles par tous les utilisateurs de la plateforme"
      formSchema={formEditCompanyLinks}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
};
