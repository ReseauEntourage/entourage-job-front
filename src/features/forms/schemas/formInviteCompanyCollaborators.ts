import { isEmail } from 'validator';
import { FilterConstant } from '@/src/constants/utils';
import { FormComponents, FormSchema } from '../FormSchema';

export const formInviteCompanyCollaborators: FormSchema<{
  emails: FilterConstant<string>[];
}> = {
  id: 'form-invite-company-collaborators',
  fields: [
    {
      id: 'emails',
      name: 'emails',
      component: FormComponents.SELECT_CREATABLE,
      title: 'Emails',
      placeholder: 'Entrez les emails des collaborateurs à inviter',
      maxItems: 100,
      isMulti: true,
      rules: [
        {
          method: (fieldValues) => {
            return fieldValues.every((fieldValue) => isEmail(fieldValue.value));
          },
          message: "L'une des adresses e-mail saisies est invalide",
        },
      ],
    },
  ],
};
