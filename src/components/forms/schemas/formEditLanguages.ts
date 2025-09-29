import { FilterConstant } from '@/src/constants/utils';
import { FormSchema } from '../FormSchema';
import { loadLanguagesOptions } from '../utils/loadOptions.utils';

export const formEditLanguages: FormSchema<{
  languages: FilterConstant<string>[];
}> = {
  id: 'form-languages',
  fields: [
    {
      id: 'languages',
      name: 'languages',
      component: 'select-async',
      isRequired: false,
      loadOptions: loadLanguagesOptions,
      placeholder: 'Langues',
      isMulti: true,
      showLabel: true,
    },
  ],
};
