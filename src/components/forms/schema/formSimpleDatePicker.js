export default function renderSimpleDatePickerField(placeholder) {
  return {
    id: 'simple-date-picker',
    fields: [
      {
        id: 'datepicker',
        name: 'datePicker',
        // type: 'password',
        component: 'datepicker',
        placeholder,
        // title: 'Ancien mot de passe*',
      },
    ],
  };
}
