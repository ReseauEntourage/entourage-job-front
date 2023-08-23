import { FormSchema } from '../FormSchema';
import { FilterConstant } from 'src/constants/utils';

export const formEditExperience: FormSchema<{
  description: string;
  skills: FilterConstant<string>[];
}> = {
  id: 'form-experience',
  fields: [
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Description',
      maxLength: 2000,
    },
    {
      id: 'skills',
      name: 'skills',
      title: 'Compétences',
      component: 'select-creatable',
      isMulti: true,
    },
  ],
};
