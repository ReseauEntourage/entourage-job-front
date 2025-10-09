import React from 'react';
import { DefaultValues } from 'react-hook-form';
import { Api } from '@/src/api';
import { CREATE_NEW_COMPANY_VALUE } from '@/src/components/forms/schemas/formEditCoachProfessionalInformation';
import { useUpdateUser } from '@/src/hooks';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
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
  ) => Partial<UserProfile> & { companyId?: string | null };
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
        const { companyId, ...userProfileFields } = values;
        let newCompanyId = companyId;
        if (companyId === CREATE_NEW_COMPANY_VALUE) {
          ({
            data: { id: newCompanyId },
          } = await Api.postCompany({
            name: fields.companyName,
          }));
        }
        updateUserCompany(newCompanyId || null);
        updateUserProfile(userProfileFields);
      }}
      noCompulsory
    />
  );
};
