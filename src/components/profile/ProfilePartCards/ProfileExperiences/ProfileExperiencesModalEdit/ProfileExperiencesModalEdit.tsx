import moment from 'moment';
import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { Experience } from '@/src/api/types';
import { ExtractFormSchemaValidation } from '@/src/components/forms/FormSchema';
import { formEditExperience } from '@/src/components/forms/schemas/formEditExperience';
import { FilterConstant } from '@/src/constants/utils';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';

interface ProfileExperiencesModalEditProps {
  dispatchOnSubmit: (keyValue: {
    title: string;
    location: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    skills: FilterConstant<string>[];
  }) => void;
  experience?: Experience;
}

export const ProfileExperiencesModalEdit = ({
  dispatchOnSubmit,
  experience,
}: ProfileExperiencesModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formEditExperience>
  > = {
    title: experience?.title ?? '',
    location: experience?.location ?? '',
    company: experience?.company ?? '',
    startDate: experience?.startDate
      ? moment(experience.startDate).format('YYYY-MM-DD')
      : '',
    endDate: experience?.endDate
      ? moment(experience.endDate).format('YYYY-MM-DD')
      : '',
    description: experience?.description ?? '',
    skills:
      experience?.skills?.map(({ name }) => {
        return { value: name, label: name };
      }) ?? [],
  };

  return (
    <ModalEdit
      title="Editer l'expérience"
      formSchema={formEditExperience}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
};
