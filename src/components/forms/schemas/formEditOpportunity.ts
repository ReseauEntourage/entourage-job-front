import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import isEmail from 'validator/lib/isEmail';
import { FormSchema } from '../FormSchema';
import { Api } from 'src/api';
import { BUSINESS_LINES, CONTRACTS, FilterConstant } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { USER_ROLES } from 'src/constants/users';
import { findConstantFromValue } from 'src/utils';
import validator from "validator";

export const formEditOpportunity: FormSchema = {
  id: 'form-offer',
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
      disable: (getValue) => {
        return getValue('isPublic') === true;
      },
      hide: (getValue) => {
        return getValue('isPublic') === true;
      },
      loadOptions: (callback, inputValue) => {
        Api.getUsersSearchCandidates({
          params: {
            query: inputValue,
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
          method: (fieldValue, fieldValues) => {
            return (
              !!fieldValues.isPublic || (fieldValue && fieldValue.length > 0)
            );
          },
          message: 'Obligatoire si offre privée',
        },
      ],
    },
    {
      id: 'shouldSendNotifications',
      name: 'shouldSendNotifications',
      component: 'checkbox',
      hidden: true,
      disabled: true,
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
      title: 'Nom de votre entreprise*',
      isRequired: true,
    },
    {
      id: 'companyDescription',
      name: 'companyDescription',
      component: 'textarea',
      title: "Si vous le souhaitez, présentez l'entreprise en quelques mots",
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
      title: 'Votre prénom*',
      isRequired: true,
    },
    {
      id: 'recruiterName',
      name: 'recruiterName',
      component: 'text-input',
      title: 'Votre nom*',
      isRequired: true,
    },
    {
      id: 'recruiterPosition',
      name: 'recruiterPosition',
      component: 'text-input',
      title: 'Votre fonction*',
      isRequired: true,
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
          method: (fieldValue) => validator.isEmail(fieldValue),

          message: 'Invalide',
        },
      ],
    },
    {
      id: 'recruiterPhone',
      name: 'recruiterPhone',
      component: 'tel-input',
      title: 'Votre téléphone portable',
      rules: [
        {
          method: (fieldValue) => {
            return (
              !fieldValue ||
              fieldValue.length === 0 ||
              isValidPhoneNumber(fieldValue, 'FR')
            );
          },

          message: 'Numéro de téléphone invalide',
        },
      ],
    },
    {
      id: 'contactMail',
      name: 'contactMail',
      hidden: true,
      disabled: true,
      component: 'text-input',
      type: 'email',
      title: 'Adresse mail du recruteur si intermédiaire',
      rules: [
        {
          // TODO Put trim on all fields
          method: (fieldValue) => {
            return !fieldValue.trim() || isEmail(fieldValue);
          },
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
      hidden: true,
      disabled: true,
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
      hidden: true,
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
              getValue('contract') as string,
              CONTRACTS
            );
            return !contract || !contract.end;
          },
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
      title: 'Autres précisions sur votre besoin',
    },
    /*
      {
        id: 'numberOfPositions',
        name: 'numberOfPositions',
        component: 'text-input',
        type: 'number',
        min: 1,
        title: 'Nombre de postes disponibles sur cette offre',
      },
      {
        id: 'beContacted',
        name: 'beContacted',
        component: 'checkbox',
        title:
          "Souhaitez-vous qu'un référent LinkedOut échange avec vous sur votre projet de recrutement inclusif\xa0?",
      },
    */
    {
      id: 'disclaimer',
      name: 'disclaimer',
      component: 'text',
      title:
        "Les offres font l'objet d'une validation par LinkedOut avant d'être transmises aux candidats",
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

export const adminMutations = [
  {
    fieldId: 'candidatesIds',
    props: [
      {
        propName: 'loadOptions',
        value: (inputValue, callback) => {
          Api.getUsersSearchCandidates({
            params: {
              query: inputValue,
              role: USER_ROLES.CANDIDATE,
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
      },
      {
        propName: 'disable',
        value: () => {
          return false;
        },
      },
      {
        propName: 'hide',
        value: () => {
          return false;
        },
      },
    ],
  },
  {
    fieldId: 'businessLines',
    props: [
      {
        propName: 'hidden',
        value: false,
      },
      {
        propName: 'disabled',
        value: false,
      },
    ],
  },
  {
    fieldId: 'contactMail',
    props: [
      {
        propName: 'hidden',
        value: false,
      },
      {
        propName: 'disabled',
        value: false,
      },
    ],
  },
];
