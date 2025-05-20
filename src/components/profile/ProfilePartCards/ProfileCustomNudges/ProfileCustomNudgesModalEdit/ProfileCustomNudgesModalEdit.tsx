import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { UserProfileNudge } from '@/src/api/types';
import { ExtractFormSchemaValidation } from '@/src/components/forms/FormSchema';
import { formEditCustomNudge } from '@/src/components/forms/schemas/formEditCustomNudge';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';

interface ProfileCustomNudgesModalEditProps {
  dispatchOnSubmit: (keyValue: { content: string }) => void;
  customNudge: UserProfileNudge;
}

export const ProfileCustomNudgesModalEdit = ({
  dispatchOnSubmit,
  customNudge,
}: ProfileCustomNudgesModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formEditCustomNudge>
  > = {
    content: customNudge?.content ?? '',
  };

  return (
    <ModalEdit
      title="Détaillez vos besoins"
      formSchema={formEditCustomNudge}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
};
