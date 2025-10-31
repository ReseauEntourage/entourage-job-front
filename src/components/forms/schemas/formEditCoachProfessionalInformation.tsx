import {
  FormComponents,
  FormSchema,
  FormSchemaValidation,
} from '../FormSchema';
import { loadBusinessSectorsOptions } from '../utils/loadOptions.utils';
import { Api } from 'src/api';
import { FilterConstant } from 'src/constants/utils';

interface FormEditCoachProfessionalInformationFormSchema
  extends FormSchemaValidation {
  currentJob: string;
  companyName: FilterConstant<string>;
  businessSectorIds: FilterConstant<string>[];
}

export const formEditCoachProfessionalInformation: FormSchema<FormEditCoachProfessionalInformationFormSchema> =
  {
    id: 'form-coach-professional-information',
    fields: [
      {
        id: 'currentJob',
        name: 'currentJob',
        component: 'text-input',
        title: 'Mon métier',
      },
      {
        id: 'companyName',
        name: 'companyName',
        component: FormComponents.SELECT_CREATABLE,
        title: 'Mon entreprise',
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
                  key: u.name,
                };
              })
            );
          } catch (error) {
            console.error(error);
            callback([]);
          }
        },
        placeholder: 'Mon entreprise',
        isMulti: false,
        openMenuOnClick: true,
      },
      {
        id: 'businessSectorIds',
        name: 'businessSectorIds',
        component: 'select-async',
        isRequired: true,
        loadOptions: loadBusinessSectorsOptions,
        placeholder: "Les secteurs dans lesquels j'ai du réseau*",
        isMulti: true,
        showLabel: true,
      },
    ],
  };
