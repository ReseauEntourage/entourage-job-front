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
      title: 'Compétences',
      maxChar: 50,
      maxItems: 50,
      isMulti: true,
    },
  ],
};
