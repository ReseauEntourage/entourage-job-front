import {
  CANDIDATE_ACCOMMODATIONS_FILTERS,
  CANDIDATE_ADMINISTRATIVE_SITUATIONS_FILTERS,
  CANDIDATE_NATIONALITIES_FILTERS,
  CANDIDATE_YES_NO_FILTERS,
} from 'src/constants';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';

export default {
  id: 'form-company-contact',
  fields: [
    {
      id: 'firstName',
      name: 'firstName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le prénom du candidat',
      title: 'Prénom du candidat*',
    },
    {
      id: 'lastName',
      name: 'lastName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le nom du candidat',
      title: 'Nom du candidat*',
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'input',
      placeholder: "Tapez l'adresse mail du candidat",
      title: 'Adresse mail du candidat*',
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel',
      placeholder: 'Tapez le téléphone portable du candidat',
      title: 'Téléphone portable du candidat*',
    },
    {
      id: 'postalCode',
      name: 'postalCode',
      component: 'input',
      placeholder: 'La personne doit résider dans les départements 75, 93, 92, 56, 69 ou 59.',
      title: 'Code postal du candidat*',
    },
    {
      id: 'birthDate',
      name: 'birthDate',
      component: 'datepicker',
      title: 'Date de naissance du candidat*',
    },
    {
      id: 'structure',
      name: 'structure',
      type: 'text',
      component: 'input',
      placeholder: '(Association, CCAS, EDAS, etc.)',
      title: 'Nom de votre structure*',
    },
    {
      id: 'structureAddress',
      name: 'structureAddress',
      type: 'text',
      component: 'input',
      placeholder: "Tapez l'adresse postale de votre structure",
      title: 'Adresse postale de votre structure',
    },
    {
      id: 'workerFirstName',
      name: 'workerFirstName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez votre prénom',
      title: 'Votre prénom*',
    },
    {
      id: 'workerLastName',
      name: 'workerLastName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez votre nom',
      title: 'Votre nom*',
    },
    {
      id: 'workerPhone',
      name: 'workerPhone',
      component: 'tel',
      placeholder: 'Tapez votre numéro de téléphone portable',
      title: 'Votre numéro de téléphone portable*',
    },
    {
      id: 'workerEmail',
      name: 'workerEmail',
      type: 'email',
      component: 'input',
      placeholder: 'Tapez votre adresse mail',
      title: 'Votre adresse mail*',
    },
    {
      id: 'nationality',
      name: 'nationality',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez la nationalité du candidat' },
        ...CANDIDATE_NATIONALITIES_FILTERS,
      ],
      title: 'Nationalité du candidat*',
    },
    {
      id: 'administrativeSituation',
      name: 'administrativeSituation',
      component: 'select',
      isMulti: true,
      options: [
        { value: -1, label: 'Choisissez les papiers du candidat' },
        ...CANDIDATE_ADMINISTRATIVE_SITUATIONS_FILTERS,
      ],
      title: 'Type de papier dont dispose le candidat*',
    },
    {
      id: 'workingRight',
      name: 'workingRight',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez si oui ou non' },
        ...CANDIDATE_YES_NO_FILTERS,
      ],
      title:
        'Le candidat possède une autorisation de droit de travail sur le territoire français ?*',
    },
    {
      id: 'accommodation',
      name: 'accommodation',
      component: 'select',
      options: [
        { value: -1, label: "Choisissez l'hébergement du candidat" },
        ...CANDIDATE_ACCOMMODATIONS_FILTERS,
      ],
      title: 'Type de papier dont dispose le candidat*',
    },
    {
      id: 'domiciliation',
      name: 'domiciliation',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez si oui ou non' },
        ...CANDIDATE_YES_NO_FILTERS,
      ],
      title: 'Est-ce que le candidat a une domiciliation administrative ?*',
    },
    {
      id: 'socialSecurity',
      name: 'socialSecurity',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez si oui ou non' },
        ...CANDIDATE_YES_NO_FILTERS,
      ],
      title: 'Est-ce que le candidat a le droit à la sécurité sociale ?*',
    },
    {
      id: 'bankAccount',
      name: 'bankAccount',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez si oui ou non' },
        ...CANDIDATE_YES_NO_FILTERS,
      ],
      title: 'Est-ce que le candidat a un compte bancaire ?*',
    },
    {
      id: 'diagnostic',
      name: 'diagnostic',
      component: 'textarea',
      placeholder:
        "(situation vis à vis du logement/hébergement, insertion professionnelle, le degré d'autonomie du candidat, etc.)",
      title:
        "Merci de nous transmettre un diagnostic social du candidat (situation vis à vis du logement/hébergement, insertion professionnelle, le degré d'autonomie du candidat, etc.)*",
    },
    {
      id: 'comment',
      name: 'comment',
      component: 'textarea',
      placeholder: 'Tapez votre commentaire',
      title:
        'Si vous avez une question, une remarque, vous pouvez nous la partager ci-dessous !',
    },
    {
      id: 'cgu',
      name: 'cgu',
      component: 'cgu',
    },
  ],
  rules: [
    {
      field: 'lastName',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'lastName',
      method: 'isLength',
      args: [
        {
          max: 80,
        },
      ],
      validWhen: true,
      message: '80 caractères maximum',
    },
    {
      field: 'firstName',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'firstName',
      method: 'isLength',
      args: [
        {
          max: 80,
        },
      ],
      validWhen: true,
      message: '80 caractères maximum',
    },
    {
      field: 'workerLastName',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'workerLastName',
      method: 'isLength',
      args: [
        {
          max: 80,
        },
      ],
      validWhen: true,
      message: '80 caractères maximum',
    },
    {
      field: 'workerFirstName',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'workerFirstName',
      method: 'isLength',
      args: [
        {
          max: 80,
        },
      ],
      validWhen: true,
      message: '80 caractères maximum',
    },
    {
      field: 'structure',
      method: 'isLength',
      args: [
        {
          max: 60,
        },
      ],
      validWhen: true,
      message: '60 caractères maximum',
    },
    {
      field: 'structure',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'structureAddress',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'email',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
    },
    {
      field: 'workerEmail',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'workerEmail',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
    },
    {
      field: 'phone',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'phone',
      method: (fieldValue) => {
        return (
          !fieldValue ||
          fieldValue.length === 0 ||
          isValidPhoneNumber(fieldValue, 'FR')
        );
      },
      args: [],
      validWhen: true,
      message: 'Numéro de téléphone invalide',
    },
    {
      field: 'workerPhone',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'workerPhone',
      method: (fieldValue) => {
        return (
          !fieldValue ||
          fieldValue.length === 0 ||
          isValidPhoneNumber(fieldValue, 'FR')
        );
      },
      args: [],
      validWhen: true,
      message: 'Numéro de téléphone invalide',
    },
    {
      field: 'postalCode',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'birthDate',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'nationality',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'administrativeSituation',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'workingRight',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'accommodation',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'domiciliation',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'socialSecurity',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'bankAccount',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'diagnostic',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'diagnostic',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'cgu',
      method: 'equals',
      args: ['true'],
      validWhen: true,
      message: 'Obligatoire',
    },
  ],
};
