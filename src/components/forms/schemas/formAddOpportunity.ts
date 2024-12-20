import moment from 'moment';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { isAfter, isEmail } from 'validator';
import { FormSchema } from '../FormSchema';
import { Api } from 'src/api';
import {
  BUSINESS_LINES,
  BusinessLineValue,
  Contract,
  CONTRACTS,
} from 'src/constants';
import { Department, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { USER_ROLES } from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';
import { findConstantFromValue } from 'src/utils';

export const formAddPrivateOpportunity: FormSchema<{
  message: string;
  title: string;
  company: string;
  companyDescription: string;
  locations: { department: FilterConstant<Department>; address: string }[];
  department: FilterConstant<Department>;
  address: string;
  recruiterFirstName: string;
  recruiterName: string;
  recruiterPosition: string;
  recruiterMail: string;
  recruiterPhone: string;
  description: string;
  contract: Contract;
  workingHours: string;
  isPartTime: boolean;
  salary: string;
  driversLicense: boolean;
  otherInfo: string;
  openNewForm: boolean;
}> = {
  id: 'form-add-private-offer',
  fields: [
    {
      id: 'generalInformation',
      name: 'generalInformation',
      title: 'Informations générales',
      component: 'heading',
    },
    {
      id: 'message',
      name: 'message',
      component: 'textarea',
      title: 'Message personnalisé pour le(s) candidat(s)',
      showLabel: true,
    },
    {
      id: 'title',
      name: 'title',
      component: 'text-input',
      title: 'Intitulé du poste proposé*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'company',
      name: 'company',
      component: 'text-input',
      title: 'Nom de votre entreprise*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'companyDescription',
      name: 'companyDescription',
      component: 'textarea',
      title: "Si vous le souhaitez, présentez l'entreprise en quelques mots",
      showLabel: true,
    },
    {
      id: 'locations',
      name: 'locations',
      action: 'Ajouter une adresse',
      component: 'multiple-fields',
      fields: [
        {
          id: 'department',
          name: 'department',
          title: 'Département du lieu de travail*',
          component: 'select',
          isMulti: false,
          options: DEPARTMENTS_FILTERS,
          isRequired: true,
          showLabel: true,
        },
        {
          id: 'address',
          name: 'address',
          title: 'Adresse du lieu de travail*',
          component: 'text-input',
          isRequired: true,
          showLabel: true,
        },
      ],
    },
    {
      id: 'recruiterInformation',
      name: 'recruiterInformation',
      title: 'Coordonnées du recruteur',
      component: 'heading',
    },
    {
      id: 'recruiterFirstName',
      name: 'recruiterFirstName',
      component: 'text-input',
      title: 'Votre prénom*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'recruiterName',
      name: 'recruiterName',
      component: 'text-input',
      title: 'Votre nom*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'recruiterPosition',
      name: 'recruiterPosition',
      component: 'text-input',
      title: 'Votre fonction*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'recruiterMail',
      name: 'recruiterMail',
      component: 'text-input',
      type: 'email',
      title: 'Votre adresse mail*',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => isEmail(fieldValue),
          message: 'Invalide',
        },
      ],
      showLabel: true,
    },
    {
      id: 'recruiterPhone',
      name: 'recruiterPhone',
      component: 'tel-input',
      title: 'Votre téléphone portable',
      rules: [
        {
          method: (fieldValue) =>
            !fieldValue ||
            fieldValue.length === 0 ||
            isValidPhoneNumber(fieldValue, 'FR'),
          message: 'Numéro de téléphone invalide',
        },
      ],
      showLabel: true,
    },
    {
      id: 'offerDetails',
      name: 'offerDetails',
      title: "Détails de l'offre",
      component: 'heading',
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Descriptif des missions proposées*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'contract',
      name: 'contract',
      component: 'select-simple',
      options: CONTRACTS,
      title: 'Type de contrat*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'info1',
      name: 'info1',
      component: 'fieldgroup',
      fields: [
        {
          id: 'workingHours',
          name: 'workingHours',
          component: 'text-input',
          title: 'Jours et horaires de travail',
          showLabel: true,
        },
        {
          id: 'isPartTime',
          name: 'isPartTime',
          component: 'checkbox',
          title: 'Temps partiel',
          showLabel: true,
        },
      ],
    },
    {
      id: 'info2',
      name: 'info2',
      component: 'fieldgroup',
      fields: [
        {
          id: 'salary',
          name: 'salary',
          component: 'text-input',
          title: 'Salaire et compléments',
          showLabel: true,
        },
        {
          id: 'driversLicense',
          name: 'driversLicense',
          component: 'checkbox',
          title: 'Permis de conduire',
          showLabel: true,
        },
      ],
    },
    {
      id: 'otherInfo',
      name: 'otherInfo',
      component: 'textarea',
      title: 'Autres précisions sur votre besoin',
      showLabel: true,
    },
    {
      id: 'disclaimer',
      name: 'disclaimer',
      component: 'text',
      title:
        "Les offres font l'objet d'une validation par Entourage Pro avant d'être transmises aux candidats",
    },
    {
      id: 'openNewForm',
      name: 'openNewForm',
      component: 'checkbox',
      title:
        'Vous avez un autre poste à proposer ? Dupliquez cette offre pour la publier plus rapidement',
      showLabel: true,
    },
  ],
};

