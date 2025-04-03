import { Api } from 'src/api';
import { FormSchema } from 'src/components/forms/FormSchema';
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

export const formReferingProfessionalInformation: FormSchema<{
  businessSectorId0: FilterConstant<string>;
  occupation0: string;
  businessSectorId1: FilterConstant<string>;
  occupation1: string;
}> = {
  id: 'form-refering-candidate-professional-information',
  fields: [
    {
      id: 'carreerPath0',
      name: 'carreerPath0',
      component: 'fieldgroup',
      fields: [
        {
          id: 'businessSectorId0',
          name: 'businessSectorId0',
          component: 'select-async',
          isRequired: true,
          loadOptions: loadBusinessSectorsOptions,
          placeholder: 'Secteur 1 *',
          isMulti: false,
          showLabel: true,
        },
        {
          id: 'occupation0',
          name: 'occupation0',
          component: 'text-input',
          showLabel: true,
          title: 'Métier(s) recherché(s)',
          placeholder: 'Métier 1',
        },
      ],
    },
    {
      id: 'carreerPath1',
      name: 'carreerPath1',
      component: 'fieldgroup',
      fields: [
        {
          id: 'businessSectorId0',
          name: 'businessSectorId0',
          component: 'select-async',
          isRequired: false,
          loadOptions: loadBusinessSectorsOptions,
          placeholder: 'Secteur 2',
          isMulti: false,
          showLabel: true,
          rules: [
            {
              method: (fieldValue, fieldValues) => {
                return !!fieldValue || !fieldValues.occupation1;
              },
              message: 'Obligatoire',
            },
          ],
        },
        {
          id: 'occupation1',
          name: 'occupation1',
          component: 'text-input',
          title: 'Métier 2',
        },
      ],
    },
  ],
};
