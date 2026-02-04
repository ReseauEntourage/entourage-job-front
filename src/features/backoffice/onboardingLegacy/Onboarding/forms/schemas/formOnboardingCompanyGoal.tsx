import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { SelectListType } from '@/src/components/ui/Inputs/SelectList';
import { SelectTitleIconDescriptionLabel } from '@/src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectTitleIconDescriptionLabel/SelectTitleIconDescriptionLabel';
import { CompanyGoal } from '@/src/constants/company';
import { FormSchema } from '@/src/features/forms/FormSchema';

const flowOptions: (SelectListType<CompanyGoal> & {
  icon: React.ReactNode;
  description: string;
})[] = [
  {
    value: CompanyGoal.SENSIBILIZE,
    label: 'Je souhaite sensibiliser et engager mes collaborateurs',
    icon: <SvgIcon name="IlluPoigneeDeMain" width={50} height={50} />,
    description:
      'Je souhaite engager mes collaborateurs en tant que coach et les faire participer à des teambuilding solidaires',
  },
  {
    value: CompanyGoal.RECRUIT,
    label: 'Je souhaite recruter des candidats',
    icon: <SvgIcon name="IlluCV" width={50} height={50} />,
    description:
      'Trouver des candidats et recevoir des alertes par mail en fonction de mes besoins de recrutement',
  },
];

export const formOnboardingCompanyGoal: FormSchema<{
  goal: CompanyGoal[];
}> = {
  id: 'form-onboarding-company-expectations',
  fields: [
    {
      id: 'goal',
      name: 'goal',
      component: 'select-list',
      options: flowOptions.map((option) => ({
        value: option.value,
        label: (
          <SelectTitleIconDescriptionLabel
            title={option.label}
            icon={option.icon}
            description={option.description}
          />
        ),
      })),
      showLabel: false,
      isRequired: true,
      isMulti: true,
    },
  ],
};
