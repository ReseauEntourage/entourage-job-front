import { FormComponents, FormSchema } from 'src/components/forms/FormSchema';
import { BUSINESS_SECTORS, BusinessSectorValue } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formOnboardingCoachJob: FormSchema<{
  currentJob: string;
  businessSectors: FilterConstant<BusinessSectorValue>[];
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
      id: 'businessSectors',
      name: 'businessSectors',
      component: 'select',
      title: "Les secteurs dans lesquels j'ai du réseau*",
      options: BUSINESS_SECTORS,
      isMulti: true,
      showLabel: true,
    },
    {
      id: 'linkedinUrl',
      name: 'linkedinUrl',
      component: FormComponents.TEXT_INPUT,
      title:
        'Ajoutez votre profil LinkedIn pour que les membres le découvrent et vous y soutiennent aussi',
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
