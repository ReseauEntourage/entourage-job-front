import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { isEmail } from 'validator';
import { Genders, GENDERS_FILTERS } from '@/src/constants/genders';
import { FormSchema } from 'src/components/forms/FormSchema';

export const formReferingAccountReferedCandidate: FormSchema<{
  firstName: string;
  lastName: string;
  gender: Genders;
  phone: string;
  email: string;
  confirmReferingRules: boolean;
}> = {
  id: 'form-refering-account',
  fields: [
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom du candidat *',
      placeholder: 'Entrez le prénom',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Nom du candidat *',
      placeholder: 'Entrez le nom',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'gender',
      name: 'gender',
      title: 'Genre du candidat *',
      component: 'select-simple',
      options: GENDERS_FILTERS,
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel-input',
      title: 'Numéro de téléphone du candidat *',
      placeholder: 'Entrez le numéro de téléphone',
      isRequired: true,
      showLabel: true,
      rules: [
        {
          method: (fieldValue) =>
            !!fieldValue && isValidPhoneNumber(fieldValue, 'FR'),
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'email',
      name: 'email',
      component: 'text-input',
      title: 'Email du candidat *',
      placeholder: "Entrez l'email",
      isRequired: true,
      showLabel: true,
      rules: [
        {
          method: (fieldValue) => isEmail(fieldValue),
          message: 'Adresse e-mail invalide',
        },
      ],
    },
    {
      id: 'confirmReferingRules',
      name: 'confirmReferingRules',
      component: 'checkbox',
      title:
        "Je certifie avoir informé le candidat ou la candidate que j'oriente, de sa pré-inscription au programme Entourage pro *",
      showLabel: true,
      isRequired: true,
    },
  ],
};
