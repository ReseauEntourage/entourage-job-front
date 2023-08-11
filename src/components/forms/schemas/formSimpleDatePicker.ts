import { Path } from 'react-hook-form';
import { FormSchema, FormSchemaValidation } from '../FormSchema';

export function renderSimpleDatePickerField<V extends FormSchemaValidation>(
  formId: string,
  title: string,
  inputId: Path<V>
): FormSchema<V> {
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
