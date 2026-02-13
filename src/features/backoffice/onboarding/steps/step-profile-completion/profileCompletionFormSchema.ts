import type {
  FormSchema,
  FormFieldInput,
} from '@/src/features/forms/FormSchema';
import {
  loadBusinessSectorsOptions,
  loadCompaniesOptions,
  loadLanguagesOptions,
  loadSkillsOptions,
} from '@/src/features/forms/utils/loadOptions.utils';
import type { AnyCantFix } from '@/src/utils/Types';

export const profileCompletionFormSchema: FormSchema<AnyCantFix> = {
  id: 'form-onboarding-profile-completion',
  fields: [],
};

export const buildIntroductionField = (
  introductionPlaceholder: string
): FormFieldInput<AnyCantFix> => ({
  id: 'introduction',
  name: 'introduction',
  component: 'textarea',
  title: 'Présentation *',
  placeholder: introductionPlaceholder,
  isRequired: true,
  showLabel: true,
  minLength: 50,
  maxLength: 500,
  rows: 3,
});

export const profileCompletionProfessionalInfoCoachFields: FormFieldInput<AnyCantFix>[] =
  [
    {
      id: 'currentJob',
      name: 'currentJob',
      component: 'text-input',
      title: 'Mon métier *',
      placeholder: 'Ecrivez votre métier',
      isRequired: true,
      showLabel: true,
      maxLength: 50,
    },
    {
      id: 'companyName',
      name: 'companyName',
      component: 'select-creatable',
      title: "L'entreprise dans laquelle je travaille",
      placeholder: 'Sélectionnez ou ajoutez le nom de votre entreprise',
      isMulti: false,
      showLabel: true,
      openMenuOnClick: true,
      maxChar: 60,
      options: [],
      loadOptions: loadCompaniesOptions,
    },
    {
      id: 'businessSectorIds',
      name: 'businessSectorIds',
      component: 'select-async',
      title: "Les secteurs dans lesquels j'ai du réseau *",
      placeholder: 'Sélectionnez un ou plusieurs secteurs dans la liste',
      isMulti: true,
      showLabel: true,
      openMenuOnClick: true,
      rules: [
        {
          method: (fieldValue) => {
            return Array.isArray(fieldValue) && fieldValue.length > 0;
          },
          message: 'Veuillez sélectionner au moins un secteur.',
        },
      ],
      loadOptions: loadBusinessSectorsOptions,
    },
    {
      id: 'linkedinUrl',
      name: 'linkedinUrl',
      component: 'text-input',
      title: 'Profil LinkedIn',
      placeholder: 'https://www.linkedin.com/in/votre-profil',
      showLabel: true,
      rules: [
        {
          method: (fieldValue: string) => {
            return !fieldValue || fieldValue.includes('linkedin.com');
          },
          message: 'URL LinkedIn invalide.',
        },
      ],
    },
  ];

export const profileCompletionProfessionalInfoCandidateRows: {
  rowIndex: 0 | 1;
  fields: [FormFieldInput<AnyCantFix>, FormFieldInput<AnyCantFix>];
}[] = [
  {
    rowIndex: 0,
    fields: [
      {
        id: 'businessSectorId0',
        name: 'businessSectorId0',
        component: 'select-async',
        title: 'Secteur(s) recherché(s)',
        placeholder: 'Secteur 1*',
        isMulti: false,
        isRequired: true,
        showLabel: true,
        openMenuOnClick: true,
        loadOptions: loadBusinessSectorsOptions,
      },
      {
        id: 'occupation0',
        name: 'occupation0',
        component: 'text-input',
        title: 'Métier(s) recherché(s)',
        placeholder: 'Métier 1',
        showLabel: true,
        maxLength: 50,
      },
    ],
  },
  {
    rowIndex: 1,
    fields: [
      {
        id: 'businessSectorId1',
        name: 'businessSectorId1',
        component: 'select-async',
        placeholder: 'Secteur 2',
        isMulti: false,
        showLabel: true,
        openMenuOnClick: true,
        rules: [
          {
            method: (fieldValue, fieldValues) => {
              return !!fieldValue || !fieldValues.occupation1;
            },
            message: 'Obligatoire',
          },
        ],
        loadOptions: loadBusinessSectorsOptions,
      },
      {
        id: 'occupation1',
        name: 'occupation1',
        component: 'text-input',
        placeholder: 'Métier 2',
        showLabel: true,
        maxLength: 50,
      },
    ],
  },
];

export const profileCompletionCvFields: FormFieldInput<AnyCantFix>[] = [
  {
    id: 'description',
    name: 'description',
    component: 'textarea',
    title: 'Résumé de votre profil',
    placeholder:
      'En quelques lignes, présentez votre profil, vos objectifs et ce que vous recherchez.\n\nEx. : J’ai travaillé pendant 6 ans comme agent polyvalent en restauration collective. J’ai également une expérience en manutention et en préparation de commandes.',
    showLabel: true,
    maxLength: 1000,
    rows: 4,
  },
  {
    id: 'skills',
    name: 'skills',
    component: 'select-creatable',
    title: 'Compétences',
    placeholder: 'Sélectionnez une ou plusieurs compétences dans la liste',
    isMulti: true,
    showLabel: true,
    openMenuOnClick: true,
    options: [],
    maxItems: 50,
    loadOptions: (callback, inputValue) =>
      loadSkillsOptions(callback, inputValue, true),
  },
  {
    id: 'languages',
    name: 'languages',
    component: 'select-async',
    title: 'Langues parlées',
    placeholder: 'Sélectionnez une ou plusieurs langues',
    isMulti: true,
    showLabel: true,
    openMenuOnClick: true,
    loadOptions: loadLanguagesOptions,
  },
  {
    id: 'interests',
    name: 'interests',
    component: 'select-creatable',
    title: "Centres d'intérêt",
    placeholder: 'Ajoutez jusqu’à 6 centres d’intérêt',
    isMulti: true,
    showLabel: true,
    openMenuOnClick: true,
    maxChar: 30,
    maxItems: 6,
    options: [],
  },
];
