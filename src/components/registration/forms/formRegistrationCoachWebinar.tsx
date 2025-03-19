import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/fr';

import { Api } from 'src/api';
import { FormSchema } from 'src/components/forms/FormSchema';

export const formRegistrationCoachWebinar: FormSchema<{
  campaign: string;
}> = {
  id: 'form-registration-candidate-info-co',
  fields: [
    {
      id: 'infoCoSubtitle',
      name: 'infoCoSubtitle',
      title: `Les réunions ont lieu en visio. Elles permettent à notre équipe de vous donner toutes les informations et conseils nécessaires pour débuter le format 360.`,
      component: 'text',
    },
    {
      id: 'campaign',
      name: 'campaign',
      component: 'radio-async',
      limit: 7,
      loadOptions: async (callback) => {
        try {
          const { data: campaigns } = await Api.getCoachCampaigns();
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
        'Il n’y a pas de webinaire coach organisé dans les prochains temps, nous allons vous recontacter rapidement.',
    },
  ],
};
