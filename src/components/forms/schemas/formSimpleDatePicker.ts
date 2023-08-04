import { FormSchema } from '../FormSchema';

export function renderSimpleDatePickerField(formId, title): FormSchema {
  return {
    id: formId,
    fields: [
      {
        id: 'datepicker',
        name: 'datepicker',
        component: 'datepicker',
        title,
        isRequired: true,
      },
    ],
  };
}
