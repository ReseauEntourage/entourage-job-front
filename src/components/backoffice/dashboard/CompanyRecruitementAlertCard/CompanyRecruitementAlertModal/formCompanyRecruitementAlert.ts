import { Api } from '@/src/api';
import { FormComponents, FormSchema } from '@/src/components/forms/FormSchema';
import { CONTRACTS, WORKING_EXPERIENCE_FILTERS } from '@/src/constants';
import { DEPARTMENTS_FILTERS } from '@/src/constants/departements';
import { FilterConstant } from '@/src/constants/utils';

export type RecruitementAlertForm = {
  companyId: string;
  name: string;
  jobName: string;
  department?: FilterConstant<string>;
  businessSectors: FilterConstant<string>[];
  workingExperience: FilterConstant<string>;
  contract: FilterConstant<string>;
  skills: FilterConstant<string>[];
};

const loadBusinessSectorsOptions = async (
  callback: (options: FilterConstant[]) => void,
  inputValue?: string
) => {
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

const loadSkillsOptions = async (
  callback: (options: FilterConstant[]) => void,
  inputValue?: string
) => {
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

export const formSchema: FormSchema<RecruitementAlertForm> = {
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
      rules: [
        {
          method: (value) => value.length >= 3,
          message: "Le nom de l'alerte doit contenir au moins 3 caractères",
        },
        {
          method: (value) => value.length <= 50,
          message: "Le nom de l'alerte ne doit pas dépasser 50 caractères",
        },
      ],
    },
    {
      id: 'jobName',
      name: 'jobName',
      component: FormComponents.TEXT_INPUT,
      title: 'Métier',
      placeholder: 'Renseignez le métier recherché',
      isRequired: true,
      showLabel: true,
      type: 'text',
      rules: [
        {
          method: (value) => !value || value.length <= 100,
          message: 'Le nom du métier ne doit pas dépasser 100 caractères',
        },
      ],
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
      rules: [
        {
          method: (value) => !value || value.length <= 20,
          message:
            "Vous ne pouvez pas sélectionner plus de 20 secteurs d'activité",
        },
      ],
    },
    {
      id: 'department',
      name: 'department',
      title: 'Localisation',
      component: 'select',
      options: DEPARTMENTS_FILTERS,
      isRequired: false,
      showLabel: true,
      isMulti: false,
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
      rules: [
        {
          method: (value) => !value || value.length <= 20,
          message: 'Vous ne pouvez pas sélectionner plus de 20 compétences',
        },
        {
          method: (value) => {
            if (!value) return true;
            return value.every((item) => {
              return (
                !item.label ||
                (typeof item.label === 'string' && item.label.length <= 50)
              );
            });
          },
          message: 'Chaque compétence ne doit pas dépasser 50 caractères',
        },
      ],
    },
  ],
};
