import { FormSchema } from '../FormSchema';
import { Api } from 'src/api';
import { UserRoles } from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';

export const formRecommendCandidate: FormSchema<{
  candidatesIds: FilterConstant<string>[];
}> = {
  id: 'form-recommend-candidate',
  fields: [
    {
      id: 'candidatesIds',
      name: 'candidatesIds',
      isMulti: true,
      title: "Renseignez le(s) candidat(s) à qui adresser l'offre*",
      component: 'select-async',
      loadOptions: (callback, inputValue) => {
        Api.getUsersSearch({
          params: {
            query: inputValue,
            role: UserRoles.CANDIDATE,
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
          .then(callback);
      },
      isRequired: true,
    },
  ],
};
