import { loadNudgesOptions } from '@/src/components/forms/utils/loadOptions.utils';
import { FormSchema } from 'src/components/forms/FormSchema';
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
