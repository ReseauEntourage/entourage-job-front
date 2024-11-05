import { FormSchema } from 'src/components/forms/FormSchema';
import { Department } from 'src/constants/departements';
import { Program, ProgramOptions } from 'src/constants/programs';
import { USER_ROLES } from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';

export const formRegistrationCoachProgram: FormSchema<{
  program: Program[];
  department: FilterConstant<Department>;
}> = {
  id: 'form-registration-coach-program',
  fields: [
    {
      id: 'program',
      name: 'program',
      component: 'radio',
      isRequired: true,
      title: "Quel format d'accompagnement vous convient le mieux ?",
      errorMessage: 'Veuillez sélectionner une des réponses',
      options: ProgramOptions[USER_ROLES.COACH],
    },
  ],
};
