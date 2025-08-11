import React from 'react';
import { RecruitementAlertDto } from '@/src/api/types';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { Api } from 'src/api';
import { FormComponents, FormSchema } from 'src/components/forms/FormSchema';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Contract, CONTRACTS, WORKING_EXPERIENCE_FILTERS } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

const loadBusinessSectorsOptions = async (callback, inputValue) => {
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
};

const loadSkillsOptions = async (callback, inputValue) => {
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
};

type RecruitementAlertForm = {
  companyId: string;
  name: string;
  jobName: string;
  businessSectors: FilterConstant<string>[];
  workingExperience: FilterConstant<string>;
  contract: FilterConstant<string>;
  skills: FilterConstant<string>[];
};

export const CompanyRecruitementAlertModal = () => {
  const { onClose } = useModalContext();
  const user = useAuthenticatedUser();

  const formSchema: FormSchema<RecruitementAlertForm> = {
    id: 'form-recruitement-alert',
    fields: [
      {
        id: 'name',
        name: 'name',
        component: FormComponents.TEXT_INPUT,
        title: "Nom de l'alerte",
        placeholder: 'Renseignez le nom de votre alerte: Ex: Vendeur',
        isRequired: true,
        showLabel: true,
        type: 'text',
      },
      {
        id: 'jobName',
        name: 'jobName',
        component: FormComponents.TEXT_INPUT,
        title: 'Métier',
        placeholder: 'Renseignez le métier recherché',
        isRequired: false,
        showLabel: true,
        type: 'text',
      },
      {
        id: 'businessSectors',
        name: 'businessSectors',
        component: FormComponents.SELECT_ASYNC,
        loadOptions: loadBusinessSectorsOptions,
        title: 'Secteurs',
        placeholder: 'Sélectionnez un ou plusieurs secteurs dans la liste',
        isMulti: true,
        isRequired: false,
        showLabel: true,
      },
      {
        id: 'workingExperience',
        name: 'workingExperience',
        component: FormComponents.SELECT,
        title: "Nombre d'années d'expérience",
        placeholder: 'Sélectionnez dans la liste',
        options: WORKING_EXPERIENCE_FILTERS,
        isRequired: false,
        showLabel: true,
        isMulti: false,
      },
      {
        id: 'contract',
        name: 'contract',
        component: FormComponents.SELECT,
        title: 'Type de contrat',
        placeholder: 'Sélectionnez dans la liste',
        options: CONTRACTS,
        isRequired: false,
        showLabel: true,
        isMulti: false,
      },
      {
        id: 'skills',
        name: 'skills',
        component: FormComponents.SELECT_CREATABLE,
        loadOptions: loadSkillsOptions,
        title: 'Compétences',
        placeholder: 'Sélectionnez les compétences clés pour ce poste',
        isMulti: true,
        maxChar: 30,
        maxItems: 5,
        isRequired: false,
        showLabel: true,
      },
    ],
  };

  const handleSubmit = async (values: RecruitementAlertForm) => {
    try {
      if (!user?.companies || user.companies.length === 0) {
        throw new Error('User has no associated companies');
      }
      const recruitementAlertDto: RecruitementAlertDto = {
        companyId: user.companies[0].id,
        name: values.name,
        jobName: values.jobName,
        businessSectorIds: values.businessSectors?.map(
          (sector) => sector.value
        ),
        workingExperienceYears: values.workingExperience.value,
        contractType: values.contract.value as Contract,
        skills: values.skills,
      };
      await Api.createRecruitementAlert(recruitementAlertDto);
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
    }
  };

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
