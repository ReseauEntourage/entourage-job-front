import { Path } from 'react-hook-form';
import { FormSchema, FormSchemaValidation } from '../FormSchema';
import { FilterConstant } from 'src/constants/utils';

export function renderSimpleSelectField<
  V extends FormSchemaValidation,
  O extends FilterConstant[] = FilterConstant[],
>(formId: string, title: string, options: O, inputId: Path<V>): FormSchema<V> {
  if (title) {
    options.unshift({
      value: '',
      label: title,
    });
  }
  return {
    id: formId,
    fields: [
      {
        id: inputId,
        name: inputId,
        title,
        component: 'select-simple',
        options,
        isRequired: true,
      },
    ],
  };
}