export const formAddPublicOpportunity: FormSchema<{
  title: string;
  company: string;
  companyDescription: string;
  locations: { department: FilterConstant<Department>; address: string }[];
  department: FilterConstant<Department>;
  address: string;
  recruiterFirstName: string;
  recruiterName: string;
  recruiterPosition: string;
  recruiterMail: string;
  recruiterPhone: string;
  description: string;
  contract: Contract;
  workingHours: string;
  isPartTime: boolean;
  salary: string;
  driversLicense: boolean;
  otherInfo: string;
  openNewForm: boolean;
}> = {
  id: 'form-add-public-offer',
  fields: [
    {
      id: 'generalInformation',
      name: 'generalInformation',
      title: 'Informations générales',
      component: 'heading',
    },
    {
      id: 'title',
      name: 'title',
      component: 'text-input',
      title: 'Intitulé du poste proposé*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'company',
      name: 'company',
      component: 'text-input',
      title: 'Nom de votre entreprise*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'companyDescription',
      name: 'companyDescription',
      component: 'textarea',
      title: "Si vous le souhaitez, présentez l'entreprise en quelques mots",
      showLabel: true,
    },
    {
      id: 'locations',
      name: 'locations',
      action: 'Ajouter une adresse',
      component: 'multiple-fields',
      fields: [
        {
          id: 'department',
          name: 'department',
          title: 'Département du lieu de travail*',
          component: 'select',
          isMulti: false,
          options: DEPARTMENTS_FILTERS,
          isRequired: true,
          showLabel: true,
        },
        {
          id: 'address',
          name: 'address',
          title: 'Adresse du lieu de travail*',
          component: 'text-input',
          isRequired: true,
          showLabel: true,
        },
      ],
    },
    {
      id: 'recruiterInformation',
      name: 'recruiterInformation',
      title: 'Coordonnées du recruteur',
      component: 'heading',
    },
    {
      id: 'recruiterFirstName',
      name: 'recruiterFirstName',
      component: 'text-input',
      title: 'Votre prénom*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'recruiterName',
      name: 'recruiterName',
      component: 'text-input',
      title: 'Votre nom*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'recruiterPosition',
      name: 'recruiterPosition',
      component: 'text-input',
      title: 'Votre fonction*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'recruiterMail',
      name: 'recruiterMail',
      component: 'text-input',
      type: 'email',
      title: 'Votre adresse mail*',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => isEmail(fieldValue),
          message: 'Invalide',
        },
      ],
      showLabel: true,
    },
    {
      id: 'recruiterPhone',
      name: 'recruiterPhone',
      component: 'tel-input',
      title: 'Votre téléphone portable',
      rules: [
        {
          method: (fieldValue) =>
            !fieldValue ||
            fieldValue.length === 0 ||
            isValidPhoneNumber(fieldValue, 'FR'),
          message: 'Numéro de téléphone invalide',
        },
      ],
      showLabel: true,
    },
    {
      id: 'offerDetails',
      name: 'offerDetails',
      title: "Détails de l'offre",
      component: 'heading',
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Descriptif des missions proposées*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'contract',
      name: 'contract',
      component: 'select-simple',
      options: CONTRACTS,
      title: 'Type de contrat*',
      isRequired: true,
      showLabel: true,
    },
    {
      id: 'info1',
      name: 'info1',
      component: 'fieldgroup',
      fields: [
        {
          id: 'workingHours',
          name: 'workingHours',
          component: 'text-input',
          title: 'Jours et horaires de travail',
          showLabel: true,
        },
        {
          id: 'isPartTime',
          name: 'isPartTime',
          component: 'checkbox',
          title: 'Temps partiel',
          showLabel: true,
        },
      ],
    },
    {
      id: 'info2',
      name: 'info2',
      component: 'fieldgroup',
      fields: [
        {
          id: 'salary',
          name: 'salary',
          component: 'text-input',
          title: 'Salaire et compléments',
          showLabel: true,
        },
        {
          id: 'driversLicense',
          name: 'driversLicense',
          component: 'checkbox',
          title: 'Permis de conduire',
          showLabel: true,
        },
      ],
    },
    {
      id: 'otherInfo',
      name: 'otherInfo',
      component: 'textarea',
      title: 'Autres précisions sur votre besoin',
      showLabel: true,
    },
    {
      id: 'disclaimer',
      name: 'disclaimer',
      component: 'text',
      title:
        "Les offres font l'objet d'une validation par Entourage Pro avant d'être transmises aux candidats",
    },
    {
      id: 'openNewForm',
      name: 'openNewForm',
      component: 'checkbox',
      title:
        'Vous avez un autre poste à proposer ? Dupliquez cette offre pour la publier plus rapidement',
      showLabel: true,
    },
  ],
};

