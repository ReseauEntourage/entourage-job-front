import React from 'react';
import {
  IlluCalendrier,
  IlluConversation,
  IlluCV,
  IlluPoigneeDeMain,
} from 'assets/icons/icons';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { Typography } from 'src/components/utils';
import { Programs } from 'src/constants/programs';
import { COLORS } from 'src/constants/styles';
import { USER_ROLES } from 'src/constants/users';
import { UnionKeys, UnionToIntersection } from 'src/utils/Types';
import { formRegistrationAccount } from './forms/formRegistrationAccount';
import { formRegistrationCandidateExpectations } from './forms/formRegistrationCandidateExpectations';
import { formRegistrationCandidateInfo } from './forms/formRegistrationCandidateInfo';
import { formRegistrationCandidateInfoCo } from './forms/formRegistrationCandidateInfoCo';
import { formRegistrationCandidateProfessionalInformation } from './forms/formRegistrationCandidateProfessionalInformation';
import { formRegistrationCandidateProgram } from './forms/formRegistrationCandidateProgram';
import { formRegistrationCandidateSocialSituation } from './forms/formRegistrationCandidateSocialSituation';
import { formRegistrationCoachInfo } from './forms/formRegistrationCoachInfo';
import { formRegistrationCoachProgram } from './forms/formRegistrationCoachProgram';
import { formRegistrationCoachWebinar } from './forms/formRegistrationCoachWebinar';
import { formRegistrationRole } from './forms/formRegistrationRole';

export type RegistrationStep = `step-${number}`;
export const REGISTRATION_FIRST_STEP = 'step-1' as const;
export const REGISTRATION_CONFIRMATION_STEP = 'confirmation' as const;

export type CandidateRegistrationForm =
  | typeof formRegistrationCandidateExpectations
  | typeof formRegistrationCandidateInfo
  | typeof formRegistrationCandidateProgram
  | typeof formRegistrationCandidateInfoCo
  | typeof formRegistrationCandidateSocialSituation
  | typeof formRegistrationCandidateProfessionalInformation
  | typeof formRegistrationAccount;
/* TODO Add other steps forms here */

export type CoachRegistrationForm =
  | typeof formRegistrationCoachInfo
  | typeof formRegistrationCoachProgram
  | typeof formRegistrationCoachWebinar
  | typeof formRegistrationAccount;
/* TODO Add other steps forms here */

export type FirstStepRegistrationForm = typeof formRegistrationRole;

export type RegistrationForms =
  | FirstStepRegistrationForm
  | CandidateRegistrationForm
  | CoachRegistrationForm;

export type RegistrationFormData =
  ExtractFormSchemaValidation<RegistrationForms>;

export type RegistrationFormDataKeys = UnionKeys<RegistrationFormData>;

export type FlattenedRegistrationFormData =
  UnionToIntersection<RegistrationFormData>;

export type FirstStepRegistrationFormData =
  ExtractFormSchemaValidation<FirstStepRegistrationForm>;

export type RegistrationStepDataByRole = Partial<{
  [USER_ROLES.CANDIDATE]: ExtractFormSchemaValidation<CandidateRegistrationForm>;
  [USER_ROLES.COACH]: ExtractFormSchemaValidation<CoachRegistrationForm>;
}>;

export type RegistrationStepData = Partial<{
  [K in RegistrationStep]: RegistrationStepDataByRole;
}>;

const RegistrationLabels = {
  MULTIPLE_CHOICE: 'Plusieurs choix possible',
  SINGLE_CHOICE: 'Sélectionnez une des deux options',
  FUTURE_CHANGE: 'Vous pourrez modifier votre choix à tout moment',
} as const;

export type RegistrationLabel =
  (typeof RegistrationLabels)[keyof typeof RegistrationLabels];

export interface RegistrationStepContent<
  T extends RegistrationForms = RegistrationForms
> {
  subtitle?: React.ReactNode;
  annotation?: RegistrationLabel;
  form: T;
  // Used to get the values of a previous step as default values in the form of the current step
  dependsOn?: RegistrationFormDataKeys[];
  // Used to skip the step if the value of a previous step matches the value in skippedBy
  skippedBy?: Partial<{
    [K in RegistrationFormDataKeys]: FlattenedRegistrationFormData[K];
  }>;
}

export type RegistrationStepContentByRole = Partial<{
  [USER_ROLES.CANDIDATE]: RegistrationStepContent<CandidateRegistrationForm>;
  [USER_ROLES.COACH]: RegistrationStepContent<CoachRegistrationForm>;
}>;

export const FirstStepContent: RegistrationStepContent<FirstStepRegistrationForm> =
  {
    subtitle: 'Faisons connaissance : quelle est votre situation actuelle ?*',
    form: formRegistrationRole,
    annotation: RegistrationLabels.SINGLE_CHOICE,
  };

