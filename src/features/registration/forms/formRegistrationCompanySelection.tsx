import { FilterConstant } from '@/src/constants/utils';
import {
  FormComponents,
  FormSchema,
  FormSchemaValidation,
} from '@/src/features/forms/FormSchema';
import { loadCompaniesOptions } from '@/src/features/forms/utils/loadOptions.utils';

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
        loadOptions: loadCompaniesOptions,
        title: 'Nom de votre entreprise *',
        placeholder: "Sélectionnez ou ajoutez le nom de l'entreprise",
        isMulti: false,
        showLabel: true,
        openMenuOnClick: true,
      },
    ],
  };
