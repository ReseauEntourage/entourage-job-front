import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import validator from 'validator';
import { Gender } from '../../../constants/users';
import { FormSchema } from '../FormSchema';
import {
  BUSINESS_LINES,
  BusinessLineValue,
  CANDIDATE_ACCOMMODATIONS_FILTERS,
  CANDIDATE_ADMINISTRATIVE_SITUATIONS_FILTERS,
  CANDIDATE_GENDERS_FILTERS,
  CANDIDATE_HELP_WITH_FILTERS,
  CANDIDATE_PROFESSIONAL_SITUATIONS_FILTERS,
  CANDIDATE_RESOURCES_FILTERS,
  CANDIDATE_YES_NO_FILTERS,
  CandidateAccommodation,
  CandidateAdministrativeSituation,
  CandidateHelpWithValue,
  CandidateProfessionalSituation,
  CandidateResource,
  CandidateYesNoValue,
  HEARD_ABOUT_FILTERS,
  HeardAboutValue,
} from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formCandidateContact: FormSchema<{
  workerFirstName: string;
  workerLastName: string;
  structure: string;
  workerPosition: string;
  workerEmail: string;
  workerPhone: string;
  firstName: string;
  lastName: string;
  helpWith: FilterConstant<CandidateHelpWithValue>[];
  gender: Gender;
  birthDate: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  registeredUnemploymentOffice: CandidateYesNoValue;
  administrativeSituation: CandidateAdministrativeSituation;
  workingRight: CandidateYesNoValue;
  accommodation: CandidateAccommodation;
  professionalSituation: CandidateProfessionalSituation;
  resources: CandidateResource;
  domiciliation: CandidateYesNoValue;
  socialSecurity: CandidateYesNoValue;
  handicapped: CandidateYesNoValue;
  bankAccount: CandidateYesNoValue;
  businessLines: FilterConstant<BusinessLineValue>;
  description: string;
  heardAbout: HeardAboutValue;
  diagnostic: string;
  contactWithCoach: boolean;
}> = {
  id: 'form-candidate-contact',
  fields: [
    {
      id: 'workerFirstName',
      name: 'workerFirstName',
      component: 'text-input',
      title: 'Votre prénom*',
      isRequired: true,
      maxLength: 80,
    },
    {
      id: 'workerLastName',
      name: 'workerLastName',
      component: 'text-input',
      title: 'Votre nom*',
      isRequired: true,
      maxLength: 80,
    },
    {
      id: 'structure',
      name: 'structure',
      component: 'text-input',
      title: 'Votre structure* (Association, CCAS, EDAS, etc.)',
      isRequired: true,
      maxLength: 60,
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
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => validator.isEmail(fieldValue),
          message: 'Adresse e-mail invalide',
        },
      ],
    },
    {
      id: 'workerPhone',
      name: 'workerPhone',
      component: 'tel-input',
      title: 'Votre numéro de téléphone portable*',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => isValidPhoneNumber(fieldValue, 'FR'),
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'firstName',
      name: 'firstName',
      component: 'text-input',
      title: 'Prénom de la personne que vous souhaitez orienter*',
      isRequired: true,
      maxLength: 80,
    },
    {
      id: 'lastName',
      name: 'lastName',
      component: 'text-input',
      title: 'Son nom*',
      isRequired: true,
      maxLength: 80,
    },
    {
      id: 'helpWith',
      name: 'helpWith',
      component: 'select',
      isMulti: true,
      options: CANDIDATE_HELP_WITH_FILTERS,
      title: "Dans quel(s) domaine(s) l'accompagnez-vous ?*",
      isRequired: true,
    },
    {
      id: 'gender',
      name: 'gender',
      component: 'select-simple',
      options: CANDIDATE_GENDERS_FILTERS,
      title: 'Son sexe*',
      isRequired: true,
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
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => validator.isPostalCode(fieldValue, 'FR'),
          message: 'Code postal non valide',
        },
      ],
    },
    {
      id: 'city',
      name: 'city',
      component: 'text-input',
      title: 'Sa ville*',
      isRequired: true,
    },
    {
      id: 'phone',
      name: 'phone',
      component: 'tel-input',
      title:
        "Son téléphone portable (nous inviterons la personne à une réunion d'information)*",
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => isValidPhoneNumber(fieldValue, 'FR'),
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      component: 'text-input',
      title: 'Son adresse mail',
      rules: [
        {
          method: (fieldValue) => {
            return (
              !fieldValue ||
              fieldValue.length === 0 ||
              validator.isEmail(fieldValue)
            );
          },

          message: 'Adresse e-mail invalide',
        },
      ],
    },
    {
      id: 'registeredUnemploymentOffice',
      name: 'registeredUnemploymentOffice',
      component: 'select-simple',
      options: CANDIDATE_YES_NO_FILTERS,
      title:
        'La personne que vous souhaitez orienter est-elle inscrite au Pôle Emploi ?*',
      isRequired: true,
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
      isRequired: true,
    },
    {
      id: 'accommodation',
      name: 'accommodation',
      component: 'select-simple',
      options: CANDIDATE_ACCOMMODATIONS_FILTERS,
      title: "Quelle est sa situation d'hébergement ?*",
      isRequired: true,
    },
    {
      id: 'professionalSituation',
      name: 'professionalSituation',
      component: 'select-simple',
      options: CANDIDATE_PROFESSIONAL_SITUATIONS_FILTERS,
      title: 'Quelle est sa situation professionnelle ?*',
      isRequired: true,
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
      isRequired: true,
    },
    {
      id: 'socialSecurity',
      name: 'socialSecurity',
      component: 'select-simple',
      options: CANDIDATE_YES_NO_FILTERS,
      title:
        'A-t-elle des droits ouverts à la sécurité sociale ? (régime général, CSS, CMU, AME, etc.)*',
      isRequired: true,
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
      isRequired: true,
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
      isRequired: true,
    },
    {
      id: 'heardAbout',
      name: 'heardAbout',
      component: 'select-simple',
      options: HEARD_ABOUT_FILTERS,
      title: 'Comment avez-vous connu LinkedOut ?*',
      isRequired: true,
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
};
