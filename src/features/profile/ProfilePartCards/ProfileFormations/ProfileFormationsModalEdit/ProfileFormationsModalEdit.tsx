import moment from 'moment';
import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { Formation } from '@/src/api/types';
import { FilterConstant } from '@/src/constants/utils';
import { ExtractFormSchemaValidation } from '@/src/features/forms/FormSchema';
import { formEditFormation } from '@/src/features/forms/schemas/formEditFormation';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';

interface ProfileFormationsModalEditProps {
  dispatchOnSubmit: (keyValue: {
    title: string;
    location: string;
    institution: string;
    startDate: string;
    endDate: string;
    description: string;
    skills: FilterConstant<string>[];
  }) => void;
  formation?: Formation;
}

export const ProfileFormationsModalEdit = ({
  dispatchOnSubmit,
  formation,
}: ProfileFormationsModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formEditFormation>
  > = {
    title: formation?.title ?? '',
    location: formation?.location ?? '',
    institution: formation?.institution ?? '',
    startDate: formation?.startDate
      ? moment(formation.startDate).format('YYYY-MM-DD')
      : '',
    endDate: formation?.endDate
      ? moment(formation.endDate).format('YYYY-MM-DD')
      : '',
    description: formation?.description ?? '',
    skills:
      formation?.skills?.map(({ name }) => {
        return { value: name, label: name };
      }) ?? [],
  };

  return (
    <ModalEdit
      title="Editer la formation"
      formSchema={formEditFormation}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
};
