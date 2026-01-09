import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { Interest } from '@/src/api/types';
import { FilterConstant } from '@/src/constants/utils';
import { ExtractFormSchemaValidation } from '@/src/features/forms/FormSchema';
import { formEditInterests } from '@/src/features/forms/schemas/formEditInterests';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';
import { sortByOrder } from '@/src/utils';

interface ProfileInterestsModalEditProps {
  dispatchOnSubmit: (keyValue: { interests: FilterConstant<string>[] }) => void;
  interests: Interest[];
}

export const ProfileInterestsModalEdit = ({
  dispatchOnSubmit,
  interests,
}: ProfileInterestsModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const sortedInterests =
    interests && interests.length > 0 ? sortByOrder(interests) : null;

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formEditInterests>
  > = {
    interests:
      sortedInterests?.map((i) => {
        return {
          value: i.name,
          label: i.name,
        };
      }) ?? [],
  };

  return (
    <ModalEdit
      title="Centres d'intérêt"
      formSchema={formEditInterests}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
};
