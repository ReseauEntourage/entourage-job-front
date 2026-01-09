import { FormSchema } from '@/src/features/forms/FormSchema';
import { loadNudgesOptions } from '@/src/features/forms/utils/loadOptions.utils';
import { UserRoles } from 'src/constants/users';

export const formOnboardingCandidateNudges: FormSchema<{
  nudgeIds: string[];
}> = {
  id: 'form-onboarding-candidate-nudges',
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
