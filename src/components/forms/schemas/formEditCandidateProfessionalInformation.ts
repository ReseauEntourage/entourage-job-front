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

export const formEditCandidateProfessionalInformation: FormSchema<{
  businessSectorId0: FilterConstant<string>;
  occupation0: string;
  businessSectorId1: FilterConstant<string>;
  occupation1: string;
  linkedinUrl: string;
}> = {
  id: 'form-career-path',
  fields: [
    {
      id: 'carreerPathText0',
      name: 'carreerPathText0',
      component: 'fieldgroup',
      fields: [
        {
          id: 'linkWordIn0',
          name: 'linkWordIn0',
          component: 'text',
          title: 'Secteur(s) d’activité(s)',
        },
        {
          id: 'linkWordLike0',
          name: 'linkWordLike0',
          component: 'text',
          title: 'Métier(s) recherché(s)',
        },
      ],
    },
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
          title: 'Métier 1',
        },
      ],
    },
    {
      id: 'carreerPath1',
      name: 'carreerPath1',
      component: 'fieldgroup',
      fields: [
        {
          id: 'businessSectorId1',
          name: 'businessSectorId1',
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
    {
      id: 'linkedinLabel',
      name: 'linkedinLabel',
      title: 'Partagez votre profil LinkedIn',
      component: 'heading',
    },
    {
      id: 'linkedinUrl',
      name: 'linkedinUrl',
      component: 'text-input',
      title: 'Ajouter le lien LinkedIn',
      rules: [
        {
          method: (fieldValue) => {
            return (
              !fieldValue ||
              (!!fieldValue && fieldValue.includes('linkedin.com'))
            );
          },
          message: 'Doit être un lien Linkedin valide',
        },
      ],
    },
  ],
};
