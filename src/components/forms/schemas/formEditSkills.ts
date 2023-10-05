import { FormSchema } from '../FormSchema';
import { FilterConstant } from 'src/constants/utils';

export const formEditSkills: FormSchema<{
  skills: FilterConstant<string>[];
}> = {
  id: 'form-skills',
  fields: [
    {
      id: 'skills',
      name: 'skills',
      component: 'select-creatable',
      title: 'Atouts',
      maxChar: 20,
      maxItems: 6,
      isMulti: true,
    },
  ],
};
