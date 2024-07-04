import { FormSchema } from '../FormSchema';
import { BUSINESS_LINES, BusinessLineValue } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formEditCoachProfessionalInformation: FormSchema<{
  currentJob: string;
  networkBusinessLines: FilterConstant<BusinessLineValue>[];
  linkedinUrl: string;
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
      title: "Les secteurs dans lesquels j'ai du réseau *",
      options: BUSINESS_LINES,
      isMulti: true,
      isRequired: true,
    },
    {
      id: 'linkedinLabel',
      name: 'linkedinLabel',
      title: 'Partagez votre profil LinkedIn',
      component: 'heading',
    },
    {
      id: 'linkedinUrl',
      name: 'linkedinUrl',
      component: 'text-input',
      title: 'Ajouter le lien LinkedIn',
      rules: [
        {
          method: (fieldValue) => {
            return (
              !fieldValue ||
              (!!fieldValue && fieldValue.includes('linkedin.com'))
            );
          },
          message: 'Doit être un lien Linkedin valide',
        },
      ],
    },
  ],
};
