import { FormSchema } from '../FormSchema';
import { FilterConstant } from 'src/constants/utils';

export const formEditExperience: FormSchema<{
  title: string;
  location: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: FilterConstant<string>[];
}> = {
  id: 'form-experience',
  fields: [
    {
      id: 'title',
      name: 'title',
      component: 'text-input',
      title: 'Intitulé du poste*',
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
      title: 'Lieu de travail',
      maxLength: 60,
    },
    {
      id: 'company',
      name: 'company',
      component: 'text-input',
      title: 'Entreprise',
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
      maxItems: 3,
    },
  ],
};
