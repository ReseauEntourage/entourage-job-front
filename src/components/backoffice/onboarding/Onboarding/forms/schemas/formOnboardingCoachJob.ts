import { FormComponents, FormSchema } from 'src/components/forms/FormSchema';
import { BUSINESS_LINES, BusinessLineValue } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formOnboardingCoachJob: FormSchema<{
  currentJob: string;
  networkBusinessLines: FilterConstant<BusinessLineValue>[];
  linkedinUrl: string;
}> = {
  id: 'form-onboarding-coach-job',
  fields: [
    {
      id: 'currentJob',
      name: 'currentJob',
      component: 'text-input',
      title: 'Mon métier et mon expérience',
      showLabel: true,
    },
    {
      id: 'networkBusinessLines',
      name: 'networkBusinessLines',
      component: 'select',
      title: "Les secteurs dans lesquels j'ai du réseau*",
      options: BUSINESS_LINES,
      isMulti: true,
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'linkedinUrl',
      name: 'linkedinUrl',
      component: FormComponents.TEXT_INPUT,
      title:
        'Ajouter votre profil Linkedin pour que les membres puissent le découvrir !',
      placeholder: 'Ajouter le lien LinkedIn',
      showLabel: true,
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
