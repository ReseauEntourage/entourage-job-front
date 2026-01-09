import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { UserProfileNudge } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { ExtractFormSchemaValidation } from '@/src/features/forms/FormSchema';
import {
  formEditCustomNudgeCoach,
  formEditCustomNudgeCandidate,
} from '@/src/features/forms/schemas/formEditCustomNudge';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';

interface ProfileCustomNudgesModalEditProps {
  dispatchOnSubmit: (keyValue: { content: string }) => void;
  customNudge: UserProfileNudge;
  role: UserRoles;
}

export const ProfileCustomNudgesModalEdit = ({
  dispatchOnSubmit,
  customNudge,
  role,
}: ProfileCustomNudgesModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<
      typeof formEditCustomNudgeCandidate | typeof formEditCustomNudgeCoach
    >
  > = {
    content: customNudge?.content ?? '',
  };

  return (
    <ModalEdit
      title={
        role === UserRoles.CANDIDATE
          ? 'Détaillez vos besoins d’accompagnement'
          : 'Détaillez vos offres d’accompagnement'
      }
      formSchema={
        role === UserRoles.CANDIDATE
          ? formEditCustomNudgeCandidate
          : formEditCustomNudgeCoach
      }
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
};
