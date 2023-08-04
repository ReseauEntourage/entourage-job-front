import _ from 'lodash';
import moment from 'moment';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { Api } from 'src/api';
import 'moment/locale/fr';
import {
  ANTENNE_INFO,
  CANDIDATE_YES_NO,
  CANDIDATE_YES_NO_FILTERS,
  HEARD_ABOUT_FILTERS,
} from 'src/constants';
import { FormSchema } from '../FormSchema';
import validator from 'validator';

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
      isRequired: true,
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
      rules: [
        {
          method: (value) => value !== CANDIDATE_YES_NO.NO,

          message:
            'Vous devez avoir le droit de travailler en France pour participer au programme LinkedOut',
        },
      ],
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
          isRequired: true,
          rules: [
            {
              method: (value: string) => {
                const minBirthdate = new Date();
                minBirthdate.setFullYear(minBirthdate.getFullYear() - 18);
                const realBirthdate = new Date(value);
                return minBirthdate > realBirthdate;
              },

              message:
                'Vous devez être majeur pour participer au programme. En attendant, vous pouvez contacter la Mission locale dont dépend votre commune.',
            },
            {
              method: (value: string) => {
                const maxBirthdate = new Date('1900-01-01');
                const realBirthdate = new Date(value);
                return maxBirthdate < realBirthdate;
              },

              message: 'Veuillez entrer une date valide.',
            },
          ],
        },
        {
          id: 'workingRight',
          name: 'workingRight',
          title: 'Avez-vous le droit de travailler en France? *',
          component: 'select-simple',
          showLabel: true,
          isRequired: true,
          options: [
            ...CANDIDATE_YES_NO_FILTERS,
            {
              label: 'Je ne sais pas',
              value: 'dont_know',
            },
          ],
          rules: [
            {
              method: (value) => value !== CANDIDATE_YES_NO.NO,

              message:
                'Vous devez avoir le droit de travailler en France pour participer au programme LinkedOut',
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
          isRequired: true,
                    maxLength: 80,
        },
        {
          id: 'lastName',
          name: 'lastName',
          title: 'Votre nom *',
          component: 'text-input',
          placeholder: 'Ecrivez votre nom',
          showLabel: true,
          isRequired: true,
                    maxLength: 80,
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
          isRequired: true,
          rules: [
            {
              method: (fieldValue) =>
                isValidPhoneNumber(fieldValue, 'FR'),
              message: 'Numéro de téléphone invalide',
            },
          ],
        },
        {
          id: 'email',
          name: 'email',
          title: 'Adresse mail *',
          component: 'text-input',
          placeholder: 'Ecrivez votre adresse email',
          showLabel: true,
          isRequired: true,
          rules: [
            {
              method: (fieldValue) => validator.isEmail(fieldValue),
              message: 'Adresse e-mail invalide',
            },
          ],
        },
      ],
    },
    {
      id: 'heardAbout',
      name: 'heardAbout',
      title: 'Comment avez-vous connu LinkedOut ? *',
      component: 'select-simple',
      showLabel: true,
      isRequired: true,
      options: HEARD_ABOUT_FILTERS,
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
};
