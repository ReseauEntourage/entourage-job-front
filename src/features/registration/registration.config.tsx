import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { CompanyUserRole } from '@/src/constants/company';
import { RegistrableUserRoles, UserRoles } from '@/src/constants/users';
import { ExtractFormSchemaValidation } from '../forms/FormSchema';
import { RegistrationFlow } from './flows/flows.types';
import { formRegistrationAccount } from './forms/formRegistrationAccount';
import { formRegistrationCandidateEconomicSocialInformation } from './forms/formRegistrationCandidateEconomicSocialInformation';
import { formRegistrationCandidateInfo } from './forms/formRegistrationCandidateInfo';
import { formRegistrationCoachInfo } from './forms/formRegistrationCoachInfo';
import { formRegistrationCompanyRole } from './forms/formRegistrationCompanyRole';
import { formRegistrationCompanySelection } from './forms/formRegistrationCompanySelection';
import { formRegistrationFlowSelection } from './forms/formRegistrationFlowSelection';
import { formRegistrationRefererAccount } from './forms/formRegistrationRefererAccount';
import {
  CandidateRegistrationFlowForm,
  CoachRegistrationFlowForm,
  CompanyRegistrationFlowForm,
  RefererRegistrationFlowForm,
  RegistrationFlowForms,
  RegistrationStepAnnotation,
  RegistrationStepContent,
} from './registration.types';

export const REGISTRATION_FIRST_STEP = 0;
export const REGISTRATION_CONFIRMATION_STEP = 'confirmation';

export const RegistrationStepSelectFlow: RegistrationStepContent<RegistrationFlowForms> =
  {
    subtitle: 'Faisons connaissance : quelle est votre situation actuelle ?*',
    form: formRegistrationFlowSelection,
    annotation: RegistrationStepAnnotation.SINGLE_CHOICE,
  };

export const RegistrationErrorMessages = {
  CURRENT_STEP: 'Registration current step is not set',
  STEP_CONTENT:
    'Registration step content was not found. You should add content for this step.',
  SELECTED_FLOW: 'Registration selected flow is not set',
};

export const RegistrationExcludedFieldsKeys = [
  'nameOrganization',
  'acceptCGU',
  'flow',
];

export const UserRoleByFlow: {
  [K in RegistrationFlow]: RegistrableUserRoles;
} = {
  [RegistrationFlow.CANDIDATE]: UserRoles.CANDIDATE,
  [RegistrationFlow.COACH]: UserRoles.COACH,
  [RegistrationFlow.REFERER]: UserRoles.REFERER,
  [RegistrationFlow.COMPANY]: UserRoles.COACH,
};

type RegistrationStepContentByFlow = Partial<{
  [RegistrationFlow.CANDIDATE]: RegistrationStepContent<CandidateRegistrationFlowForm>[];
  [RegistrationFlow.COACH]: RegistrationStepContent<CoachRegistrationFlowForm>[];
  [RegistrationFlow.REFERER]: RegistrationStepContent<RefererRegistrationFlowForm>[];
  [RegistrationFlow.COMPANY]: RegistrationStepContent<CompanyRegistrationFlowForm>[];
}>;

const iconSizeProps = { width: 60, height: 60 };

export const candidateLastStepBullets = [
  {
    icon: <SvgIcon name="IlluCV" {...iconSizeProps} />,
    title: 'Mettez à jour votre CV',
    text: "Créez votre CV en quelques clics et bénéficiez d'une meilleure visibilité sur notre site",
  },
  {
    icon: <SvgIcon name="IlluConversation" {...iconSizeProps} />,
    title: 'Discutez et échangez avec des candidat(e)s et des coachs',
    text: 'Commencez à construire votre réseau en prenant contact avec les autres membres de la communauté',
  },
  {
    icon: <SvgIcon name="IlluPoigneeDeMain" {...iconSizeProps} />,
    title: 'Demandez des coups de pouces à des coachs',
    text: 'Sollicitez du soutien auprès de coachs tout au long de votre recherche',
  },
  {
    icon: <SvgIcon name="IlluCalendrier" {...iconSizeProps} />,
    title: 'Participez à des événements professionnels et conviviaux',
    text: "Rejoignez-nous lors d'événements professionnels pour vivre des moments conviviaux et bâtir votre réseau",
  },
];

export const RegistrationFlows: {
  [K in RegistrationFlow]: RegistrationStepContentByFlow[K];
} = {
  [RegistrationFlow.CANDIDATE]: [
    {
      form: formRegistrationCandidateInfo,
    },
    {
      form: formRegistrationCandidateEconomicSocialInformation,
    },
    {
      form: formRegistrationAccount,
    },
  ],
  [RegistrationFlow.COACH]: [
    {
      form: formRegistrationCoachInfo,
    },
    {
      form: formRegistrationAccount,
    },
  ],
  [RegistrationFlow.REFERER]: [
    {
      form: formRegistrationRefererAccount,
    },
  ],
  [RegistrationFlow.COMPANY]: [
    {
      form: formRegistrationCompanyRole,
      customDispatch: (data) => {
        const { companyRole } = data as ExtractFormSchemaValidation<
          typeof formRegistrationCompanyRole
        >;

        if (companyRole.value === CompanyUserRole.EMPLOYEE) {
          return {
            flow: RegistrationFlow.COACH,
            nextStep: 0,
            data: null,
          };
        }
      },
    },
    {
      form: formRegistrationCompanySelection,
    },
    {
      form: formRegistrationCoachInfo,
    },
    {
      form: formRegistrationAccount,
    },
  ],
};
