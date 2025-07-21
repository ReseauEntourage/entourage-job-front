import React from 'react';
import {
  IlluCalendrier,
  IlluConversation,
  IlluCV,
  IlluPoigneeDeMain,
} from '@/assets/icons/icons';
import { COLORS } from '@/src/constants/styles';
import { RegistrableUserRoles, UserRoles } from '@/src/constants/users';
import { ExtractFormSchemaValidation } from '../forms/FormSchema';
import { RegistrationFlow } from './flows/flows.types';
import { formRegistrationAccount } from './forms/formRegistrationAccount';
import { formRegistrationCandidateEconomicSocialInformation } from './forms/formRegistrationCandidateEconomicSocialInformation';
import { formRegistrationCandidateExpectations } from './forms/formRegistrationCandidateExpectations';
import { formRegistrationCandidateInfo } from './forms/formRegistrationCandidateInfo';
import { formRegistrationCandidateProfessionalInformation } from './forms/formRegistrationCandidateProfessionalInformation';
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
  RegistrationLastStepContentByFlow,
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
  'companyName',
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

export type RegistrationStepContentByFlow = Partial<{
  [RegistrationFlow.CANDIDATE]: RegistrationStepContent<CandidateRegistrationFlowForm>[];
  [RegistrationFlow.COACH]: RegistrationStepContent<CoachRegistrationFlowForm>[];
  [RegistrationFlow.REFERER]: RegistrationStepContent<RefererRegistrationFlowForm>[];
  [RegistrationFlow.COMPANY]: RegistrationStepContent<CompanyRegistrationFlowForm>[];
}>;

const iconSizeProps = { width: 60, height: 60 };

export const candidateLastStepBullets = [
  {
    icon: <IlluCV {...iconSizeProps} />,
    title: 'Mettez à jour votre CV',
    text: "Créez votre CV en quelques clics et bénéficiez d'une meilleure visibilité sur notre site",
  },
  {
    icon: <IlluConversation {...iconSizeProps} />,
    title: 'Discutez et échangez avec des candidat(e)s et des coachs',
    text: 'Commencez à construire votre réseau en prenant contact avec les autres membres de la communauté',
  },
  {
    icon: <IlluPoigneeDeMain {...iconSizeProps} />,
    title: 'Demandez des coups de pouces à des coachs',
    text: 'Sollicitez du soutien auprès de coachs tout au long de votre recherche',
  },
  {
    icon: <IlluCalendrier color={COLORS.primaryBlue} {...iconSizeProps} />,
    title: 'Participez à des événements professionnels et conviviaux',
    text: "Rejoignez-nous lors d'événements professionnels pour vivre des moments conviviaux et bâtir votre réseau",
  },
];
export const LastStepContent: RegistrationLastStepContentByFlow = {
  [RegistrationFlow.CANDIDATE]: {
    bullets: candidateLastStepBullets,
    title:
      "Il ne vous reste plus qu'a valider votre adresse email en cliquant sur le lien que vous avez reçu par mail.",
    subtitle:
      "Mais ce n'est que le début de l'aventure : bienvenue sur votre réseau pro solidaire !",
  },
  [RegistrationFlow.COACH]: {
    bullets: [
      {
        icon: <IlluConversation {...iconSizeProps} />,
        title: 'Discutez et échangez avec des candidat(e)s et des coachs',
        text: "Commencez à partager et développer votre réseau solidaire en prenant contact avec d'autres membres de la communauté",
      },
      {
        icon: <IlluPoigneeDeMain {...iconSizeProps} />,
        title: 'Donnez des coup de pouces à des candidat(e)s',
        text: "Faites profiter de votre expérience à des candidat(e)s et soutenez-les dans leurs recherches d'emploi",
      },
      {
        icon: <IlluCalendrier color={COLORS.primaryBlue} {...iconSizeProps} />,
        title: 'Participez à des événements professionnels et conviviaux',
        text: "Rejoignez-nous lors d'événements professionnels pour vivre des moments conviviaux et bâtir votre réseau solidaire",
      },
    ],
    title:
      "Il ne vous reste plus qu'a valider votre adresse email en cliquant sur le lien que vous avez reçu par mail.",
    subtitle:
      'Vous pouvez désormais demander à votre entourage de vous appeler "coach"',
  },
  [RegistrationFlow.REFERER]: {
    bullets: [
      {
        icon: <IlluPoigneeDeMain {...iconSizeProps} />,
        title:
          'Facilitez l’inscription et le suivi des personnes que vous accompagnez',
        text: "Consultez les profils de vos candidats et soutenez-les dans leur recherche d'emploi",
      },
      {
        icon: <IlluConversation {...iconSizeProps} />,
        title: "Découvrez le réseau d'entraide et adressez lui vos candidats",
        text: 'Consultez le réseau d’entraide pour orienter au mieux vos candidats vers les coachs qui peuvent leur donner un coup de pouce dans leur recherche d’emploi',
      },
      {
        icon: <IlluCalendrier color={COLORS.primaryBlue} {...iconSizeProps} />,
        title: 'Participez à des événements professionnels et conviviaux',
        text: "Rejoignez-nous lors d'événements professionnels pour vivre des moments conviviaux et bâtir votre réseau solidaire",
      },
    ],
    title:
      'Il ne vous reste plus qu’à valider votre adresse email en cliquant sur le lien que vous avez reçu par mail',
    subtitle:
      'Vous pouvez désormais accéder à votre compte entourage pro et orienter un ou plusieurs candidat',
  },
  [RegistrationFlow.COMPANY]: {
    bullets: [
      {
        icon: <IlluConversation {...iconSizeProps} />,
        title: 'Sensibiliser vos collaborateurs',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        icon: <IlluPoigneeDeMain {...iconSizeProps} />,
        title: 'Inviter des collaborateurs',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        icon: <IlluCV color={COLORS.primaryBlue} {...iconSizeProps} />,
        title: 'Recruter des candidats',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
    ],
    title:
      'Il ne vous reste plus qu’à valider votre adresse email en cliquant sur le lien que vous avez reçu par mail',
    subtitle:
      'Vous pouvez désormais accéder à votre compte entourage pro et orienter un ou plusieurs candidat',
  },
};

export const RegistrationFlows: {
  [K in RegistrationFlow]: RegistrationStepContentByFlow[K];
} = {
  [RegistrationFlow.CANDIDATE]: [
    {
      subtitle: 'Quelles sont vos attentes en rejoignant Entourage Pro ?*',
      form: formRegistrationCandidateExpectations,
      annotation: RegistrationStepAnnotation.MULTIPLE_CHOICE,
    },
    {
      form: formRegistrationCandidateInfo,
    },
    {
      form: formRegistrationCandidateEconomicSocialInformation,
    },
    {
      form: formRegistrationCandidateProfessionalInformation,
      subtitle:
        'Nous aimerions en savoir un peu plus sur vos informations professionnelles.',
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
      customDispatch: (stepData) => {
        const { companyRole } = stepData as ExtractFormSchemaValidation<
          typeof formRegistrationCompanyRole
        >;

        if (companyRole.value === 'other') {
          return {
            flow: RegistrationFlow.COACH,
            nextStep: 0,
            data: {},
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

export const REGISTRATION_COMPANY_FLOW_COMPANY_SELECTION_STEP = 1;
