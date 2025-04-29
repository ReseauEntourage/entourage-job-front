import { HelpValue, ParametresHelpCardContents } from '@/src/constants/nudges';
import { FormSchema } from '../FormSchema';
import { NormalUserRole } from 'src/constants/users';

export function getFormEditHelps(role: NormalUserRole): FormSchema<{
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
