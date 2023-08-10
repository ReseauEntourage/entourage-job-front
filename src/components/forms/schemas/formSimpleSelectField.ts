import { FormSchema } from '../FormSchema';
import { FilterConstant } from 'src/constants';

export function renderSimpleSelectField<
  O extends FilterConstant<string>[],
  I extends string
>(
  formId: string,
  title: string,
  options: O,
  inputId: I
): FormSchema<{
  [K in I]: O[K]['value'];
}> {
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
        title: inputId,
        component: 'select-simple',
        options,
      },
    ],
  };
}
