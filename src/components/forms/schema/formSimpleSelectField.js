export default function renderSimpleSelectField(placeholder, options) {
  if (placeholder) {
    options.unshift({
      value: '',
      label: placeholder,
      disabled: true,
    });
  }
  console.log(options);
  return {
    id: 'simple-select',
    rules: [],
    fields: [
      {
        id: 'select',
        name: 'select',
        // type: 'password',
        component: 'select',
        placeholder,
        options,
        // title: 'Ancien mot de passe*',
      },
    ],
  };
}
