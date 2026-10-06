import { FormSchema } from '../FormSchema';

// Same limits as the API DTO
export const HELP_GROUP_NAME_MAX_LENGTH = 80;
export const HELP_GROUP_DESCRIPTION_MAX_LENGTH = 500;

const notBlankRule = {
  method: (fieldValue: string) => !!fieldValue && fieldValue.trim().length > 0,
  message: 'Obligatoire',
};

export const formHelpGroup: FormSchema<{
  name: string;
  description: string;
}> = {
  id: 'form-help-group',
  fields: [
    {
      id: 'name',
      name: 'name',
      component: 'text-input',
      type: 'text',
      title: 'Nom du groupe *',
      showLabel: true,
      isRequired: true,
      maxLength: HELP_GROUP_NAME_MAX_LENGTH,
      rules: [notBlankRule],
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Description *',
      showLabel: true,
      isRequired: true,
      maxLength: HELP_GROUP_DESCRIPTION_MAX_LENGTH,
      rules: [notBlankRule],
    },
  ],
};
