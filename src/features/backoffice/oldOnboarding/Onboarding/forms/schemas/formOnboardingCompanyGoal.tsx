import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { SelectListType } from '@/src/components/ui/Inputs/SelectList/SelectList.types';
import { CompanyGoal } from '@/src/constants/company';
import { FormSchema } from '@/src/features/forms/FormSchema';

const flowOptions: SelectListType<CompanyGoal>[] = [
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
      options: flowOptions,
      showLabel: false,
      isRequired: true,
      isMulti: true,
    },
  ],
};
