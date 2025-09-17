import { loadNudgesOptions } from '@/src/components/forms/utils/loadOptions.utils';
import { UserRoles } from '@/src/constants/users';
import { FormSchema } from 'src/components/forms/FormSchema';

export const formReferingExpectations: FormSchema<{
  nudgeIds: string[];
}> = {
  id: 'form-refering-candidate-expectations',
  fields: [
    {
      id: 'nudgeIds',
      name: 'nudgeIds',
      component: 'select-list-async',
      loadOptions: (callback) =>
        loadNudgesOptions(UserRoles.CANDIDATE, callback),
      isMulti: true,
      showLabel: false,
      isRequired: true,
    },
  ],
};
