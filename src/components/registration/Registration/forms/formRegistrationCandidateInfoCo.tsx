import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/fr';

import { Api } from 'src/api';
import { FormSchema } from 'src/components/forms/FormSchema';
import { ANTENNE_INFO } from 'src/constants';
import { Department, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { FilterConstant } from 'src/constants/utils';

type FormRegistrationCandidateInfoCoSchema = {
  department: FilterConstant<Department>;
  infoCo: string;
};

export const formRegistrationCandidateInfoCo: FormSchema<FormRegistrationCandidateInfoCoSchema> =
  {
    id: 'form-registration-candidate-info-co',
    fields: [
      {
        id: 'department',
        name: 'department',
        component: 'select',
        options: DEPARTMENTS_FILTERS,
        isRequired: true,
        showLabel: false,
        isMulti: false,
        disabled: true,
        hidden: true,
      },
      {
        id: 'infoCoSubtitle',
        name: 'infoCoSubtitle',
        title: (getValue) => {
          const department = getValue('department');
          const address = ANTENNE_INFO.find((antenne) => {
            return department.value.includes(antenne.dpt);
          })?.address;
          return `Les réunions ont lieu ${
            address ? `au ${address}` : 'dans nos locaux'
          }. Elles permettent à nos équipes de vous donner toutes les informations et conseils nécessaires pour débuter le programme 360.`;
        },
        component: 'text',
      },
      {
        id: 'infoCo',
        name: 'infoCo',
        component: 'radio-async',
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        limit: 7,
        isRequired: true,
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        dynamicFilter: (getValue) => {
          const department = getValue('department');
          return ANTENNE_INFO.find((antenne) => {
            return department.value.includes(antenne.dpt);
          })?.city;
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
          callback([...options, noChoice]);
        },
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        errorMessage:
          'Il n’y a pas de réunion d’information organisée dans les prochains temps dans votre ville, nous allons vous recontacter rapidement.',
      },
    ],
  };
