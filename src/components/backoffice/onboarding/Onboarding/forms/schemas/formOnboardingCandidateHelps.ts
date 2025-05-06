import { FormSchema } from 'src/components/forms/FormSchema';
import { HelpValue, ParametresHelpCardContents } from 'src/constants/helps';
import { UserRoles } from 'src/constants/users';

export const formOnboardingCandidateHelps: FormSchema<{
  helpNeeds: HelpValue[];
}> = {
  id: 'form-onboarding-candidate-helps',
  fields: [
    {
      id: 'helpNeeds',
      name: 'helpNeeds',
      component: 'select-list',
      options: ParametresHelpCardContents[UserRoles.CANDIDATE],
      showLabel: false,
      isRequired: true,
      isMulti: true,
    },
  ],
};