export const formAddOpportunityAsAdmin: FormSchema<{
  isPublic: boolean;
  candidatesIds: FilterConstant<string>[];
  shouldSendNotifications: boolean;
  message: string;
  title: string;
  company: string;
  companyDescription: string;
  department: FilterConstant<Department>;
  address: string;
  recruiterFirstName: string;
  recruiterName: string;
  recruiterPosition: string;
  recruiterMail: string;
  recruiterPhone: string;
  contactMail: string;
  businessLines: FilterConstant<BusinessLineValue>[];
  description: string;
  contract: Contract;
  startOfContract: string;
  endOfContract: string;
  workingHours: string;
  isPartTime: boolean;
  salary: string;
  driversLicense: boolean;
  otherInfo: string;
  openNewForm: boolean;
}> = {
  id: 'form-add-offer-admin',
  fields: [
    {
      id: 'generalInformation',
      name: 'generalInformation',
      title: 'Informations générales',
      component: 'heading',
    },
    {
      id: 'isPublic',
      name: 'isPublic',
      component: 'checkbox',
      title: 'Adresser cette offre à tous les candidats',
    },
    {
      id: 'candidatesIds',
      name: 'candidatesIds',
      isMulti: true,
      title: (getValue) => {
        return getValue('isPublic') === true
          ? "Souhaitez-vous suggérer l'offre à certains candidats ?"
          : "Renseignez le(s) candidat(s) à qui adresser l'offre*";
      },
      component: 'select-async',
      loadOptions: (callback, inputValue) => {
        Api.getUsersSearch({
          params: {
            query: inputValue,
            role: [USER_ROLES.CANDIDATE],
          },
        })
          .then(({ data }) => {
            return data.map((u) => {
              return {
                value: u.id,
                label: `${u.firstName} ${u.lastName}`,
              };
            });
          })
          .then(callback);
      },
      rules: [
        {
          method: (fieldValue, fieldValues) =>
            fieldValues.isPublic || (fieldValue && fieldValue.length > 0),
          message: 'Obligatoire si offre privée',
        },
      ],
    },
    {
      id: 'shouldSendNotifications',
      name: 'shouldSendNotifications',
      component: 'checkbox',
      title: 'Envoyer une notification au(x) binôme(s)',
    },
    {
      id: 'message',
      name: 'message',
      component: 'textarea',
      title: 'Message personnalisé pour le(s) candidat(s)',
      disable: (getValue) => {
        return getValue('isPublic') === true;
      },
      hide: (getValue) => {
        return getValue('isPublic') === true;
      },
    },
    {
      id: 'title',
      name: 'title',
      component: 'text-input',
      title: 'Intitulé du poste proposé*',
      isRequired: true,
    },
    {
      id: 'company',
      name: 'company',
      component: 'text-input',
      title: "Nom de l'entreprise*",
      isRequired: true,
    },
    {
      id: 'companyDescription',
      name: 'companyDescription',
      component: 'textarea',
      title: "Présentation de l'entreprise",
    },
    {
      id: 'locations',
      name: 'locations',
      component: 'fieldgroup',
      fields: [
        {
          id: 'department',
          name: 'department',
          title: 'Département du lieu de travail*',
          component: 'select',
          isMulti: false,
          options: DEPARTMENTS_FILTERS,
          isRequired: true,
        },
        {
          id: 'address',
          name: 'address',
          title: 'Adresse du lieu de travail*',
          component: 'text-input',
          isRequired: true,
        },
      ],
    },
    {
      id: 'recruiterInformation',
      name: 'recruiterInformation',
      title: 'Coordonnées du recruteur',
      component: 'heading',
    },
    {
      id: 'recruiterFirstName',
      name: 'recruiterFirstName',
      component: 'text-input',
      title: 'Prénom*',
      isRequired: true,
    },
    {
      id: 'recruiterName',
      name: 'recruiterName',
      component: 'text-input',
      title: 'Nom*',
      isRequired: true,
    },
    {
      id: 'recruiterPosition',
      name: 'recruiterPosition',
      component: 'text-input',
      title: 'Fonction*',
      isRequired: true,
    },
    {
      id: 'recruiterMail',
      name: 'recruiterMail',
      component: 'text-input',
      type: 'email',
      title: 'Adresse mail*',
      isRequired: true,
      rules: [
        {
          method: (fieldValue) => isEmail(fieldValue),

          message: 'Invalide',
        },
      ],
    },
    {
      id: 'recruiterPhone',
      name: 'recruiterPhone',
      component: 'tel-input',
      title: 'Téléphone portable',
      rules: [
        {
          method: (fieldValue) =>
            !fieldValue ||
            fieldValue.length === 0 ||
            isValidPhoneNumber(fieldValue, 'FR'),
          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'contactMail',
      name: 'contactMail',
      component: 'text-input',
      type: 'email',
      title: 'Adresse mail du recruteur si intermédiaire',
      rules: [
        {
          method: (fieldValue) =>
            !fieldValue || fieldValue.length === 0 || isEmail(fieldValue),
          message: 'Invalide',
        },
      ],
    },
    {
      id: 'businessLines',
      name: 'businessLines',
      title: 'Familles de métiers',
      component: 'select',
      isMulti: true,
      options: BUSINESS_LINES,
    },
    {
      id: 'offerDetails',
      name: 'offerDetails',
      title: "Détails de l'offre",
      component: 'heading',
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Descriptif des missions proposées*',
      isRequired: true,
    },
    {
      id: 'contract',
      name: 'contract',
      component: 'select-simple',
      options: CONTRACTS,
      title: 'Type de contrat*',
      fieldsToReset: ['endOfContract'],
      isRequired: true,
    },
    {
      id: 'startEndContract',
      name: 'startEndContract',
      component: 'fieldgroup',
      fields: [
        {
          id: 'startOfContract',
          name: 'startOfContract',
          title: 'Date de début de contrat',
          component: 'datepicker',
        },
        {
          id: 'endOfContract',
          name: 'endOfContract',
          title: 'Date de fin de contrat',
          component: 'datepicker',
          disable: (getValue) => {
            const contract = findConstantFromValue(
              getValue('contract'),
              CONTRACTS
            );
            return !contract || !contract.end;
          },
          rules: [
            {
              method: (fieldValue, fieldValues) =>
                !fieldValue ||
                !fieldValues.startOfContract ||
                isAfter(
                  fieldValue,
                  moment(fieldValues.startOfContract).format('YYYY-MM-DD')
                ),
              message: 'Date antérieure à la date de début',
            },
          ],
        },
      ],
    },
    {
      id: 'info1',
      name: 'info1',
      component: 'fieldgroup',
      fields: [
        {
          id: 'workingHours',
          name: 'workingHours',
          component: 'text-input',
          maxLength: 255,
          title: 'Jours et horaires de travail',
        },
        {
          id: 'isPartTime',
          name: 'isPartTime',
          component: 'checkbox',
          title: 'Temps partiel',
        },
      ],
    },
    {
      id: 'info2',
      name: 'info2',
      component: 'fieldgroup',
      fields: [
        {
          id: 'salary',
          name: 'salary',
          component: 'text-input',
          maxLength: 255,
          title: 'Salaire et compléments',
        },
        {
          id: 'driversLicense',
          name: 'driversLicense',
          component: 'checkbox',
          title: 'Permis de conduire',
        },
      ],
    },
    {
      id: 'otherInfo',
      name: 'otherInfo',
      component: 'textarea',
      title: 'Autres précisions sur le besoin',
    },
    {
      id: 'openNewForm',
      name: 'openNewForm',
      component: 'checkbox',
      title:
        'Vous avez un autre poste à proposer ? Dupliquez cette offre pour la publier plus rapidement',
    },
  ],
};
