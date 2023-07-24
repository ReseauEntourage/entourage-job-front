import moment from 'moment';
import { CONTRACTS } from 'src/constants';
import { findConstantFromValue } from 'src/utils';

export const formEditEmployed = {
  id: 'form-edit-employed',
  fields: [
    {
      id: 'contract',
      title: 'Contrat*',
      name: 'contract',
      component: 'select-simple',
      options: [{ value: -1, label: 'Choisissez un contrat' }, ...CONTRACTS],
      fieldsToReset: ['endOfContract'],
    },
    {
      id: 'endOfContract',
      title: 'Date de fin de contrat',
      name: 'endOfContract',
      component: 'datepicker',
      min: moment().format('YYYY-MM-DD'),
      disable: (getValue) => {
        const contract = findConstantFromValue(getValue('contract'), CONTRACTS);
        return !contract || !contract.end;
      },
    },
  ],
  rules: [
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
      method: 'isBefore',
      args: [moment().format('YYYY-MM-DD')],
      validWhen: false,
      message: "Date antérieure à aujourd'hui",
    },
  ],
};
