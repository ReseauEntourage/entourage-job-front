import { FormSchema } from '../FormSchema';
import { FilterConstant } from 'src/constants/utils';

export const formEditPassions: FormSchema<{
  passions: FilterConstant<string>[];
}> = {
  id: 'form-passions',
  fields: [
    {
      id: 'passions',
      name: 'passions',
      component: 'select-creatable',
      title: 'Passions',
      maxChar: 30,
      maxItems: 6,
      isMulti: true,
    },
  ],
};
