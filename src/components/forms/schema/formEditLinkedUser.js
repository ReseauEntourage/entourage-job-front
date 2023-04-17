import { Api } from 'src/api/index.ts';
import { USER_ROLES } from 'src/constants';

export default {
  id: 'form-edit-linked-user',
  fields: [
    {
      id: 'role',
      title: 'Role*',
      name: 'role',
      component: 'select',
      disabled: true,
      hidden: true,
      options: [
        { value: -1, label: 'Choisissez un role' },
        { value: USER_ROLES.CANDIDATE, label: USER_ROLES.CANDIDATE },
        { value: USER_ROLES.COACH, label: USER_ROLES.COACH },
        { value: USER_ROLES.ADMIN, label: USER_ROLES.ADMIN },
      ],
    },
    {
      id: 'linkedUser',
      name: 'linkedUser',
      component: 'select-request-async',
      cacheOptions: false,
      openMenuOnClick: false,
      loadOptions: (inputValue, callback, getValue) => {
        if (inputValue.length > 0) {
          const role = getValue('role');
          Api.getUsersSearch({
            params: {
              query: inputValue,
              role, // un certain role
              // TODO add organizationId
            },
          })
            .then(({ data }) => {
              return data.map((u) => {
                return {
                  value: u.id,
                  label: `${u.firstName} ${u.lastName}`,
                };
              });
            })
            .then((m) => {
              return m;
            })
            .then(callback);
        } else {
          callback([]);
        }
      },
      placeholder: "Tapez le nom d'un utilisateur",
      title: 'Coach ou candidat lié',
    },
  ],
  rules: [],
};
