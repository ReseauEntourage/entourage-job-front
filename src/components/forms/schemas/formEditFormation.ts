import { FormSchema } from '../FormSchema';
import { FilterConstant } from 'src/constants/utils';

export const formEditFormation: FormSchema<{
  description: string;
  title: string;
  location: string;
  institution: string;
  dateStart: string;
  dateEnd: string;
  skills: FilterConstant<string>[];
}> = {
  id: 'form-formation',
  fields: [
    {
      id: 'title',
      name: 'title',
      component: 'text-input',
      type: 'text',
      title: 'Intitulé de la formation',
    },
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Description',
      maxLength: 2000,
    },
    {
      id: 'location',
      name: 'location',
      component: 'text-input',
      type: 'text',
      title: 'Lieu de formation',
    },
    {
      id: 'institution',
      name: 'institution',
      component: 'text-input',
      type: 'text',
      title: 'Etablissement / Institution',
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
    },
  ],
};
