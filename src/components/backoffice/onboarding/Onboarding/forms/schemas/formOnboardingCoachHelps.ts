import { FormSchema } from 'src/components/forms/FormSchema';
import { HelpValue, ParametresHelpCardContents } from 'src/constants/helps';
import { USER_ROLES } from 'src/constants/users';

export const formOnboardingCoachHelps: FormSchema<{
  helpOffers: HelpValue[];
}> = {
  id: 'form-onboarding-candidate-helps',
  fields: [
    {
      id: 'helpOffers',
      name: 'helpOffers',
      component: 'select-list',
      options: ParametresHelpCardContents[USER_ROLES.COACH],
      showLabel: false,
      isRequired: true,
      isMulti: true,
    },
  ],
};
