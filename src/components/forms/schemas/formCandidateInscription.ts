import _ from 'lodash';
import moment from 'moment';
import { isValidPhoneNumber } from 'react-phone-number-input/mobile';
import { Api } from 'src/api';
import 'moment/locale/fr';
import { isEmail } from 'validator';
import { RadioTypes } from 'src/components/utils/Inputs/Radio/Radio.types';
import {
  ANTENNE_INFO,
  CANDIDATE_YES_NO_NSPP_FILTERS,
  CandidateYesNoNSPP,
  CandidateYesNoNSPPValue,
  HEARD_ABOUT_FILTERS,
  HeardAboutValue,
} from 'src/constants';
import { FormSchema, GetValueType } from '../FormSchema';
import { Cities, CITIES_FILTERS, City } from 'src/constants/departements';
import { AnyCantFix } from 'src/utils/Types';

function hideIfNoInfoCo<T extends GetValueType<AnyCantFix>>(
  getValue: T,
  fieldOptions: { [p: string]: RadioTypes[] }
) {
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
}

export const formCandidateInscription: FormSchema<{
  location: City;
  birthdate: string;
  workingRight: CandidateYesNoNSPPValue;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  heardAbout: HeardAboutValue;
  infoCo: string;
}> = {
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
      options: CITIES_FILTERS,
      fieldsToReset: ['infoCo'],
      rules: [
        {
          method: (value) => value !== Cities.OTHER,
          message:
            'Nous sommes désolée, le programme est disponible uniquement dans les villes /départements indiqués dans la liste.',
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
          options: CANDIDATE_YES_NO_NSPP_FILTERS,
          rules: [
            {
              method: (value) => value !== CandidateYesNoNSPP.NO,
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
                fieldValue && isValidPhoneNumber(fieldValue, 'FR'),
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
              method: (fieldValue) => isEmail(fieldValue),
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
      hide: (getValue, fieldOptions) => hideIfNoInfoCo(getValue, fieldOptions),
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
      hide: (getValue, fieldOptions) => hideIfNoInfoCo(getValue, fieldOptions),
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
      hide: (getValue, fieldOptions) => hideIfNoInfoCo(getValue, fieldOptions),
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
