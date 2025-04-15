import { FormSchema } from '../FormSchema';
import { HelpValue, ParametresHelpCardContents } from 'src/constants/helps';
import { NormalUserRoles } from 'src/constants/users';

export function getFormEditHelps(role: NormalUserRoles): FormSchema<{
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
        isRequired: true,
      },
    ],
  };
}
