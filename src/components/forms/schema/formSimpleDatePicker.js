export default function renderSimpleDatePickerField(title) {
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
      {
        field: 'birthdate',
        method: (value) => {
          const maxBirtdate = new Date('1900-01-01');
          const realBirthdate = new Date(value);
          return maxBirtdate < realBirthdate;
        },
        validWhen: true,
        message: 'Veuillez entrer une date valide.',
      },
    ],
  };
}
