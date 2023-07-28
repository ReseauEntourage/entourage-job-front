export const formDeleteUser = {
  id: 'form-delete-user',
  fields: [
    {
      id: 'confirmation',
      name: 'confirmation',
      component: 'text-input',
      title:
        'Tapez le mot "SUPPRIMER" pour confirmer la suppression de l\'utilisateur*',
      placeholder: 'Tapez le mot "SUPPRIMER"',
      autocomplete: 'off',
    },
  ],
  rules: [
    {
      field: 'confirmation',
      method: 'equals',
      args: ['SUPPRIMER'],
      validWhen: true,
      message: 'Obligatoire',
    },
  ],
};
