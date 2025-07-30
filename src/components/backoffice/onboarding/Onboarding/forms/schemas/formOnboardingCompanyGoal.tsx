import React from 'react';
import { CompanyGoal } from '@/src/api/types';
import { IlluCV, IlluPoigneeDeMain } from 'assets/icons/icons';
import { FormSchema } from 'src/components/forms/FormSchema';
import { SelectListType } from 'src/components/utils/Inputs/SelectList/SelectList.types';

const flowOptions: SelectListType<CompanyGoal>[] = [
  {
    value: CompanyGoal.SENSIBILIZE,
    label: 'Je souhaite sensibiliser et engager mes collaborateurs',
    icon: <IlluPoigneeDeMain width={50} height={50} />,
    description:
      'Je souhaite engager mes collaborateurs en tant que coach et les faire participer à des teambuilding solidaires',
  },
  {
    value: CompanyGoal.RECRUIT,
    label: 'Je souhaite recruter des candidats',
    icon: <IlluCV width={50} height={50} />,
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
      options: flowOptions,
      showLabel: false,
      isRequired: true,
      isMulti: true,
    },
  ],
};
