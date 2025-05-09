import React from 'react';
import { DefaultValues } from 'react-hook-form';
import { useUpdateProfile } from '../../../../../../hooks/useUpdateProfile';
import { UserProfile, UserWithUserCandidate } from 'src/api/types';
import {
  ExtractFormSchemaValidation,
  FormSchema,
} from 'src/components/forms/FormSchema';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { AnyCantFix } from 'src/utils/Types';

interface ModalEditProfessionalInformationProps<
  S extends FormSchema<AnyCantFix>
> {
  title: React.ReactNode;
  description: React.ReactNode;
  defaultValues: DefaultValues<ExtractFormSchemaValidation<S>>;
  formSchema: S;
  getValuesToSend: (
    fields: ExtractFormSchemaValidation<S>
  ) => Partial<UserProfile>;
  user: UserWithUserCandidate;
}

export const ModalEditProfessionalInformation = <
  S extends FormSchema<AnyCantFix>
>({
  title,
  description,
  defaultValues,
  formSchema,
  getValuesToSend,
  user,
}: ModalEditProfessionalInformationProps<S>) => {
  const { updateUserProfile, closeModal } = useUpdateProfile(user);

  return (
    <ModalEdit
      title={title}
      description={description}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      formSchema={formSchema}
      onSubmit={(fields) => {
        const values = getValuesToSend(fields);
        updateUserProfile(values);
      }}
      noCompulsory
    />
  );
};
