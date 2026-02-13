import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { BusinessSector, Department } from '@/src/api/types';
import { FilterConstant } from '@/src/constants/utils';
import { ExtractFormSchemaValidation } from '@/src/features/forms/FormSchema';
import { formEditCompanyInfos } from '@/src/features/forms/schemas/formEditCompanyInfos';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';

interface CompanyInfosModalEditProps {
  dispatchOnSubmit: (keyValue: {
    departmentId: FilterConstant<string>;
    businessSectorIds: FilterConstant<string>[];
    logo: File;
  }) => void;
  department?: Department;
  businessSectors?: BusinessSector[];
}

export const CompanyInfosModalEdit = ({
  dispatchOnSubmit,
  department,
  businessSectors,
}: CompanyInfosModalEditProps) => {
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formEditCompanyInfos>
  > = {
    departmentId: {
      value: department?.id,
      label: department?.name,
    },
    businessSectorIds: businessSectors?.map((sector) => ({
      value: sector.id,
      label: sector.name,
    })),
  };

  return (
    <ModalEdit
      title="Renseignez les informations de votre entreprise"
      description="Ces informations seront visibles par tous les utilisateurs de la plateforme"
      formSchema={formEditCompanyInfos}
      defaultValues={defaultValues}
      closeOnNextRender={closeModal}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
};
