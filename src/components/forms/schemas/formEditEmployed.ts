import moment from 'moment';
import { isAfter } from 'validator';
import { FormSchema } from '../FormSchema';
import { Contract, CONTRACTS } from 'src/constants';
import { findConstantFromValue } from 'src/utils';

export const formEditEmployed: FormSchema<{
  contract: Contract;
  endOfContract: string;
}> = {
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
        const contract = findConstantFromValue(getValue('contract'), CONTRACTS);
        return !contract || !contract.end;
      },
      rules: [
        {
          method: (fieldValue) =>
            !fieldValue || isAfter(fieldValue, moment().format('YYYY-MM-DD')),
          message: "Date antérieure à aujourd'hui",
        },
      ],
    },
  ],
};
