import React from 'react';
import CVIllu from 'assets/icons/illu-CV.svg';
import TipsIllu from 'assets/icons/illu-poignee-de-main.svg';
import { FormSchema } from 'src/components/forms/FormSchema';
import { SelectListType } from 'src/components/utils/Inputs/SelectList/SelectList.types';
import { NormalUserRole, USER_ROLES } from 'src/constants/users';

const RoleOptions: SelectListType<NormalUserRole>[] = [
  {
    value: USER_ROLES.CANDIDATE,
    label: "J'ai besoin d'aide dans ma recherche d'emploi",
    icon: <CVIllu width={50} height={50} />,
    description: 'Nous rejoindre en tant que candidat(e)',
  },
  {
    value: USER_ROLES.COACH,
    label: "Je souhaite accompagner une personne dans sa recherche d'emploi",
    icon: <TipsIllu width={50} height={50} />,
    description: 'Nous rejoindre en tant que coach',
  },
];

export const formRegistrationRole: FormSchema<{
  role: NormalUserRole[];
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
