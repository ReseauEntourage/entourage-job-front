import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { ExtractFormSchemaValidation } from '@/src/components/forms/FormSchema';
import { formEditDocuments } from '@/src/components/forms/schemas/formEditDocuments';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';

interface ProfileDocumentsModalEditProps {
  dispatchOnSubmit: (keyValue: {
    linkedinUrl: string;
    externalCv: File;
  }) => void;
  linkedinUrl?: string;
}

export const ProfileDocumentsModalEdit = ({
  dispatchOnSubmit,
  linkedinUrl,
}: ProfileDocumentsModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formEditDocuments>
  > = {
    linkedinUrl: linkedinUrl || undefined,
  };

  return (
    <ModalEdit
      title="Mes liens et documents"
      formSchema={formEditDocuments}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
};
