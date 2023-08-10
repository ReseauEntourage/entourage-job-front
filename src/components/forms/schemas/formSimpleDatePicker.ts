import { FormSchema } from '../FormSchema';

export function renderSimpleDatePickerField<I extends string>(
  formId: string,
  title: string,
  inputId: I
): FormSchema<{ [K in I]: string }> {
  return {
    id: formId,
    fields: [
      {
        id: inputId,
        name: inputId,
        component: 'datepicker',
        title,
        isRequired: true,
      },
    ],
  };
}
