import { FormSchema } from '../FormSchema';
import { FilterConstant } from 'src/constants/utils';

export const formEditExperience: FormSchema<{
  title: string;
  location: string;
  company: string;
  dateStart: string;
  dateEnd: string;
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
      maxLength: 35,
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Description',
      maxLines: { lines: 9, width: 655 },
    },
    {
      id: 'location',
      name: 'location',
      component: 'text-input',
      title: 'Lieu de travail',
      maxLength: 20,
    },
    {
      id: 'company',
      name: 'company',
      component: 'text-input',
      title: 'Entreprise',
      maxLength: 20,
    },
    {
      id: 'dateStart',
      name: 'dateStart',
      component: 'datepicker',
      title: 'Date de début',
    },
    {
      id: 'dateEnd',
      name: 'dateEnd',
      component: 'datepicker',
      title: 'Date de fin',
    },
    {
      id: 'skills',
      name: 'skills',
      title: 'Compétences acquises',
      component: 'select-creatable',
      isMulti: true,
      maxChar: 20,
      maxItems: 3,
    },
  ],
};
