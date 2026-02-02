import { UserRoles } from '@/src/constants/users';
import { loadNudgesOptions } from '../../forms/utils/loadOptions.utils';
import { FormSchema } from 'src/features/forms/FormSchema';

export const formRegistrationCandidateExpectations: FormSchema<{
  nudgeIds: string[];
}> = {
  id: 'form-registration-candidate-expectations',
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
