import { FormSchema } from '../FormSchema';
import { FilterConstant } from 'src/constants/utils';

export const formEditFormation: FormSchema<{
  description: string;
  title: string;
  location: string;
  institution: string;
  startDate: string;
  endDate: string;
  skills: FilterConstant<string>[];
}> = {
  id: 'form-formation',
  fields: [
    {
      id: 'title',
      name: 'title',
      component: 'text-input',
      type: 'text',
      title: 'Intitulé de la formation*',
      isRequired: true,
      maxLength: 60,
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Description',
      maxLength: 300,
    },
    {
      id: 'location',
      name: 'location',
      component: 'text-input',
      type: 'text',
      title: 'Lieu de formation',
      maxLength: 60,
    },
    {
      id: 'institution',
      name: 'institution',
      component: 'text-input',
      type: 'text',
      title: 'Etablissement / Institution',
      maxLength: 60,
    },
    {
      id: 'startDate',
      name: 'startDate',
      component: 'datepicker',
      title: 'Date de début',
    },
    {
      id: 'endDate',
      name: 'endDate',
      component: 'datepicker',
      title: 'Date de fin',
    },
    {
      id: 'skills',
      name: 'skills',
      title: 'Compétences acquises',
      component: 'select-creatable',
      isMulti: true,
      maxChar: 30,
      maxItems: 5,
    },
  ],
};
