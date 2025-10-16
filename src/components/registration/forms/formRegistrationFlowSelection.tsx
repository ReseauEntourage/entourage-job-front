import React from 'react';
import {
  IlluCandidatFolder,
  IlluCoachEtCandidat,
  IlluPoigneeDeMain,
} from 'assets/icons/icons';
import CVIllu from 'assets/icons/illu-CV.svg';
import { RegistrationFlow } from '../flows/flows.types';
import { FormSchema } from 'src/components/forms/FormSchema';
import { SelectListType } from 'src/components/utils/Inputs/SelectList/SelectList.types';

const FlowOptions: SelectListType<RegistrationFlow>[] = [
  {
    value: RegistrationFlow.CANDIDATE,
    label: 'Nous rejoindre en tant que candidat(e)',
    icon: <CVIllu width={50} height={50} />,
    description: "J'ai besoin d'aide dans ma recherche",
  },
  {
    value: RegistrationFlow.COACH,
    label: 'Nous rejoindre en tant que coach',
    icon: <IlluCoachEtCandidat width={50} height={50} />,
    description: 'Je souhaite accompagner des candidats dans leur recherche',
  },
  {
    value: RegistrationFlow.REFERER,
    label: 'Nous rejoindre en tant qu’association ou travailleur social',
    icon: <IlluCandidatFolder width={50} height={50} />,
    description: 'Je souhaite orienter des candidats de ma structure',
  },
  {
    value: RegistrationFlow.COMPANY,
    label: 'Nous rejoindre en tant qu’entreprise',
    icon: <IlluPoigneeDeMain width={50} height={50} />,
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
      options: FlowOptions,
      showLabel: false,
      isRequired: true,
      isMulti: false,
    },
  ],
};
