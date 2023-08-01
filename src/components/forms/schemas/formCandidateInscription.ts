import _ from 'lodash';
import moment from 'moment';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { Api } from 'src/api';
import 'moment/locale/fr';
import { ANTENNE_INFO } from 'src/constants';
import { FormSchema } from '../FormSchema';

export const formCandidateInscription: FormSchema = {
  id: 'form-candidate-inscription',
  fields: [
    {
      id: 'generalInformation',
      name: 'generalInformation',
      title: 'Informations pour accéder au programme LinkedOut',
      component: 'heading',
    },
    {
      id: 'location',
      name: 'location',
      component: 'select-simple',
      showLabel: true,
      title:
        'Êtes-vous domicilié dans l’une des villes / départements suivants? *',
      options: [
        {
          label: 'Seine-Saint-Denis (93)',
          value: '93',
        },
        {
          label: 'Paris (75)',
          value: '75',
        },
        {
          label: 'Hauts-De-Seine (92)',
          value: '92',
        },
        {
          label: 'Rennes et sa région (35)',
          value: '35',
        },
        {
          label: 'Lorient et sa région (56)',
          value: '56',
        },
        {
          label: 'Lille et sa région (59)',
          value: '59',
        },
        {
          label: 'Lyon et sa région (69)',
          value: '69',
        },
        {
          label: 'Autre',
          value: 'other',
        },
      ],
      fieldsToReset: ['infoCo'],
    },
    {
      id: 'birthdateWorkingRight',
      name: 'birthdateWorkingRight',
      component: 'fieldgroup',
      fields: [
        {
          id: 'birthdate',
          name: 'birthdate',
          component: 'datepicker',
          title: 'Quelle est votre date de naissance? *',
        },
        {
          id: 'workingRight',
          name: 'workingRight',
          title: 'Avez-vous le droit de travailler en France? *',
          component: 'select-simple',
          showLabel: true,
          options: [
            {
              label: 'Oui',
              value: 'yes',
            },
            {
              label: 'Non',
              value: 'no',
            },
            {
              label: 'Je ne sais pas',
              value: 'dont_know',
            },
          ],
        },
      ],
    },
    {
      id: 'personalInformation',
      name: 'personalInformation',
      title: 'Informations personnelles',
      component: 'heading',
    },
    {
      id: 'candidateInfo',
      name: 'candidateInfo',
      component: 'fieldgroup',
      fields: [
        {
          id: 'firstName',
          name: 'firstName',
          component: 'text-input',
          title: 'Votre prénom *',
          placeholder: 'Ecrivez votre prénom',
          showLabel: true,
        },
        {
          id: 'lastName',
          name: 'lastName',
          title: 'Votre nom *',
          component: 'text-input',
          placeholder: 'Ecrivez votre nom',
          showLabel: true,
        },
      ],
    },
    {
      id: 'candidateContact',
      name: 'candidateContact',
      component: 'fieldgroup',
      fields: [
        {
          id: 'phone',
          name: 'phone',
          title: 'Téléphone *',
          component: 'tel-input',
          placeholder: 'Ecrivez votre numéro de téléphone',
          showLabel: true,
        },
        {
          id: 'email',
          name: 'email',
          title: 'Adresse mail *',
          component: 'text-input',
          placeholder: 'Ecrivez votre adresse email',
          showLabel: true,
        },
      ],
    },
    {
      id: 'heardAbout',
      name: 'heardAbout',
      title: 'Comment avez-vous connu LinkedOut ? *',
      component: 'select-simple',
      showLabel: true,
      // TODO use already existing heard about
      options: [
        {
          label: 'LinkedIn',
          value: 'LinkedIn',
        },
        {
          label: 'Autres réseaux (facebook, twitter, instagram...)',
          value: 'socialNetworks',
        },
        {
          label: 'Association / travailleur social',
          value: 'association',
        },
        {
          label: 'Pôle emploi',
          value: 'poleEmploi',
        },
        {
          label: 'Le bouche à oreille',
          value: 'boucheAOreille',
        },
        {
          label: 'Télévision / radio',
          value: 'medias',
        },
        {
          label: 'Autre',
          value: 'other',
        },
      ],
    },
    {
      id: 'infoCoTitle',
      name: 'infoCoTitle',
      title: 'Prochaine étape : Nous rencontrer',
      component: 'heading',
      hide: (getValue, fieldOptions) => {
        const city = ANTENNE_INFO.find((antenne) => {
          return antenne.dpt === getValue('location');
        })?.city;
        const filteredOptions = fieldOptions?.infoCo?.find((fieldOption) => {
          return fieldOption.filterData === city;
        });
        if (!city?.length) {
          return true;
        }
        return !filteredOptions;
      },
    },
    {
      id: 'infoCoSubtitle',
      name: 'infoCoSubtitle',
      title: (getValue) => {
        const text =
          'Pour bien comprendre votre besoin et vous accompagner au mieux nous vous invitons dans nos bureaux';
        const address = ANTENNE_INFO.find((antenne) => {
          return antenne.dpt === getValue('location');
        })?.address;
        return `${text}${address ? ` au ${address}` : ''}`;
      },
      component: 'text',
      hide: (getValue, fieldOptions) => {
        const city = ANTENNE_INFO.find((antenne) => {
          return antenne.dpt === getValue('location');
        })?.city;
        const filteredOptions = fieldOptions?.infoCo?.find((fieldOption) => {
          return fieldOption.filterData === city;
        });
        if (!city?.length) {
          return true;
        }
        return !filteredOptions;
      },
    },
    {
      id: 'infoCo',
      name: 'infoCo',
      title:
        'Selectionnez la date de la prochaine réunion d’information à laquelle vous souhaitez participer :',
      component: 'radio-async',
      limit: 7,
      dynamicFilter: (getValue) => {
        return ANTENNE_INFO.find((antenne) => {
          return antenne.dpt === getValue('location');
        })?.city;
      },
      hide: (getValue, fieldOptions) => {
        if (!fieldOptions) {
          return false;
        }
        const city = ANTENNE_INFO.find((antenne) => {
          return antenne.dpt === getValue('location');
        })?.city;

        const filteredOptions = fieldOptions?.infoCo?.find((fieldOption) => {
          return fieldOption.filterData === city;
        });
        return !city?.length || !filteredOptions;
      },
      loadOptions: async (callback) => {
        const { data: campaigns } = await Api.getCampaigns();
        const noChoice = {
          inputId: `infoco-radio-nochoice`,
          label: 'Je ne suis pas disponible à ces dates',
          value: '',
        };
        const options = campaigns.map((record) => {
          return {
            inputId: `infoco-radio-${record.id}`,
            label: _.upperFirst(
              `${moment(record.time).format('dddd D MMMM [à] HH[h]mm')}`
            ),
            value: record.id,
            filterData: record.antenne,
          };
        });
        callback(options.length ? [...options, noChoice] : []);
      },
      errorMessage:
        'Il n’y a pas de réunion d’information organisée dans les prochains temps dans votre ville, nous allons vous recontacter rapidement',
    },
  ],
  rules: [
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
      field: 'email',
      isRequired: true,
    },
    {
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'Adresse e-mail invalide',
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
      field: 'workingRight',
      isRequired: true,
    },
    {
      field: 'workingRight',
      method: (value) => {
        return value !== 'no';
      },
      args: [],
      validWhen: true,
      message:
        'Vous devez avoir le droit de travailler en France pour participer au programme LinkedOut',
    },
    {
      field: 'heardAbout',
      isRequired: true,
    },
    {
      field: 'location',
      isRequired: true,
    },
    {
      field: 'location',
      method: (value) => {
        return value !== 'other';
      },
      args: [],
      validWhen: true,
      message:
        'Nous sommes désolée, le programme est disponible uniquement dans les villes /départements indiqués dans la liste.',
    },
    {
      field: 'birthdate',
      isRequired: true,
    },
    {
      field: 'birthdate',
      method: (value) => {
        const minBirtdate = new Date();
        minBirtdate.setFullYear(minBirtdate.getFullYear() - 18);
        const realBirthdate = new Date(value);
        return minBirtdate > realBirthdate;
      },
      validWhen: true,
      message:
        'Vous devez être majeur pour participer au programme. En attendant, vous pouvez contacter la Mission locale dont dépend votre commune.',
    },
    {
      field: 'birthdate',
      method: (value) => {
        const maxBirtdate = new Date('1900-01-01');
        const realBirthdate = new Date(value);
        return maxBirtdate < realBirthdate;
      },
      validWhen: true,
      message: 'Veuillez entrer une date valide.',
    },
  ],
};
