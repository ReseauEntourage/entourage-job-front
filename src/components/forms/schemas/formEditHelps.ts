import { FormSchema } from '../FormSchema';
import { HelpValue, ParametresHelpCardContents } from 'src/constants/helps';
import { USER_ROLES } from 'src/constants/users';

export function getFormEditHelps(
  role: typeof USER_ROLES.CANDIDATE | typeof USER_ROLES.COACH
): FormSchema<{
  helps: HelpValue[];
}> {
  return {
    id: 'form-edit-helps',
    fields: [
      {
        id: 'helps',
        name: 'helps',
        component: 'select-list',
        isMulti: true,
        options: ParametresHelpCardContents[role],
      },
    ],
  };
}
