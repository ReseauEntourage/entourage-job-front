import {
  FormComponents,
  FormSchema,
  FormSchemaValidation,
} from '../FormSchema';
import {
  loadBusinessSectorsOptions,
  loadCompaniesOptions,
} from '../utils/loadOptions.utils';
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
        loadOptions: loadCompaniesOptions,
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
