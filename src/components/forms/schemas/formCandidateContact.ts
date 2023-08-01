import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { isEmail } from 'validator';
import { FormSchema } from '../FormSchema/FormSchema.types';
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

export const formCandidateContact: FormSchema = {
  id: 'form-candidate-contact',
  fields: [
    {
      id: 'workerFirstName',
      name: 'workerFirstName',
      component: 'text-input',
      title: 'Votre prénom*',
    },
    {
      id: 'workerLastName',
      name: 'workerLastName',
      component: 'text-input',
      title: 'Votre nom*',
    },
    {
      id: 'structure',
      name: 'structure',
      component: 'text-input',
      title: 'Votre structure* (Association, CCAS, EDAS, etc.)',
    },
    {
      id: 'workerPosition',
      name: 'workerPosition',
      component: 'text-input',
      title: 'Votre fonction',
    },
    {
      id: 'workerEmail',
      name: 'workerEmail',
      type: 'email',
      component: 'text-input',
      title: 'Votre adresse mail*',
    },
    {
      id: 'workerPhone',
      name: 'workerPhone',
      component: 'tel-input',
      title: 'Votre numéro de téléphone portable*',
    },
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom de la personne que vous souhaitez orienter*',
    },
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Son nom*',
    },
    {
      id: 'helpWith',
      name: 'helpWith',
      component: 'select',
      isMulti: true,
      options: CANDIDATE_HELP_WITH_FILTERS,
      title: "Dans quel(s) domaine(s) l'accompagnez-vous ?*",
    },
    {
      id: 'gender',
      name: 'gender',
      component: 'select-simple',
      options: CANDIDATE_GENDERS_FILTERS,
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
      component: 'text-input',
      title: 'Son adresse',
    },
    {
      id: 'postalCode',
      name: 'postalCode',
      component: 'text-input',
      placeholder:
        'La personne doit résider dans les départements 75, 93, 92, 56, 35, 69 ou 59.',
      title: 'Son code postal*',
    },
    {
      id: 'city',
      name: 'city',
      component: 'text-input',
      title: 'Sa ville*',
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel-input',
      title:
        "Son téléphone portable (nous inviterons la personne à une réunion d'information)*",
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'text-input',
      title: 'Son adresse mail',
    },
    {
      id: 'registeredUnemploymentOffice',
      name: 'registeredUnemploymentOffice',
      component: 'select-simple',
      options: CANDIDATE_YES_NO_FILTERS,

      title:
        'La personne que vous souhaitez orienter est-elle inscrite au Pôle Emploi ?*',
    },
    {
      id: 'administrativeSituation',
      name: 'administrativeSituation',
      component: 'select-simple',
      options: CANDIDATE_ADMINISTRATIVE_SITUATIONS_FILTERS,
      title: "De quels papiers d'identité la personne dispose-t-elle ?",
    },
    {
      id: 'workingRight',
      name: 'workingRight',
      component: 'select-simple',
      options: CANDIDATE_YES_NO_FILTERS,
      title:
        "A-t-elle l'autorisation de travailler sur le territoire Français ?*",
    },
    {
      id: 'accommodation',
      name: 'accommodation',
      component: 'select-simple',
      options: CANDIDATE_ACCOMMODATIONS_FILTERS,
      title: "Quelle est sa situation d'hébergement ?*",
    },
    {
      id: 'professionalSituation',
      name: 'professionalSituation',
      component: 'select-simple',
      options: CANDIDATE_PROFESSIONAL_SITUATIONS_FILTERS,
      title: 'Quelle est sa situation professionnelle ?*',
    },
    {
      id: 'resources',
      name: 'resources',
      component: 'select-simple',
      options: CANDIDATE_RESOURCES_FILTERS,
      title: 'Quelle est la nature de ses ressources ?',
    },
    {
      id: 'domiciliation',
      name: 'domiciliation',
      component: 'select-simple',
      options: CANDIDATE_YES_NO_FILTERS,
      title:
        'A-t-elle une adresse de domiciliation ? Si c\'est la même que celle de son logement, choisir "Oui"*',
    },
    {
      id: 'socialSecurity',
      name: 'socialSecurity',
      component: 'select-simple',
      options: CANDIDATE_YES_NO_FILTERS,
      title:
        'A-t-elle des droits ouverts à la sécurité sociale ? (régime général, CSS, CMU, AME, etc.)*',
    },
    {
      id: 'handicapped',
      name: 'handicapped',
      component: 'select-simple',
      options: CANDIDATE_YES_NO_FILTERS,
      title:
        'A-t-elle la reconnaissance RQTH ? (Reconnaissance de la qualité de travailleur handicapé)',
    },
    {
      id: 'bankAccount',
      name: 'bankAccount',
      component: 'select-simple',
      options: CANDIDATE_YES_NO_FILTERS,
      title: 'A-t-elle un compte bancaire ?*',
    },
    {
      id: 'businessLines',
      name: 'businessLines',
      title: 'Dans quel secteur professionnel souhaite-t-elle travailler ?',
      component: 'select',
      isMulti: true,
      options: BUSINESS_LINES,
    },
    {
      id: 'descriptionLabel',
      name: 'descriptionLabel',
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
      component: 'select-simple',
      options: HEARD_ABOUT_FILTERS,
      title: 'Comment avez-vous connu LinkedOut ?*',
    },
    {
      id: 'diagnosticLabel',
      name: 'diagnosticLabel',
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
      isRequired: true,
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
      isRequired: true,
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
      isRequired: true,
    },
    {
      field: 'workerEmail',
      isRequired: true,
    },
    {
      field: 'workerEmail',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
    },
    {
      field: 'workerPhone',
      isRequired: true,
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
      isRequired: true,
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
      isRequired: true,
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
      isRequired: true,
    },
    {
      field: 'gender',
      isRequired: true,
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
      isRequired: true,
    },
    {
      field: 'city',
      isRequired: true,
    },
    {
      field: 'phone',
      isRequired: true,
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
      method: (fieldValue) => {
        return !fieldValue || fieldValue.length === 0 || isEmail(fieldValue);
      },
      validWhen: true,
      message: 'Adresse e-mail invalide',
    },
    {
      field: 'registeredUnemploymentOffice',
      isRequired: true,
    },
    {
      field: 'workingRight',
      isRequired: true,
    },
    {
      field: 'accommodation',
      isRequired: true,
    },
    {
      field: 'professionalSituation',
      isRequired: true,
    },
    {
      field: 'domiciliation',
      isRequired: true,
    },
    {
      field: 'socialSecurity',
      isRequired: true,
    },
    {
      field: 'bankAccount',
      isRequired: true,
    },
    {
      field: 'description',
      isRequired: true,
    },
    {
      field: 'heardAbout',
      isRequired: true,
    },
  ],
};
