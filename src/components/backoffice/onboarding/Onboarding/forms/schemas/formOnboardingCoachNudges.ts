import { Api } from '@/src/api';
import { createNudgeOption } from '@/src/constants/nudges';
import { FormSchema } from 'src/components/forms/FormSchema';
import { UserRoles } from 'src/constants/users';

const loadNudgesOptions = async (callback) => {
  try {
    const { data: nudges } = await Api.getAllNudges({
      search: '',
      limit: 50,
      offset: 0,
    });
    callback([
      ...nudges
        .map((n) => createNudgeOption(UserRoles.COACH, n))
        .filter((n) => n),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};

export const formOnboardingCoachNudges: FormSchema<{
  nudgeIds: string[];
}> = {
  id: 'form-onboarding-coach-nudges',
  fields: [
    {
      id: 'nudgeIds',
      name: 'nudgeIds',
      component: 'select-list-async',
      loadOptions: loadNudgesOptions,
      isMulti: true,
      showLabel: false,
      isRequired: true,
    },
  ],
};
