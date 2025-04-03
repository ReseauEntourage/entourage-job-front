import { FormSchema } from '../FormSchema';
import { BUSINESS_SECTORS, BusinessSectorValue } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formEditCandidateProfessionalInformation: FormSchema<{
  businessSector0: FilterConstant<BusinessSectorValue>;
  occupation0: string;
  businessSector1: FilterConstant<BusinessSectorValue>;
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
          id: 'businessSector0',
          name: 'businessSector0',
          title: 'Famille de métier 1*',
          component: 'select',
          options: BUSINESS_SECTORS,
          isMulti: false,
          isRequired: true,
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
          id: 'occupation1',
          name: 'occupation1',
          title: 'Famille de métier 2',
          component: 'select',
          isMulti: false,
          options: BUSINESS_SECTORS,
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
