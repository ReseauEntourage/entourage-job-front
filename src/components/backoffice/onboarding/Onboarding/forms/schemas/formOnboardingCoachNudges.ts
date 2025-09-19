import { loadNudgesOptions } from '@/src/components/forms/utils/loadOptions.utils';
import { FormSchema } from 'src/components/forms/FormSchema';
import { UserRoles } from 'src/constants/users';

export const formOnboardingCoachNudges: FormSchema<{
  nudgeIds: string[];
}> = {
  id: 'form-onboarding-coach-nudges',
  fields: [
    {
      id: 'nudgeIds',
      name: 'nudgeIds',
      component: 'select-list-async',
      loadOptions: (callback) => loadNudgesOptions(UserRoles.COACH, callback),
      isMulti: true,
      showLabel: false,
      isRequired: true,
    },
  ],
};
