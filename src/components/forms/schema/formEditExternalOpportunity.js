import { CONTRACTS, EXTERNAL_OFFERS_ORIGINS } from 'src/constants';
import { FORMATTED_DEPARTMENTS } from 'src/constants/departements';
import moment from 'moment';
import { findContractType } from 'src/utils';

export default {
  id: 'form-offer-external',
  fields: [
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
      placeholder: 'Sélectionnez le département',
      type: 'text',
      component: 'select',
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
      title: "Commentaire sur l'offre",
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
