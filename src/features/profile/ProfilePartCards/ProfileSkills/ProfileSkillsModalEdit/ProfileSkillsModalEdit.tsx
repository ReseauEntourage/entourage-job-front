import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { Skill } from '@/src/api/types';
import { FilterConstant } from '@/src/constants/utils';
import { ExtractFormSchemaValidation } from '@/src/features/forms/FormSchema';
import { formEditSkills } from '@/src/features/forms/schemas/formEditSkills';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';

interface ProfileSkillsModalEditProps {
  dispatchOnSubmit: (keyValue: { skills: FilterConstant<string>[] }) => void;
  skills: Skill[];
}

export const ProfileSkillsModalEdit = ({
  dispatchOnSubmit,
  skills,
}: ProfileSkillsModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formEditSkills>
  > = {
    skills: skills.map((skill) => ({
      value: skill.name,
      label: skill.name,
    })),
  };

  return (
    <ModalEdit
      title="Compétences clés"
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
