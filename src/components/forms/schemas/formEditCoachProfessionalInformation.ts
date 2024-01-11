import { FormSchema } from '../FormSchema';
import { BUSINESS_LINES, BusinessLineValue } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formEditCoachProfessionalInformation: FormSchema<{
  currentJob: string;
  networkBusinessLines: FilterConstant<BusinessLineValue>[];
}> = {
  id: 'form-coach-professional-information',
  fields: [
    {
      id: 'currentJob',
      name: 'currentJob',
      component: 'text-input',
      title: 'Mon métier',
    },
    {
      id: 'networkBusinessLines',
      name: 'networkBusinessLines',
      component: 'select',
      title: "Les secteurs dans lesquels j'ai du réseau",
      options: BUSINESS_LINES,
      isMulti: true,
    },
  ],
};
