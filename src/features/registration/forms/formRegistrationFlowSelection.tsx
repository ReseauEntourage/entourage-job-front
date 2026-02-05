import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { SelectOptionTitleIconDescriptionLabelType } from '@/src/components/ui/Inputs/SelectList';
import { SelectOptionTitleIconDescriptionLabel } from '@/src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectOptionTitleIconDescriptionLabel/SelectOptionTitleIconDescriptionLabel';
import { RegistrationFlow } from '../flows/flows.types';
import { FormSchema } from 'src/features/forms/FormSchema';

const FlowOptions: SelectOptionTitleIconDescriptionLabelType<RegistrationFlow>[] =
  [
    {
      value: RegistrationFlow.CANDIDATE,
      label: 'Nous rejoindre en tant que candidat(e)',
      icon: <SvgIcon name="IlluCV" width={50} height={50} />,
      description: "J'ai besoin d'aide dans ma recherche",
    },
    {
      value: RegistrationFlow.COACH,
      label: 'Nous rejoindre en tant que coach',
      icon: <SvgIcon name="IlluCoachEtCandidat" width={50} height={50} />,
      description: 'Je souhaite accompagner des candidats dans leur recherche',
    },
    {
      value: RegistrationFlow.REFERER,
      label: 'Nous rejoindre en tant qu’association ou travailleur social',
      icon: <SvgIcon name="IlluCandidatFolder" width={50} height={50} />,
      description: 'Je souhaite orienter des candidats de ma structure',
    },
    {
      value: RegistrationFlow.COMPANY,
      label: 'Nous rejoindre en tant qu’entreprise',
      icon: <SvgIcon name="IlluPoigneeDeMain" width={50} height={50} />,
      description:
        'Je souhaite inscrire mon entreprise dans une démarche RSE ou de recrutement inclusif',
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
