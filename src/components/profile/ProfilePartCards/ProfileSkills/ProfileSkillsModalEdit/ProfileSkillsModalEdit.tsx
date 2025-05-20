import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { Skill } from '@/src/api/types';
import { ExtractFormSchemaValidation } from '@/src/components/forms/FormSchema';
import { formEditSkills } from '@/src/components/forms/schemas/formEditSkills';
import { FilterConstant } from '@/src/constants/utils';
import { sortByOrder } from '@/src/utils';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';

interface ProfileSkillsModalEditProps {
  dispatchOnSubmit: (keyValue: { skills: FilterConstant<string>[] }) => void;
  skills: Skill[];
}

export const ProfileSkillsModalEdit = ({
  dispatchOnSubmit,
  skills,
}: ProfileSkillsModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const sortedSkills = skills && skills.length > 0 ? sortByOrder(skills) : null;

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formEditSkills>
  > = {
    skills:
      sortedSkills?.map((i) => {
        return {
          value: i.name,
          label: i.name,
        };
      }) ?? [],
  };

  return (
    <ModalEdit
      title="Compétences clées"
      formSchema={formEditSkills}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
};
