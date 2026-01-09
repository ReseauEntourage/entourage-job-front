import { UserRoles } from '@/src/constants/users';
import { FormSchema } from '@/src/features/forms/FormSchema';
import { loadNudgesOptions } from '@/src/features/forms/utils/loadOptions.utils';

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
