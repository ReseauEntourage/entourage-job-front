import { BUSINESS_LINES, CONTRACTS, USER_ROLES } from 'src/constants';
import { FORMATTED_DEPARTMENTS } from 'src/constants/departements';
import Api from 'src/Axios';

export default {
  id: 'form-offer',
  fields: [
    {
      id: 'isPublic',
      name: 'isPublic',
      component: 'checkbox',
      title: 'Adresser cette offre à tous les candidats',
    },
    {
      id: 'candidatesId',
      name: 'candidatesId',
      isMulti: true,
      type: 'text',
      dynamicTitle: (getValue) => {
        return getValue('isPublic') === true
          ? "Souhaitez-vous suggérer l'offre à certains candidats ?"
          : "Renseignez le(s) candidat(s) à qui adresser l'offre";
      },
      placeholder: 'Tapez un candidat',
      component: 'select-request-async',
      disable: (getValue) => {
        return getValue('isPublic') === true;
      },
      hide: (getValue) => {
        return getValue('isPublic') === true;
      },
      loadOptions: (inputValue, callback) => {
        Api.get('/user/search/candidates', {
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
    },
    {
      id: 'title',
      name: 'title',
      component: 'input',
      type: 'text',
      title: 'Intitulé du poste proposé*',
    },
    /* {
      id: 'message',
      name: 'message',
      component: 'textarea',
      type: 'text',
      title: 'Message personnalisé pour le(s) candidat(s)',
      disable: (getValue) => {
        return getValue('isPublic') === true;
      },
      hide: (getValue) => {
        return getValue('isPublic') === true;
      },
    }, */
    {
      id: 'company',
      name: 'company',
      component: 'input',
      type: 'text',
      title: 'Nom de votre entreprise*',
    },
    {
      id: 'recruiterFirstName',
      name: 'recruiterFirstName',
      component: 'input',
      type: 'text',
      title: 'Votre prénom*',
    },
    {
      id: 'recruiterName',
      name: 'recruiterName',
      component: 'input',
      type: 'text',
      title: 'Votre nom*',
    },
    {
      id: 'recruiterPosition',
      name: 'recruiterPosition',
      component: 'input',
      type: 'text',
      title: 'Votre fonction*',
    },
    {
      id: 'recruiterMail',
      name: 'recruiterMail',
      component: 'input',
      type: 'email',
      title: 'Votre adresse mail*',
    },
    {
      id: 'recruiterPhone',
      name: 'recruiterPhone',
      component: 'input',
      type: 'tel',
      title: 'Votre téléphone',
    },
    {
      id: 'businessLines',
      name: 'businessLines',
      title: "Secteur d'activité*",
      placeholder: "Sélectionnez les secteurs d'activité",
      component: 'select-request',
      isMulti: true,
      options: BUSINESS_LINES,
      hidden: true,
      disabled: true,
    },
    {
      id: 'locations',
      name: 'locations',
      action: 'Ajouter une adresse',
      component: 'multiple-fields',
      childWidths: ['1-3@m', 'expand'],
      fields: [
        {
          id: 'department',
          name: 'department',
          title: 'Département du lieu de travail*',
          component: 'select-request',
          options: FORMATTED_DEPARTMENTS,
        },
        {
          id: 'address',
          name: 'address',
          title: 'Adresse du lieu de travail*',
          component: 'input',
          type: 'text',
        },
      ],
    },
    {
      id: 'companyDescription',
      name: 'companyDescription',
      component: 'textarea',
      type: 'text',
      title: "Si vous le souhaitez, présentez l'entreprise en quelques mots",
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      type: 'text',
      title: 'Descriptif des missions proposées*',
    },
    {
      id: 'otherInfoLabel',
      title: 'Informations complémentaires importantes',
      component: 'heading',
    },
    {
      id: 'info1',
      component: 'fieldgroup',
      childWidths: ['expand', '1-3'],
      fields: [
        {
          id: 'workingHours',
          name: 'workingHours',
          component: 'input',
          type: 'text',
          title: 'Jours et horaires de travail',
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
      id: 'info2',
      component: 'fieldgroup',
      childWidths: ['expand', '1-3'],
      fields: [
        {
          id: 'salary',
          name: 'salary',
          component: 'input',
          type: 'text',
          title: 'Salaire et compléments',
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
      id: 'otherInfo',
      name: 'otherInfo',
      component: 'textarea',
      type: 'text',
      title: 'Autres précisions sur votre besoin',
    },
    {
      id: 'contract',
      name: 'contract',
      component: 'select',
      options: [{ value: -1, label: 'Choisissez un contrat' }, ...CONTRACTS],
      title: 'Type de contrat*',
      fieldsToReset: ['endOfContract'],
    },
    /*    {
      id: 'startEndContract',
      component: 'fieldgroup',
      childWidths: ['expand', 'expand', '1-4@m'],
      fields: [
        {
          id: 'startOfContract',
          name: 'startOfContract',
          title: 'Date de début de contrat',
          component: 'datepicker',
          min: moment().format('YYYY-MM-DD'),
        },
        {
          id: 'endOfContract',
          name: 'endOfContract',
          title: 'Date de fin de contrat',
          component: 'datepicker',
          min: moment().format('YYYY-MM-DD'),
          disable: (getValue) => {
            const contract = findContractType(getValue('contract'));
            return !contract || !contract.end;
          },
        },
      ],
    },
    {
      id: 'numberOfPositions',
      name: 'numberOfPositions',
      component: 'input',
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
    }, */
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
  rules: [
    {
      field: 'candidatesId',
      args: [],
      method: (fieldValue, state) => {
        return !fieldValue && state.isPublic === false;
      },
      validWhen: false,
      message: 'Obligatoire si offre privée',
    },
    {
      field: 'title',
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
      field: 'company',
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
      field: 'recruiterFirstName',
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
      field: 'recruiterName',
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
      field: 'recruiterPosition',
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
      field: 'recruiterMail',
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
      field: 'recruiterMail',
      method: 'isEmail',
      validWhen: true,
      message: 'Invalide',
    },
    /*  {
      field: 'recruiterPhone',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    }, */
    {
      field: 'recruiterPhone',
      method: 'isLength',
      args: [
        {
          min: 10,
          max: 13,
        },
      ],
      validWhen: true,
      message: 'Invalide',
    },
    /*  {
      field: 'businessLines',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    }, */
    {
      field: 'locations',
      method: (fieldValue, state) => {
        const keys = ['department', 'address'];
        return (
          !keys.every((key) => {
            return state[key];
          }) &&
          (fieldValue.length === 0 ||
            fieldValue.some((fields) => {
              return (
                !keys.every((key) => {
                  return Object.keys(fields).includes(key);
                }) ||
                Object.keys(fields).some((key) => {
                  return !fields[key]?.trim();
                })
              );
            }))
        );
      },
      args: [],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'department',
      method: (fieldValue, state) => {
        return !state.locations && !fieldValue?.trim();
      },
      args: [],
      validWhen: false,
      message: 'Obligatoire',
    },
    {
      field: 'address',
      method: (fieldValue, state) => {
        return !state.locations && !fieldValue?.trim();
      },
      args: [],
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
      field: 'contract',
      method: 'isEmpty',
      args: [
        {
          ignore_whitespace: true,
        },
      ],
      validWhen: false,
      message: 'Obligatoire',
    },
    /* {
      field: 'endOfContract',
      method: (fieldValue, state) => {
        return (
          !!fieldValue &&
          !!state.startOfContract &&
          moment(fieldValue, 'YYYY-MM-DD').isBefore(
            moment(state.startOfContract, 'YYYY-MM-DD')
          )
        );
      },
      args: [],
      validWhen: false,
      message: 'Date antérieure à la date de début',
    }, */
  ],
};

export const adminMutations = [
  {
    fieldId: 'candidatesId',
    props: [
      {
        propName: 'loadOptions',
        value: (inputValue, callback) => {
          Api.get('/user/search', {
            params: {
              query: inputValue,
              role: USER_ROLES.CANDIDAT,
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
];
