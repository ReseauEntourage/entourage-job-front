import { FormSchema } from 'src/components/forms/FormSchema';
import { HelpValue, ParametresHelpCardContents } from 'src/constants/helps';
import { USER_ROLES } from 'src/constants/users';

export const formRegistrationCandidateExpectations: FormSchema<{
  expectations: HelpValue[];
}> = {
  id: 'form-registration-candidate-expectations',
  fields: [
    {
      id: 'expectations',
      name: 'expectations',
      component: 'select-list',
      options: ParametresHelpCardContents[USER_ROLES.CANDIDATE],
      showLabel: false,
      isRequired: true,
      isMulti: true,
    },
  ],
};
