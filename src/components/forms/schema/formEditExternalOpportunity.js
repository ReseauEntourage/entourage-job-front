import moment from 'moment';

import { CONTRACTS, EXTERNAL_OFFERS_ORIGINS, USER_ROLES } from 'src/constants';
import { FORMATTED_DEPARTMENTS } from 'src/constants/departements';
import Api from 'src/Axios';
import { findContractType } from 'src/utils';

export default {
  id: 'form-offer-external',
  fields: [
    {
      id: 'candidateId',
      name: 'candidateId',
      isMulti: false,
      title: 'Renseignez le candidat concerné*',
      placeholder: 'Tapez un candidat',
      component: 'select-request-async',
      hidden: true,
      disabled: true,
      loadOptions: (inputValue, callback) => {
        callback([]);
      },
    },
    {
      id: 'title',
      name: 'title',
      component: 'input',
      type: 'text',
      title: "Titre de l'offre*",
    },
    {
      id: 'company',
      name: 'company',
      component: 'input',
      type: 'text',
      title: "Nom de l'entreprise*",
    },
    {
      id: 'contract',
      name: 'contract',
      component: 'select',
      options: [{ value: -1, label: 'Choisissez un contrat' }, ...CONTRACTS],
      title: 'Type de contrat*',
      fieldsToReset: ['endOfContract'],
    },
    {
      id: 'startEndContract',
      component: 'fieldgroup',
      childWidths: ['expand', 'expand', '1-4@m'],
      fields: [
        {
          id: 'startOfContract',
          name: 'startOfContract',
          title: 'Date de début de contrat',
          component: 'datepicker',
          min: moment().format('YYYY-MM-DD'),
        },
        {
          id: 'endOfContract',
          name: 'endOfContract',
          title: 'Date de fin de contrat',
          component: 'datepicker',
          min: moment().format('YYYY-MM-DD'),
          disable: (getValue) => {
            const contract = findContractType(getValue('contract'));
            return !contract || !contract.end;
          },
        },
        {
          id: 'isPartTime',
          name: 'isPartTime',
          component: 'checkbox',
          title: 'Temps partiel',
        },
      ],
    },
    {
      id: 'department',
      name: 'department',
      title: 'Département*',
      component: 'select-request',
      options: FORMATTED_DEPARTMENTS,
    },
    {
      id: 'link',
      name: 'link',
      component: 'input',
      type: 'text',
      title: "Lien de l'offre",
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      type: 'text',
      title: "Description de l'offre",
    },
    {
      id: 'externalOrigin',
      name: 'externalOrigin',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez une origine' },
        ...EXTERNAL_OFFERS_ORIGINS,
      ],
      title: 'Offre venant de',
    },
  ],
  rules: [
    {
      field: 'candidateId',
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
      field: 'title',
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
      field: 'company',
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
      field: 'department',
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
      field: 'contract',
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
      field: 'endOfContract',
      method: (fieldValue, state) => {
        return (
          !!fieldValue &&
          !!state.startOfContract &&
          moment(fieldValue, 'YYYY-MM-DD').isBefore(
            moment(state.startOfContract, 'YYYY-MM-DD')
          )
        );
      },
      args: [],
      validWhen: false,
      message: 'Date antérieure à la date de début',
    },
  ],
};

export const adminMutations = [
  {
    fieldId: 'candidateId',
    props: [
      {
        propName: 'loadOptions',
        value: (inputValue, callback) => {
          Api.get('/user/search', {
            params: {
              query: inputValue,
              role: USER_ROLES.CANDIDAT,
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
      },
      {
        propName: 'disabled',
        value: false,
      },
      {
        propName: 'hidden',
        value: false,
      },
    ],
  },
];
