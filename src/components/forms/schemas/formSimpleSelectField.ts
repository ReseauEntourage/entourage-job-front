import { FormSchema } from '../FormSchema/FormSchema.types';

export function renderSimpleSelectField(
  formId,
  title,
  options,
  inputId
): FormSchema {
  if (title) {
    options.unshift({
      value: '',
      label: title,
      disabled: true,
    });
  }
  return {
    id: formId,
    rules: [],
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
