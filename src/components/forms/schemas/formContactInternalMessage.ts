import { FormSchema, FormSchemaValidation, GetValueType } from '../FormSchema';
import {
  InternalMessageSubject,
  INTERNAL_MESSAGES_PLACEHOLDERS,
  INTERNAL_MESSAGE_SUBJECT_FILTER,
} from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

interface FormContactInternalMessage extends FormSchemaValidation {
  subject: FilterConstant<InternalMessageSubject>;
  message: string;
}

const getPlaceholder = (getValue: GetValueType<FormContactInternalMessage>) => {
  const subject = getValue('subject');
  const isCoach = getValue('selectedProfileRole') === 'Coach';
  const roleKey = isCoach ? 'COACH' : 'CANDIDATE';

  if (!subject || !subject.value || !roleKey) {
    return 'Selectionnez un objet pour afficher un exemple de message.';
  }

  return INTERNAL_MESSAGES_PLACEHOLDERS[roleKey][subject.value];
};

export const formContactInternalMessage: FormSchema<FormContactInternalMessage> =
  {
    id: 'form-contact-internal-message',
    fields: [
      {
        id: 'selectedProfileRole',
        name: 'selectedProfileRole',
        component: 'text-input',
        title: 'Rôle de profil séléctionné :',
        isRequired: true,
        hidden: true,
      },
      {
        id: 'subject',
        name: 'subject',
        title: 'Objet du message :',
        component: 'select',
        options: INTERNAL_MESSAGE_SUBJECT_FILTER,
        isRequired: true,
        showLabel: false,
        isMulti: false,
      },
      {
        id: 'message',
        name: 'message',
        component: 'textarea',
        title: 'Votre message :',
        isRequired: true,
        showLabel: true,
        placeholder: getPlaceholder,
      },
    ],
  };
