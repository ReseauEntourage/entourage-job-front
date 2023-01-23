import {
  BUSINESS_LINES,
  CANDIDATE_ACCOMMODATIONS_FILTERS,
  CANDIDATE_ADMINISTRATIVE_SITUATIONS_FILTERS,
  CANDIDATE_GENDERS_FILTERS,
  CANDIDATE_HELP_WITH_FILTERS,
  CANDIDATE_PROFESSIONAL_SITUATIONS_FILTERS,
  CANDIDATE_RESOURCES_FILTERS,
  CANDIDATE_YES_NO_FILTERS,
  HEARD_ABOUT_FILTERS,
} from 'src/constants';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';

export default {
  id: 'form-candidate-contact',
  fields: [
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
      id: 'structure',
      name: 'structure',
      type: 'text',
      component: 'input',
      placeholder: '(Association, CCAS, EDAS, etc.)',
      title: 'Votre structure*',
    },
    {
      id: 'workerPosition',
      name: 'workerPosition',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez votre fonction',
      title: 'Votre fonction',
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
      id: 'workerPhone',
      name: 'workerPhone',
      component: 'tel',
      placeholder: 'Tapez votre numéro de téléphone portable',
      title: 'Votre numéro de téléphone portable*',
    },
    {
      id: 'firstName',
      name: 'firstName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le prénom de la personne',
      title: 'Prénom de la personne que vous souhaitez orienter*',
    },
    {
      id: 'lastName',
      name: 'lastName',
      type: 'text',
      component: 'input',
      placeholder: 'Tapez le nom de la personne',
      title: 'Son nom*',
    },
    {
      id: 'helpWith',
      name: 'helpWith',
      component: 'select-request',
      isMulti: true,
      options: CANDIDATE_HELP_WITH_FILTERS,
      placeholder: 'Choisissez les domaines',
      title: "Dans quel(s) domaine(s) l'accompagnez-vous ?*",
    },
    {
      id: 'gender',
      name: 'gender',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez le sexe' },
        ...CANDIDATE_GENDERS_FILTERS,
      ],
      title: 'Son sexe*',
    },
    {
      id: 'birthDate',
      name: 'birthDate',
      component: 'datepicker',
      title:
        'Sa date de naissance (la personne doit avoir plus de 18 ans pour rejoindre LinkedOut)',
    },
    {
      id: 'address',
      name: 'address',
      component: 'input',
      placeholder: 'Tapez son adresse',
      title: 'Son adresse',
    },
    {
      id: 'postalCode',
      name: 'postalCode',
      component: 'input',
      placeholder:
        'La personne doit résider dans les départements 75, 93, 92, 56, 35, 69 ou 59.',
      title: 'Son code postal*',
    },
    {
      id: 'city',
      name: 'city',
      component: 'input',
      placeholder: 'Tapez sa ville',
      title: 'Sa ville*',
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel',
      placeholder: 'Tapez son numéro de téléphone portable',
      title:
        "Son téléphone portable (nous inviterons la personne à une réunion d'information)*",
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'input',
      placeholder: "Tapez l'adresse mail de la personne",
      title: 'Son adresse mail',
    },
    {
      id: 'registeredUnemploymentOffice',
      name: 'registeredUnemploymentOffice',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez si oui ou non' },
        ...CANDIDATE_YES_NO_FILTERS,
      ],
      title:
        'La personne que vous souhaitez orienter est-elle inscrite au Pôle Emploi ?*',
    },
    {
      id: 'administrativeSituation',
      name: 'administrativeSituation',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez les papiers de la personne' },
        ...CANDIDATE_ADMINISTRATIVE_SITUATIONS_FILTERS,
      ],
      title: "De quels papiers d'identité la personne dispose-t-elle ?",
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
        "A-t-elle l'autorisation de travailler sur le territoire Français ?*",
    },
    {
      id: 'accommodation',
      name: 'accommodation',
      component: 'select',
      options: [
        { value: -1, label: "Choisissez l'hébergement de la personne" },
        ...CANDIDATE_ACCOMMODATIONS_FILTERS,
      ],
      title: "Quelle est sa situation d'hébergement ?*",
    },
    {
      id: 'professionalSituation',
      name: 'professionalSituation',
      component: 'select',
      options: [
        {
          value: -1,
          label: 'Choisissez la situation professionnel de la personne',
        },
        ...CANDIDATE_PROFESSIONAL_SITUATIONS_FILTERS,
      ],
      title: 'Quelle est sa situation professionnelle ?*',
    },
    {
      id: 'resources',
      name: 'resources',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez les ressources de la personne' },
        ...CANDIDATE_RESOURCES_FILTERS,
      ],
      title: 'Quelle est la nature de ses ressources ?',
    },
    {
      id: 'domiciliation',
      name: 'domiciliation',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez si oui ou non' },
        ...CANDIDATE_YES_NO_FILTERS,
      ],
      title:
        'A-t-elle une adresse de domiciliation ? Si c\'est la même que celle de son logement, choisir "Oui"*',
    },
    {
      id: 'socialSecurity',
      name: 'socialSecurity',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez si oui ou non' },
        ...CANDIDATE_YES_NO_FILTERS,
      ],
      title:
        'A-t-elle des droits ouverts à la sécurité sociale ? (régime général, CSS, CMU, AME, etc.)*',
    },
    {
      id: 'handicapped',
      name: 'handicapped',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez si oui ou non' },
        ...CANDIDATE_YES_NO_FILTERS,
      ],
      title:
        'A-t-elle la reconnaissance RQTH ? (Reconnaissance de la qualité de travailleur handicapé)',
    },
    {
      id: 'bankAccount',
      name: 'bankAccount',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez si oui ou non' },
        ...CANDIDATE_YES_NO_FILTERS,
      ],
      title: 'A-t-elle un compte bancaire ?*',
    },
    {
      id: 'businessLines',
      name: 'businessLines',
      title: 'Dans quel secteur professionnel souhaite-t-elle travailler ?',
      placeholder: 'Sélectionnez les familles de métiers',
      component: 'select-request',
      isMulti: true,
      options: BUSINESS_LINES,
    },
    {
      id: 'descriptionLabel',
      title:
        'En quelques lignes, merci de vous présenter et détailler pourquoi vous souhaitez orienter cette personne vers LinkedOut',
      component: 'heading',
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Présentation*',
    },
    {
      id: 'heardAbout',
      name: 'heardAbout',
      component: 'select',
      options: [
        { value: -1, label: 'Choisissez comment vous avez connu LinkedOut' },
        ...HEARD_ABOUT_FILTERS,
      ],
      title: 'Comment avez-vous connu LinkedOut ?*',
    },
    {
      id: 'diagnosticLabel',
      title:
        'Souhaitez-vous nous faire parvenir une évaluation de la personne ? Ce document restera strictement confidentiel',
      component: 'heading',
    },
    {
      id: 'diagnostic',
      name: 'diagnostic',
      component: 'textarea',
      title: 'Diagnostic',
    },
    {
      id: 'contactWithCoach',
      name: 'contactWithCoach',
      component: 'checkbox',
      title:
        'Souhaitez-vous être mis en relation avec le/la Coach LinkedOut si besoin et avec l’accord de la personne ?',
    },
  ],
  rules: [
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
      field: 'helpWith',
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
      field: 'gender',
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
      field: 'postalCode',
      method: 'isPostalCode',
      args: ['FR'],
      validWhen: true,
      message: 'Obligatoire',
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
      field: 'city',
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
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
    },
    {
      field: 'registeredUnemploymentOffice',
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
      field: 'professionalSituation',
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
      field: 'description',
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
      field: 'heardAbout',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
  ],
};
