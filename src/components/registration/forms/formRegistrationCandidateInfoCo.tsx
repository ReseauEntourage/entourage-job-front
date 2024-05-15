import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/fr';

import { Api } from 'src/api';
import { FormSchema } from 'src/components/forms/FormSchema';
import { ANTENNE_INFO } from 'src/constants';
import { Department } from 'src/constants/departements';
import { FilterConstant } from 'src/constants/utils';

export const formRegistrationCandidateInfoCo: FormSchema<{
  department: FilterConstant<Department>;
  campaign: string;
}> = {
  id: 'form-registration-candidate-info-co',
  fields: [
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
        }. Elles permettent à nos équipes de vous donner toutes les informations et conseils nécessaires pour débuter le format 360.`;
      },
      component: 'text',
    },
    {
      id: 'campaign',
      name: 'campaign',
      component: 'radio-async',
      limit: 7,
      dynamicFilter: (getValue) => {
        const department = getValue('department');
        return ANTENNE_INFO.find((antenne) => {
          return department.value.includes(antenne.dpt);
        })?.city;
      },
      loadOptions: async (callback) => {
        try {
          const { data: campaigns } = await Api.getCandidateCampaigns();
          const noChoice = {
            inputId: `campaign-radio-nochoice`,
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
        } catch (error) {
          console.error(error);
          callback([]);
        }
      },
      errorMessage:
        'Il n’y a pas de réunion d’information organisée dans les prochains temps dans votre ville, nous allons vous recontacter rapidement.',
    },
  ],
};
