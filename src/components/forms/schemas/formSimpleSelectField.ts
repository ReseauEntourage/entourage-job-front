import { FormSchema } from '../FormSchema';

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
