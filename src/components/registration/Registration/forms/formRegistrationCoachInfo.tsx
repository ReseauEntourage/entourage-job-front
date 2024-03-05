import { FormSchema } from 'src/components/forms/FormSchema';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';

export const formRegistrationCoachInfo: FormSchema<{
  birthdate: string;
  department: string;
}> = {
  id: 'form-registration-coach-info',
  fields: [
    {
      id: 'birthdateLabel',
      name: 'birthdateLabel',
      title: 'Quelle est votre date de naissance ?*',
      component: 'heading',
    },
    {
      id: 'birthdateSubLabel',
      name: 'birthdateSubLabel',
      component: 'text',
      title: 'Vous devez avoir plus de 18 ans pour participer au programme',
    },
    {
      id: 'birthdate',
      name: 'birthdate',
      component: 'datepicker',
      isRequired: true,
      showLabel: false,
      rules: [
        {
          method: (fieldValue) => {
            const minBirthdate = new Date();
            minBirthdate.setFullYear(minBirthdate.getFullYear() - 18);
            const realBirthdate = new Date(fieldValue);
            return minBirthdate > realBirthdate;
          },
          message:
            'Vous devez avoir plus de 18 ans pour participer au programme',
        },
      ],
    },
    {
      id: 'departmentLabel',
      name: 'departmentLabel',
      title: 'Dans quel département habitez-vous ?*',
      component: 'heading',
    },
    {
      id: 'departmentSubLabel',
      name: 'departmentSubLabel',
      component: 'text',
      title:
        'En renseignant votre département, nous pourrons vous conseiller des candidat(e)s à proximité',
    },
    {
      id: 'department',
      name: 'department',
      component: 'select',
      options: DEPARTMENTS_FILTERS,
      isRequired: true,
      showLabel: false,
      isMulti: false,
    },
  ],
};
