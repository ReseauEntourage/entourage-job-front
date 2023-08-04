import moment from 'moment';
import validator from 'validator';
import { FormSchema } from '../FormSchema';
import { CONTRACTS } from 'src/constants';
import { findConstantFromValue } from 'src/utils';

export const formEditEmployed: FormSchema = {
  id: 'form-edit-employed',
  fields: [
    {
      id: 'contract',
      title: 'Contrat*',
      name: 'contract',
      component: 'select-simple',
      options: CONTRACTS,
      fieldsToReset: ['endOfContract'],
      isRequired: true,
    },
    {
      id: 'endOfContract',
      title: 'Date de fin de contrat',
      name: 'endOfContract',
      component: 'datepicker',
      min: moment().format('YYYY-MM-DD'),
      disable: (getValue) => {
        const contract = findConstantFromValue(
          getValue('contract') as string,
          CONTRACTS
        );
        return !contract || !contract.end;
      },
      rules: [
        {
          method: (fieldValue) =>
            validator.isAfter(fieldValue, moment().format('YYYY-MM-DD')),
          message: "Date antérieure à aujourd'hui",
        },
      ],
    },
  ],
};
