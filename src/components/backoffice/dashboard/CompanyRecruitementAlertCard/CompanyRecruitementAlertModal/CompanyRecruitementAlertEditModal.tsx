import React, { useCallback, useMemo } from 'react';
import { RecruitementAlert, RecruitementAlertDto } from '@/src/api/types';
import { DEPARTMENTS_FILTERS } from '@/src/constants/departements';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { Api } from 'src/api';
import { FormComponents, FormSchema } from 'src/components/forms/FormSchema';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Contract, CONTRACTS, WORKING_EXPERIENCE_FILTERS } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

type RecruitementAlertForm = {
  companyId: string;
  name: string;
  jobName: string;
  department?: FilterConstant<string>;
  businessSectors: FilterConstant<string>[];
  workingExperience: FilterConstant<string>;
  contract: FilterConstant<string>;
  skills: FilterConstant<string>[];
};

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

  // Mémoriser les fonctions de chargement des options pour éviter des recréations inutiles
  const loadBusinessSectorsOptions = useCallback(
    async (callback, inputValue) => {
      try {
        const { data: businessSectors } = await Api.getAllBusinessSectors({
          limit: 100,
          offset: 0,
          search: inputValue || undefined,
        });
        callback([
          ...businessSectors.map((u) => {
            return {
              value: u.id,
              label: u.name,
            };
          }),
        ]);
      } catch (error) {
        console.error(error);
        callback([]);
      }
    },
    []
  );

  const loadSkillsOptions = useCallback(async (callback, inputValue) => {
    try {
      const { data: skills } = await Api.getAllSkills({
        search: inputValue || undefined,
        limit: 50,
        offset: 0,
      });
      callback([
        ...skills.map((skill) => {
          return {
            value: skill.id,
            label: skill.name,
          };
        }),
      ]);
    } catch (error) {
      console.error(error);
      callback([]);
    }
  }, []);

  // Convertir les valeurs de l'alerte en format compatible avec le formulaire
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

  const formSchema: FormSchema<RecruitementAlertForm> = {
    id: 'form-recruitement-alert-edit',
    fields: [
      {
        id: 'name',
        name: 'name',
        component: FormComponents.TEXT_INPUT,
        title: "Nom de l'alerte",
        placeholder: 'Mon alerte de recrutement',
        isRequired: true,
        showLabel: true,
        type: 'text',
      },
      {
        id: 'jobName',
        name: 'jobName',
        component: FormComponents.TEXT_INPUT,
        title: 'Poste recherché',
        placeholder: 'Développeur web, assistant administratif...',
        isRequired: true,
        showLabel: true,
        type: 'text',
      },
      {
        id: 'department',
        name: 'department',
        component: FormComponents.SELECT,
        title: 'Département',
        placeholder: 'Choisissez un département',
        options: DEPARTMENTS_FILTERS,
        isRequired: false,
        showLabel: true,
        isMulti: false,
      },
      {
        id: 'businessSectors',
        name: 'businessSectors',
        component: FormComponents.SELECT_CREATABLE,
        title: "Secteurs d'activité",
        placeholder: "Choisissez ou créez des secteurs d'activité",
        loadOptions: loadBusinessSectorsOptions,
        isRequired: false,
        showLabel: true,
        isMulti: true,
      },
      {
        id: 'workingExperience',
        name: 'workingExperience',
        component: FormComponents.SELECT,
        title: "Années d'expérience",
        placeholder: 'Choisissez une expérience',
        options: WORKING_EXPERIENCE_FILTERS,
        isRequired: true,
        showLabel: true,
        isMulti: false,
      },
      {
        id: 'contract',
        name: 'contract',
        component: FormComponents.SELECT,
        title: 'Type de contrat',
        placeholder: 'Choisissez un type de contrat',
        options: CONTRACTS,
        isRequired: true,
        showLabel: true,
        isMulti: false,
      },
      {
        id: 'skills',
        name: 'skills',
        component: FormComponents.SELECT_CREATABLE,
        title: 'Compétences',
        placeholder: 'Choisissez ou créez des compétences',
        loadOptions: loadSkillsOptions,
        isRequired: false,
        showLabel: true,
        isMulti: true,
      },
    ],
  };

  // TODO: probleme modal ne call pas le handlesubmit
  const handleSubmit = useCallback(
    async (
      values: RecruitementAlertForm,
      closeModal: () => void = () => {},
      _action: (message: string) => void = () => {}
    ) => {
      try {
        if (!user?.company) {
          throw new Error('User has no associated companies');
        }

        const recruitementAlertDto: RecruitementAlertDto = {
          companyId: user.company.id,
          name: values.name,
          jobName: values.jobName,
          department: values.department?.value,
          businessSectorIds: values.businessSectors?.map(
            (sector) => sector.value
          ),
          workingExperienceYears: values.workingExperience?.value,
          contractType: values.contract?.value as Contract,
          skills: values.skills,
        };

        onSubmit(recruitementAlertDto);
        closeModal();
        onClose();
      } catch (error) {
        console.error('Error in handleSubmit:', error);
      }
    },
    [user, onSubmit, onClose]
  );

  if (!isOpen) return null;

  return (
    <ModalEdit
      title="Modifier une alerte mail"
      description="Modifiez les critères de votre alerte de recrutement"
      formSchema={formSchema}
      closeOnNextRender
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitText="Enregistrer les modifications"
      defaultValues={initialValues}
    />
  );
};
