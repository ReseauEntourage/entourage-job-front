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

export const PROFILE_COMPLETION_FORM_ID = 'form-onboarding-profile-completion';

export const profileCompletionFormSchema: FormSchema<AnyCantFix> = {
  id: PROFILE_COMPLETION_FORM_ID,
  fields: [],
};

export const buildIntroductionField = (
  introductionPlaceholder: string
): FormFieldInput<AnyCantFix> => ({
  id: 'description',
  name: 'description',
  component: 'textarea',
  title: 'Présentation',
  placeholder: introductionPlaceholder,
  showLabel: true,
  maxLength: 500,
  rows: 3,
});

export const coachCurrentJobField: FormFieldInput<AnyCantFix> = {
  id: 'currentJob',
  name: 'currentJob',
  component: 'text-input',
  title: 'Votre métier *',
  placeholder: 'Écrivez votre métier',
  isRequired: true,
  showLabel: true,
  maxLength: 50,
};

export const profileCompletionProfessionalInfoCoachFields: FormFieldInput<AnyCantFix>[] =
  [
    {
      id: 'companyName',
      name: 'companyName',
      component: 'select-creatable',
      title: "L'entreprise dans laquelle vous travaillez",
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
      title: 'Les secteurs où vous avez du réseau *',
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
        title: 'Secteur recherché',
        placeholder: 'Séléctionnez un secteur',
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
        title: 'Métier recherché',
        placeholder: 'Saisir un métier',
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
        placeholder: 'Séléctionnez un autre secteur',
        title: 'Autre secteur',
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
        placeholder: 'Saisir un métier',
        title: 'Autre métier',
        showLabel: true,
        maxLength: 50,
      },
    ],
  },
];

export const profileCompletionCvFields: FormFieldInput<AnyCantFix>[] = [
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
    maxChar: 80,
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
    maxItems: 10,
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
    maxChar: 50,
    maxItems: 10,
    options: [],
  },
];
