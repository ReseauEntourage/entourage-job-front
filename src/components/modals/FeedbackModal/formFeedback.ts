import {
  FormSchema,
  FormSchemaValidation,
} from 'src/components/forms/FormSchema';
import {
  UnavailabilityReason,
  UnavailabilityReasons,
} from 'src/constants/unavailabilityReasons';
import { NormalUserRoles, UserRoles } from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';

interface FormFeedbackSchema extends FormSchemaValidation {
  isAvailable: boolean;
  unavailabilityReason: string;
}

export const FeedbackOptions: {
  [K in NormalUserRoles]: (FilterConstant<UnavailabilityReason> & {
    inputId: string;
  })[];
} = {
  [UserRoles.COACH]: [
    {
      value: UnavailabilityReasons.ALREADY_FULL,
      label: 'Je suis en lien avec suffisamment de candidat.e.s',
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
      label: 'Je ne souhaite plus accompagner de candidat.e.s',
      inputId: `radio-input-${UnavailabilityReasons.NO_MORE_HELP}`,
    },
  ],
  [UserRoles.CANDIDATE]: [
    {
      value: UnavailabilityReasons.ALREADY_FULL,
      label: 'J’ai assez d’échanges avec des coachs pour le moment',
      inputId: `radio-input-${UnavailabilityReasons.ALREADY_FULL}`,
    },

    {
      value: UnavailabilityReasons.VACATION,
      label: 'Je fais une pause',
      inputId: `radio-input-${UnavailabilityReasons.VACATION}`,
    },
    {
      value: UnavailabilityReasons.NO_MORE_HELP,
      label: 'Je n’ai plus besoin d’aide',
      inputId: `radio-input-${UnavailabilityReasons.NO_MORE_HELP}`,
    },
    {
      value: UnavailabilityReasons.OTHER_SUPPORT,
      label: 'Je priorise d’autres façons d’avoir du soutien',
      inputId: `radio-input-${UnavailabilityReasons.OTHER_SUPPORT}`,
    },
  ],
};

export const formFeedback = (
  role: UserRoles
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
        errorMessage: 'Veuillez sélectionner une des réponses',
        options,
      },
    ],
  };
};
