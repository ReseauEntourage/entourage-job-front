import React from 'react';
import { loadBusinessSectorsOptions } from '@/src/components/forms/utils/loadOptions.utils';
import { LucidIcon } from '@/src/components/utils';
import { Api } from 'src/api';
import {
  FormComponents,
  FormSchema,
  FormSchemaValidation,
  GetValueType,
} from 'src/components/forms/FormSchema';
import { FilterConstant } from 'src/constants/utils';

export const CREATE_NEW_COMPANY_VALUE = 'createNewCompany';

const CREATE_NEW_COMPANY_OPTION = {
  value: CREATE_NEW_COMPANY_VALUE,
  label: (
    <>
      <LucidIcon name="Plus" />
      Ajouter une nouvelle entreprise
    </>
  ),
};

export interface formOnboardingCoachJobSchema extends FormSchemaValidation {
  currentJob: string;
  businessSectorIds: FilterConstant<string>[];
  linkedinUrl: string;
  companyId: FilterConstant<string>;
  companyName: string;
}

const hideCompanyNameField = (
  getValue: GetValueType<formOnboardingCoachJobSchema>
) => {
  const companyId = getValue('companyId')?.value;
  return companyId !== CREATE_NEW_COMPANY_VALUE;
};

export const formOnboardingCoachJob: FormSchema<formOnboardingCoachJobSchema> =
  {
    id: 'form-onboarding-coach-job',
    fields: [
      {
        id: 'currentJob',
        name: 'currentJob',
        component: 'text-input',
        title: 'Mon métier',
        placeholder: 'Ecrivez votre métier',
        showLabel: true,
      },
      {
        id: 'companyId',
        name: 'companyId',
        component: 'select-async',
        title: 'Mon entreprise',
        placeholder: 'Séléctionnez dans la liste',
        loadOptions: async (callback, inputValue) => {
          try {
            const { data: companies } = await Api.getAllCompanies({
              search: inputValue,
              limit: 50,
              offset: 0,
              departments: [],
              businessSectorIds: [],
            });
            callback([
              ...companies.map((u) => {
                return {
                  value: u.id,
                  label: u.name,
                  key: u.id,
                };
              }),
              CREATE_NEW_COMPANY_OPTION,
            ]);
          } catch (error) {
            console.error(error);
            callback([]);
          }
        },
        isMulti: false,
        isRequired: false,
        showLabel: true,
      },
      {
        id: 'companyName',
        name: 'companyName',
        component: 'text-input',
        title: 'Nom de votre entreprise *',
        showLabel: true,
        isRequired: true,
        hide: hideCompanyNameField,
      },
      {
        id: 'businessSectorIds',
        name: 'businessSectorIds',
        component: 'select-async',
        loadOptions: loadBusinessSectorsOptions,
        title: "Les secteurs dans lesquels j'ai du réseau*",
        placeholder: 'Sélectionnez un ou plusieurs secteurs dans la liste',
        isMulti: true,
        showLabel: true,
      },
      {
        id: 'linkedinUrl',
        name: 'linkedinUrl',
        component: FormComponents.TEXT_INPUT,
        title:
          'Votre profil LinkedIn - pour que les membres le découvrent et vous y soutiennent aussi',
        placeholder: 'Ajoutez le lien LinkedIn',
        showLabel: true,
        rules: [
          {
            method: (fieldValue) => {
              return (
                !fieldValue ||
                (!!fieldValue && fieldValue.includes('linkedin.com'))
              );
            },
            message: 'Doit être un lien Linkedin valide',
          },
        ],
      },
    ],
  };
