import React from 'react';
import { LucidIcon } from '@/src/components/ui';
import { SelectOptionTitleIconDescriptionLabelType } from '@/src/components/ui/Inputs/SelectList';
import { SelectOptionTitleIconDescriptionLabel } from '@/src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectOptionTitleIconDescriptionLabel/SelectOptionTitleIconDescriptionLabel';
import { COLORS } from '@/src/constants/styles';
import { RegistrationFlow } from '../flows/flows.types';
import { FormSchema } from 'src/features/forms/FormSchema';

export const FlowOptions: SelectOptionTitleIconDescriptionLabelType<RegistrationFlow>[] =
  [
    {
      value: RegistrationFlow.CANDIDATE,
      label: 'Je cherche un emploi',
      icon: <LucidIcon name="Search" color={COLORS.primaryBlue} />,
      description: 'J’aimerais un coup de pouce dans ma recherche',
    },
    {
      value: RegistrationFlow.COACH,
      label: 'Je veux soutenir un candidat',
      icon: <LucidIcon name="Heart" color={COLORS.primaryBlue} />,
      description: 'Devenir coach : du temps, du réseau, de l’écoute',
    },
    {
      value: RegistrationFlow.REFERER,
      label: 'J’oriente des personnes',
      icon: <LucidIcon name="Users" color={COLORS.primaryBlue} />,
      description: 'Association ou travailleur social d’une structure',
    },
    {
      value: RegistrationFlow.COMPANY,
      label: 'Je représente une entreprise',
      icon: <LucidIcon name="Building2" color={COLORS.primaryBlue} />,
      description: 'Recrutement inclusif ou démarche RSE',
    },
  ];

export const formRegistrationFlowSelection: FormSchema<{
  flow: RegistrationFlow;
}> = {
  id: 'form-registration-flow',
  fields: [
    {
      id: 'flow',
      name: 'flow',
      component: 'select-list',
      options: FlowOptions.map((option) => ({
        value: option.value,
        label: (
          <SelectOptionTitleIconDescriptionLabel
            title={option.label}
            icon={option.icon}
            description={option.description}
          />
        ),
      })),
      showLabel: false,
      isRequired: true,
      isMulti: false,
    },
  ],
};
