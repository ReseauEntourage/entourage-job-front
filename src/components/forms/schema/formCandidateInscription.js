import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import api from 'src/api/index.ts';
import moment from 'moment';
import 'moment/locale/fr';
import { antenneInfo } from 'src/constants';

export default {
  id: 'form-candidate-inscription',
  fields: [
    {
      id: 'generalInformation',
      title: 'Informations pour accéder au programme LinkedOut',
      component: 'heading',
    },
    {
      id: 'location',
      name: 'location',
      component: 'select-new',
      showLabel: true,
      title: 'Habitez-vous dans une des villes / départements suivants? *',
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
      component: 'fieldgroup-new',
      fields: [
        {
          id: 'birthdate',
          name: 'birthdate',
          component: 'datepicker-new',
          title: 'Quelle est votre date de naissance? *',
        },
        {
          id: 'workingRight',
          name: 'workingRight',
          title: 'Avez-vous le droit de travailler en France? *',
          component: 'select-new',
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
      title: 'Informations personnelles',
      component: 'heading',
    },
    {
      component: 'fieldgroup-new',
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
        {
          id: 'phone',
          name: 'phone',
          title: 'Téléphone *',
          component: 'tel-input',
          placeholder: 'Ecrivez votre numéro de téléphone',
          showLabel: true,
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
    },
    {
      id: 'heardAbout',
      name: 'heardAbout',
      title: 'Comment avez-vous connu LinkedOut ? *',
      component: 'select-new',
      showLabel: true,
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
      title: 'Date des prochaines réunion d’information',
      component: 'heading',
      hide: (getValue, fieldOptions) => {
        const city = antenneInfo.find((antenne) => {
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
      title: (getValue) => {
        return `Les réunions d’informations ont lieu dans nos locaux au ${
          antenneInfo.find((antenne) => {
            return antenne.dpt === getValue('location');
          })?.address
        }`;
      },
      component: 'dynamic-text',
      hide: (getValue, fieldOptions) => {
        const city = antenneInfo.find((antenne) => {
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
        'Selectionnez la date de la prochaine réunion d’information à laquelle vous souhaitez participer',
      component: 'radio-async-new',
      dynamicFilter: (getValue) => {
        return antenneInfo.find((antenne) => {
          return antenne.dpt === getValue('location');
        })?.city;
      },
      hide: (getValue, fieldOptions) => {
        const city = antenneInfo.find((antenne) => {
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
      loadOptions: () => {
        return api
          .getCampaigns()
          .then((res) => {
            const noChoice = {
              inputId: `infoco-radio-nochoice`,
              label: 'je ne suis pas disponible à ces dates',
              value: '',
            };
            const options = res.data.map((record) => {
              return {
                inputId: `infoco-radio-${record.id}`,
                label: `${moment(record.time).format(
                  'dddd D MMMM [à] HH[h]mm'
                )}`,
                value: record.id,
                filterData: record.antenne,
              };
            });
            return options.length ? [...options, noChoice] : [];
          })
          .catch((err) => {
            console.log(err);
            return [];
          });
      },
      errorMessage:
        'Il n’y a pas de réunion d’information organisée dans les prochains temps dans votre ville, nous allons vous recontacter rapidement',
    },
  ],
  rules: [
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
      field: 'location',
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
  ],
};
