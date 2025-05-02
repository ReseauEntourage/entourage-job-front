import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { Interest } from '@/src/api/types';
import { ExtractFormSchemaValidation } from '@/src/components/forms/FormSchema';
import { formEditInterests } from '@/src/components/forms/schemas/formEditInterests';
import { FilterConstant } from '@/src/constants/utils';
import { sortByOrder } from '@/src/utils';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';

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
      }, {}) ?? [],
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
