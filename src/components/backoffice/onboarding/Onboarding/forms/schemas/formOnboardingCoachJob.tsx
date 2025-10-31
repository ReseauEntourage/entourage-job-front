import { loadBusinessSectorsOptions } from '@/src/components/forms/utils/loadOptions.utils';
import { Api } from 'src/api';
import {
  FormComponents,
  FormSchema,
  FormSchemaValidation,
} from 'src/components/forms/FormSchema';
import { FilterConstant } from 'src/constants/utils';

export interface formOnboardingCoachJobSchema extends FormSchemaValidation {
  currentJob: string;
  businessSectorIds: FilterConstant<string>[];
  linkedinUrl: string;
  companyName: FilterConstant<string>;
}

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
        id: 'companyName',
        name: 'companyName',
        component: FormComponents.SELECT_CREATABLE,
        title: 'Mon entreprise',
        placeholder: 'Sélectionnez ou ajoutez le nom de votre entreprise',
        loadOptions: async (callback, inputValue) => {
          try {
            const { data: companies } = await Api.getAllCompanies({
              search: inputValue,
              limit: 50,
              offset: 0,
              departments: [],
              businessSectorIds: [],
            });
            callback(
              companies.map((u) => {
                return {
                  value: u.name,
                  label: u.name,
                  key: u.id,
                };
              })
            );
          } catch (error) {
            console.error(error);
            callback([]);
          }
        },
        isMulti: false,
        isRequired: false,
        showLabel: true,
        openMenuOnClick: true,
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