export const RegistrationStepContents: {
  [K in RegistrationStep]: RegistrationStepContentByRole;
} = {
  'step-2': {
    [USER_ROLES.CANDIDATE]: {
      subtitle: 'Quelles sont vos attentes en rejoignant Entourage Pro ?*',
      form: formRegistrationCandidateExpectations,
      annotation: RegistrationLabels.MULTIPLE_CHOICE,
    },
    [USER_ROLES.COACH]: {
      form: formRegistrationCoachInfo,
    },
  },
  'step-3': {
    [USER_ROLES.CANDIDATE]: {
      form: formRegistrationCandidateInfo,
    },
    [USER_ROLES.COACH]: {
      subtitle: "Choisissez le type d'accompagnement qui vous correspond",
      annotation: RegistrationLabels.FUTURE_CHANGE,
      form: formRegistrationCoachProgram,
      dependsOn: ['department'],
    },
  },
  'step-4': {
    [USER_ROLES.CANDIDATE]: {
      subtitle: "Choisissez le type d'accompagnement qui vous correspond",
      annotation: RegistrationLabels.FUTURE_CHANGE,
      form: formRegistrationCandidateProgram,
      dependsOn: ['department', 'birthDate'],
    },
    [USER_ROLES.COACH]: {
      subtitle:
        'Et si on se rencontrait ? Choisissez une date pour le webinaire d’information',
      form: formRegistrationCoachWebinar,
      dependsOn: ['program'],
      skippedBy: {
        program: [Programs.BOOST],
      },
    },
  },
  'step-5': {
    [USER_ROLES.CANDIDATE]: {
      subtitle:
        "Et si on se rencontrait ? Choisissez une date d'information collective",
      form: formRegistrationCandidateInfoCo,
      dependsOn: ['department', 'program'],
      skippedBy: {
        program: [Programs.BOOST],
      },
    },
    [USER_ROLES.COACH]: {
      form: formRegistrationAccount,
    },
  },
  'step-6': {
    [USER_ROLES.CANDIDATE]: {
      form: formRegistrationCandidateProfessionalInformation,
      subtitle:
        'Nous aimerions en savoir un peu plus sur vos informations professionnelles.',
    },
  },
  'step-7': {
    [USER_ROLES.CANDIDATE]: {
      form: formRegistrationCandidateSocialSituation,
      subtitle: (
        <>
          Nous aimerions en savoir un peu plus sur votre situation. <br />
          <Typography variant="italic" color="lighter">
            Ces informations sont confidentielles, optionnelles et ne seront pas
            communiquées.
          </Typography>
        </>
      ),
    },
  },
  'step-8': {
    [USER_ROLES.CANDIDATE]: {
      form: formRegistrationAccount,
    },
  },
  /* TODO add other steps content here */
};

export const RegistrationErrorMessages = {
  CURRENT_STEP: 'Registration current step is not set',
  STEP_CONTENT:
    'Registration step content was not found. You should add content for this step.',
  SELECTED_ROLE: 'Registration selected role is not set',
  SELECTED_PROGRAM: 'Registration selected program is not set',
};

export interface LastStepContent {
  title: string;
  subtitle: string;
  bullets: {
    icon: React.ReactNode;
    title: string;
    text: string;
  }[];
}

type RegistrationLastStepContent = {
  [USER_ROLES.CANDIDATE]: {
    [Programs.THREE_SIXTY]: LastStepContent;
    [Programs.BOOST]: LastStepContent;
  };
  [USER_ROLES.COACH]: {
    [Programs.THREE_SIXTY]: LastStepContent;
    [Programs.BOOST]: LastStepContent;
  };
};

const iconSizeProps = { width: 60, height: 60 };

const CoachLastStepContent: Pick<LastStepContent, 'title' | 'bullets'> = {
  title: 'Vous venez de finaliser votre inscription : Bravo !',
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
};

const CandidateLastStepContent: Pick<LastStepContent, 'bullets'> = {
  bullets: [
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
      title: 'Demander des coups de pouces à des coachs',
      text: 'Sollicitez du soutien auprès de coachs tout au long de votre recherche',
    },
    {
      icon: <IlluCalendrier color={COLORS.primaryBlue} {...iconSizeProps} />,
      title: 'Participez à des événements professionnels et conviviaux',
      text: "Rejoignez-nous lors d'événements professionnels pour vivre des moments conviviaux et bâtir votre réseau",
    },
  ],
};

export const LastStepContent: RegistrationLastStepContent = {
  [USER_ROLES.CANDIDATE]: {
    [Programs.THREE_SIXTY]: {
      ...CandidateLastStepContent,
      title: 'On se voit très bientôt !',
      subtitle:
        'On a hâte de vous rencontrer et encore plus hâte de commencer votre accompagnement !',
    },
    [Programs.BOOST]: {
      ...CandidateLastStepContent,
      title: 'Vous venez de finaliser votre inscription : Bravo !',
      subtitle:
        "Mais ce n'est que le début de l'aventure : bienvenue sur votre réseau pro solidaire !",
    },
  },
  [USER_ROLES.COACH]: {
    [Programs.THREE_SIXTY]: {
      ...CoachLastStepContent,
      subtitle:
        'On a hâte de vous rencontrer et encore plus hâte que vous deveniez coach !',
    },
    [Programs.BOOST]: {
      ...CoachLastStepContent,
      subtitle:
        'Vous pouvez désormais demander à votre entourage de vous appeler "coach"',
    },
  },
};
