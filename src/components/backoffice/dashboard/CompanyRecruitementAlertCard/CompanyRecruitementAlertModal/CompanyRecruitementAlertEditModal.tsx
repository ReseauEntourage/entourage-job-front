import React, { useCallback, useMemo } from 'react';
import { RecruitementAlert, RecruitementAlertDto } from '@/src/api/types';
import { Department, DEPARTMENTS_FILTERS } from '@/src/constants/departements';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Contract, CONTRACTS, WORKING_EXPERIENCE_FILTERS } from 'src/constants';
import {
  formSchema,
  RecruitementAlertForm,
} from './formCompanyRecruitementAlert';

interface CompanyRecruitementAlertEditModalProps {
  alert: RecruitementAlert;
  onSubmit: (data: RecruitementAlertDto) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyRecruitementAlertEditModal = ({
  alert,
  onSubmit,
  isOpen,
  onClose,
}: CompanyRecruitementAlertEditModalProps) => {
  const user = useAuthenticatedUser();

  const initialValues = useMemo(
    () => ({
      name: alert.name || '',
      jobName: alert.jobName || '',
      department: alert.department
        ? DEPARTMENTS_FILTERS.find((dep) => dep.value === alert.department)
        : undefined,
      businessSectors:
        alert.businessSectors?.map((sector) => ({
          value: sector.id || '',
          label: sector.name,
        })) || [],
      workingExperience: WORKING_EXPERIENCE_FILTERS.find(
        (exp) => exp.value === alert.workingExperienceYears
      ),
      contract: CONTRACTS.find((c) => c.value === alert.contractType),
      skills:
        alert.skills?.map((skill) => ({
          value: skill.id || '',
          label: skill.name,
        })) || [],
    }),
    [alert]
  );

  const handleSubmit = useCallback(
    async (values: RecruitementAlertForm) => {
      try {
        if (!user?.company) {
          throw new Error('User has no associated companies');
        }

        const recruitementAlertDto: RecruitementAlertDto = {
          companyId: user.company.id,
          name: values.name,
          jobName: values.jobName,
          department: (values.department?.value as Department) || null,
          businessSectorIds: values.businessSectors?.map(
            (sector) => sector.value
          ),
          workingExperienceYears: values.workingExperience?.value,
          contractType: values.contract?.value as Contract,
          skills: values.skills,
        };

        onSubmit(recruitementAlertDto);
        if (onClose) onClose();
      } catch (error) {
        console.error('Error in handleSubmit:', error);
      }
    },
    [user, onSubmit, onClose]
  );

  if (!isOpen) return null;

  return (
    // I had issues with ModalEdit here, so I replaced it with ModalGeneric + FormWithValidation directly
    <ModalGeneric
      title="Modifier une alerte mail"
      description="Modifiez les critères de votre alerte de recrutement"
      onClose={onClose}
    >
      <FormWithValidation
        submitText="Enregistrer"
        cancelText="Annuler"
        formSchema={formSchema}
        defaultValues={initialValues}
        onCancel={() => {
          if (onClose) onClose();
        }}
        onSubmit={(fields) => {
          handleSubmit(fields);
        }}
      />
    </ModalGeneric>
  );
};
