import { FormSchema } from '../FormSchema';
import { Api } from 'src/api';
import { FilterConstant } from 'src/constants/utils';

const loadBusinessSectorsOptions = async (callback, inputValue) => {
  try {
    const { data: businessSectors } = await Api.getAllBusinessSectors({
      search: inputValue,
      limit: 50,
      offset: 0,
    });
    callback([
      ...businessSectors.map((u) => {
        return {
          value: u.id,
          label: u.name,
        };
      }),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};

export const formEditCoachProfessionalInformation: FormSchema<{
  currentJob: string;
  businessSectorIds: FilterConstant<string>[];
}> = {
  id: 'form-coach-professional-information',
  fields: [
    {
      id: 'currentJob',
      name: 'currentJob',
      component: 'text-input',
      title: 'Mon métier',
    },
    {
      id: 'businessSectorIds',
      name: 'businessSectorIds',
      component: 'select-async',
      isRequired: true,
      loadOptions: loadBusinessSectorsOptions,
      placeholder: "Les secteurs dans lesquels j'ai du réseau*",
      isMulti: true,
      showLabel: true,
    },
    {
      id: 'linkedinLabel',
      name: 'linkedinLabel',
      title: 'Partagez votre profil LinkedIn',
      component: 'heading',
    },
  ],
};
