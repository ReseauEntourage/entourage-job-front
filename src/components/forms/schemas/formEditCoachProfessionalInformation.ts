import { FormSchema } from '../FormSchema';
import { loadBusinessSectorsOptions } from '../utils/loadOptions.utils';
import { FilterConstant } from 'src/constants/utils';

export const formEditCoachProfessionalInformation: FormSchema<{
  currentJob: string;
  businessSectorIds: FilterConstant<string>[];
}> = {
  id: 'form-coach-professional-information',
  fields: [
    {
      id: 'currentJob',
      name: 'currentJob',
      component: 'text-input',
      title: 'Mon métier',
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
