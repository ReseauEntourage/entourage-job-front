import { Api } from '@/src/api';
import { FilterConstant } from '@/src/constants/utils';
import {
  FormComponents,
  FormSchema,
  FormSchemaValidation,
} from 'src/features/forms/FormSchema';

interface FormRegistrationCompanySelectionSchema extends FormSchemaValidation {
  companyName: FilterConstant<string>;
}

export const formRegistrationCompanySelection: FormSchema<FormRegistrationCompanySelectionSchema> =
  {
    id: 'form-registration-company-selection',
    fields: [
      {
        id: 'companyName',
        name: 'companyName',
        component: FormComponents.SELECT_CREATABLE,
        isRequired: true,
        loadOptions: async (callback, inputValue) => {
          try {
            const { data: companies } = await Api.getAllCompanies({
              search: inputValue,
              limit: 50,
              offset: 0,
              departments: [],
              businessSectorIds: [],
              onlyWithReferent: false,
            });
            callback([
              ...companies.map((company) => {
                return {
                  value: company.name,
                  label: company.name,
                  key: company.id,
                };
              }),
            ]);
          } catch (error) {
            console.error(error);
            callback([]);
          }
        },
        title: 'Nom de votre entreprise *',
        placeholder: "Sélectionnez ou ajoutez le nom de l'entreprise",
        isMulti: false,
        showLabel: true,
        openMenuOnClick: true,
      },
    ],
  };
