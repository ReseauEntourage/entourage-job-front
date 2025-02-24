import {
  FormSchema,
  FormSchemaValidation,
} from 'src/components/forms/FormSchema';
import {
  UnavailabilityReason,
  UnavailabilityReasons,
} from 'src/constants/unavailabilityReasons';
import { NormalUserRole, USER_ROLES, UserRole } from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';

interface FormFeedbackSchema extends FormSchemaValidation {
  isAvailable: boolean;
  unavailabilityReason: string;
}

export const FeedbackOptions: {
  [K in NormalUserRole]: (FilterConstant<UnavailabilityReason> & {
    inputId: string;
  })[];
} = {
  [USER_ROLES.COACH]: [
    {
      value: UnavailabilityReasons.ALREADY_FULL,
      label: 'Je suis en lien avec suffisamment de candidats',
      inputId: `radio-input-${UnavailabilityReasons.ALREADY_FULL}`,
    },
    {
      value: UnavailabilityReasons.NO_MORE_TIME,
      label: "Je n'ai plus de temps à consacrer pour l'instant",
      inputId: `radio-input-${UnavailabilityReasons.NO_MORE_TIME}`,
    },
    {
      value: UnavailabilityReasons.VACATION,
      label: 'Je prends quelques jours pour moi',
      inputId: `radio-input-${UnavailabilityReasons.VACATION}`,
    },
    {
      value: UnavailabilityReasons.NO_MORE_HELP,
      label: 'Je ne souhaite plus accompagner de candidats',
      inputId: `radio-input-${UnavailabilityReasons.NO_MORE_HELP}`,
    },
  ],
  [USER_ROLES.CANDIDATE]: [
    {
      value: UnavailabilityReasons.ALREADY_FULL,
      label: "Suffisament de coach m'apporte leur aide pour le moment",
      inputId: `radio-input-${UnavailabilityReasons.ALREADY_FULL}`,
    },
    {
      value: UnavailabilityReasons.NO_MORE_TIME,
      label: "Je n'ai plus de temps pour mon projet, pour l'instant",
      inputId: `radio-input-${UnavailabilityReasons.NO_MORE_TIME}`,
    },
    {
      value: UnavailabilityReasons.VACATION,
      label: 'Je prends quelques jours pour moi',
      inputId: `radio-input-${UnavailabilityReasons.VACATION}`,
    },
    {
      value: UnavailabilityReasons.NO_MORE_HELP,
      label: "Je n'ai plus besoin d'aide pour mon projet",
      inputId: `radio-input-${UnavailabilityReasons.NO_MORE_HELP}`,
    },
  ],
};

export const formFeedback = (
  role: UserRole
): FormSchema<FormFeedbackSchema> => {
  const options = FeedbackOptions[role];
  return {
    id: 'form-user-feedback',
    fields: [
      {
        id: 'unavailabilityReason',
        name: 'unavailabilityReason',
        component: 'radio',
        isRequired: false,
        errorMessage: 'Veuillez sélectionner une des réponses', // TODO needed ?
        options,
      },
    ],
  };
};
