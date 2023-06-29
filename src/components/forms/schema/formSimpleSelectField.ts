export function renderSimpleSelectField(placeholder, options, id) {
  if (placeholder) {
    options.unshift({
      value: '',
      label: placeholder,
      disabled: true,
    });
  }
  return {
    id: 'simple-select',
    rules: [],
    fields: [
      {
        id,
        name: id,
        // type: 'password',
        component: 'select',
        placeholder,
        options,
        // title: 'Ancien mot de passe*',
      },
    ],
  };
}
