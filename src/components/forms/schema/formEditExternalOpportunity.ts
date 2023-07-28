import moment from 'moment';

import { Api } from 'src/api';
import {
  BUSINESS_LINES,
  CONTRACTS,
  EXTERNAL_OFFERS_ORIGINS,
  OFFER_STATUS,
} from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { findConstantFromValue } from 'src/utils';
import { FormSchema } from './FormSchema.types';

export const formEditExternalOpportunity: FormSchema = {
  id: 'form-offer-external',
  fields: [
    {
      id: 'candidateStatus',
      component: 'fieldgroup',
      fields: [
        {
          id: 'candidateId',
          name: 'candidateId',
          isMulti: false,
          title: 'Renseignez le candidat concerné*',
          component: 'select-async',
          hidden: true,
          disabled: true,
          loadOptions: (inputValue, callback) => {
            callback([]);
          },
        },
        {
          id: 'status',
          name: 'status',
          title: 'Statut',
          component: 'select-simple',
          options: OFFER_STATUS.slice(1),
        },
      ],
    },
    {
      id: 'title',
      name: 'title',
      component: 'text-input',
      title: "Titre de l'offre*",
    },
    {
      id: 'company',
      name: 'company',
      component: 'text-input',
      title: "Nom de l'entreprise*",
    },
    {
      id: 'contract',
      name: 'contract',
      component: 'select-simple',
      options: CONTRACTS,
      title: 'Type de contrat*',
      fieldsToReset: ['endOfContract'],
    },
    {
      id: 'startEndContract',
      component: 'fieldgroup',
      fields: [
        {
          id: 'startOfContract',
          name: 'startOfContract',
          title: 'Date de début de contrat',
          component: 'datepicker',
        },
        {
          id: 'endOfContract',
          name: 'endOfContract',
          title: 'Date de fin de contrat',
          component: 'datepicker',
          disable: (getValue) => {
            const contract = findConstantFromValue(
              getValue('contract'),
              CONTRACTS
            );
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
      id: 'businessLines',
      name: 'businessLines',
      title: 'Familles de métiers',
      component: 'select',
      isMulti: true,
      options: BUSINESS_LINES,
      hidden: true,
      disabled: true,
    },
    {
      id: 'department',
      name: 'department',
      title: 'Département*',
      component: 'select',
      options: DEPARTMENTS_FILTERS,
    },
    {
      id: 'link',
      name: 'link',
      component: 'text-input',
      title: "Lien de l'offre",
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: "Description de l'offre",
    },
    {
      id: 'externalOrigin',
      name: 'externalOrigin',
      component: 'select-simple',
      options: EXTERNAL_OFFERS_ORIGINS,
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
          Api.getUsersSearch({
            params: {
              query: inputValue,
              role: CANDIDATE_USER_ROLES,
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
  {
    fieldId: 'businessLines',
    props: [
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
