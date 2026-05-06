import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { RecruitementAlertDto } from '@/src/api/types';
import { DepartmentName } from '@/src/constants/departements';
import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';
import { Contract } from 'src/constants';
import { createRecruitementAlertAction } from 'src/use-cases/recruitement-alerts';
import {
  formSchema,
  RecruitementAlertForm,
} from './formCompanyRecruitementAlert';

export const CompanyRecruitementAlertModal = () => {
  const company = useCurrentUserCompany();
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    async (
      values: RecruitementAlertForm,
      onClose: () => void,
      setError: (msg: string) => void
    ) => {
      try {
        if (!company) {
          setError("Votre compte n'est associé à aucune entreprise");
          return;
        }
        const recruitementAlertDto: RecruitementAlertDto = {
          companyId: company.id,
          name: values.name,
          jobName: values.jobName,
          department: (values.department?.value as DepartmentName) || null,
          businessSectorIds: values.businessSectors?.map(
            (sector) => sector.value
          ),
          workingExperienceYears: values.workingExperience?.value,
          contractType: values.contract?.value as Contract,
          skills: values.skills,
        };
        dispatch(createRecruitementAlertAction(recruitementAlertDto));
        onClose();
      } catch (error) {
        console.error(error);
        setError("Une erreur est survenue lors de la création de l'alerte");
      }
    },
    [company, dispatch]
  );

  return (
    <ModalEdit
      title="Créer une alerte mail"
      description="Vous recevrez un mail dès qu'un candidat correspondra à votre recherche"
      formSchema={formSchema}
      onSubmit={handleSubmit}
      submitText="Créer l'alerte"
    />
  );
};
