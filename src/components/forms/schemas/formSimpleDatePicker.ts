import { FormSchema } from '../FormSchema/FormSchema.types';

export function renderSimpleDatePickerField(formId, title): FormSchema {
  return {
    id: formId,
    fields: [
      {
        id: 'datepicker',
        name: 'datepicker',
        component: 'datepicker',
        title,
      },
    ],
    rules: [
      {
        field: 'datepicker',
        method: 'isEmpty',
        args: [
          {
            ignore_whitespace: true,
          },
        ],
        validWhen: false,
        message: 'Obligatoire',
      },
    ],
  };
}
