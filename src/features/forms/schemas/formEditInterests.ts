import { FilterConstant } from '@/src/constants/utils';
import { FormSchema } from '../FormSchema';

export const formEditInterests: FormSchema<{
  interests: FilterConstant<string>[];
}> = {
  id: 'form-interests',
  fields: [
    {
      id: 'interests',
      name: 'interests',
      component: 'select-creatable',
      title: "Centres d'intérêt",
      maxChar: 50,
      maxItems: 10,
      isMulti: true,
    },
  ],
};
