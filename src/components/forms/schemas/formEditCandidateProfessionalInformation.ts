import { FormSchema } from '../FormSchema';
import { BUSINESS_LINES, BusinessLineValue } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formEditCandidateProfessionalInformation: FormSchema<{
  searchBusinessLine0: FilterConstant<BusinessLineValue>;
  searchAmbition0: string;
  searchBusinessLine1: FilterConstant<BusinessLineValue>;
  searchAmbition1: string;
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
          id: 'searchBusinessLine0',
          name: 'searchBusinessLine0',
          title: 'Famille de métier 1',
          component: 'select',
          options: BUSINESS_LINES,
          isMulti: false,
        },
        {
          id: 'searchAmbition0',
          name: 'searchAmbition0',
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
          id: 'searchBusinessLine1',
          name: 'searchBusinessLine1',
          title: 'Famille de métier 2',
          component: 'select',
          isMulti: false,
          options: BUSINESS_LINES,
        },
        {
          id: 'searchAmbition1',
          name: 'searchAmbition1',
          component: 'text-input',
          title: 'Métier 2',
        },
      ],
    },
  ],
};
