import React from 'react';
import { DefaultValues } from 'react-hook-form';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';
import { useUpdateUser } from '@/src/hooks';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { User, UserProfile } from 'src/api/types';
import {
  ExtractFormSchemaValidation,
  FormSchema,
} from 'src/features/forms/FormSchema';
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
  ) => Partial<UserProfile> & { companyName?: string | null };
  user: User;
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
  const { updateUserCompany } = useUpdateUser(user);

  return (
    <ModalEdit
      title={title}
      description={description}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      formSchema={formSchema}
      onSubmit={async (fields) => {
        const values = getValuesToSend(fields);
        const { companyName, ...userProfileFields } = values;
        updateUserCompany(companyName || null);
        updateUserProfile(userProfileFields);
      }}
      noCompulsory
    />
  );
};
