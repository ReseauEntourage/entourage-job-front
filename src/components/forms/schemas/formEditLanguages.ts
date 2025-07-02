import { Api } from '@/src/api';
import { FilterConstant } from '@/src/constants/utils';
import { FormSchema } from '../FormSchema';

const loadLanguagesOptions = async (callback, inputValue) => {
  try {
    const { data: businessSectors } = await Api.getAllLanguages({
      search: inputValue,
      limit: 50,
      offset: 0,
    });
    callback([
      ...businessSectors.map((u) => {
        return {
          value: u.id,
          label: u.name,
        };
      }),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};

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
