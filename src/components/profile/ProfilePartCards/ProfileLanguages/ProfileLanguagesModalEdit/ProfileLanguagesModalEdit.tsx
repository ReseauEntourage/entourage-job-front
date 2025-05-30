import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { UserProfileLanguage } from '@/src/api/types';
import { ExtractFormSchemaValidation } from '@/src/components/forms/FormSchema';
import { formEditLanguages } from '@/src/components/forms/schemas/formEditLanguages';
import { FilterConstant } from '@/src/constants/utils';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';

interface ProfileLanguagesModalEditProps {
  dispatchOnSubmit: (keyValue: { languages: FilterConstant<string>[] }) => void;
  userProfileLanguages: UserProfileLanguage[];
}

export const ProfileLanguagesModalEdit = ({
  dispatchOnSubmit,
  userProfileLanguages,
}: ProfileLanguagesModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formEditLanguages>
  > = {
    languages:
      userProfileLanguages?.map((upLanguage) => {
        return {
          value: upLanguage.language?.id,
          label: upLanguage.language?.name,
        };
      }) ?? [],
  };

  return (
    <ModalEdit
      title="Langues parlées"
      formSchema={formEditLanguages}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
};
