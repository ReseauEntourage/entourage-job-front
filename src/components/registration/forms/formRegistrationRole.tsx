import React from 'react';
import { IlluCandidatFolder } from 'assets/icons/icons';
import CVIllu from 'assets/icons/illu-CV.svg';
import TipsIllu from 'assets/icons/illu-poignee-de-main.svg';
import { FormSchema } from 'src/components/forms/FormSchema';
import { SelectListType } from 'src/components/utils/Inputs/SelectList/SelectList.types';
import { RegistrableUserRoles, UserRoles } from 'src/constants/users';

const RoleOptions: SelectListType<RegistrableUserRoles>[] = [
  {
    value: UserRoles.CANDIDATE,
    label: "J'ai besoin d'aide dans ma recherche d'emploi",
    icon: <CVIllu width={50} height={50} />,
    description: 'Nous rejoindre en tant que candidat(e)',
  },
  {
    value: UserRoles.COACH,
    label: "Je souhaite accompagner une personne dans sa recherche d'emploi",
    icon: <TipsIllu width={50} height={50} />,
    description: 'Nous rejoindre en tant que coach',
  },
  {
    value: UserRoles.REFERER,
    label: 'Je souhaite orienter des candidats de ma structure',
    icon: <IlluCandidatFolder width={50} height={50} />,
    description: 'Nous rejoindre en tant qu’association ou travailleur social',
  },
];

export const formRegistrationRole: FormSchema<{
  role: RegistrableUserRoles[];
}> = {
  id: 'form-registration-role',
  fields: [
    {
      id: 'role',
      name: 'role',
      component: 'select-list',
      options: RoleOptions,
      showLabel: false,
      isRequired: true,
      isMulti: false,
    },
  ],
};
