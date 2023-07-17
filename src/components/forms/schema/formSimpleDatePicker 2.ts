export function renderSimpleDatePickerField(title) {
  return {
    id: 'simple-date-picker',
    fields: [
      {
        id: 'datepicker',
        name: 'datepicker',
        component: 'datepicker-new',
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
