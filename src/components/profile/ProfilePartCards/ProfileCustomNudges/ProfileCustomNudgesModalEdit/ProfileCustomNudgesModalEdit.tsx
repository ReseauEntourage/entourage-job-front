import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { UserProfileNudge } from '@/src/api/types';
import { ExtractFormSchemaValidation } from '@/src/components/forms/FormSchema';
import {
  formEditCustomNudgeCoach,
  formEditCustomNudgeCandidate,
} from '@/src/components/forms/schemas/formEditCustomNudge';
import { UserRoles } from '@/src/constants/users';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';

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
      title="Détaillez vos besoins"
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
