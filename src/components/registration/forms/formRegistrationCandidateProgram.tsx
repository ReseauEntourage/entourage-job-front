import { FormSchema } from 'src/components/forms/FormSchema';
import { Department } from 'src/constants/departements';
import { Program, ProgramOptions } from 'src/constants/programs';
import { USER_ROLES } from 'src/constants/users';
import { FilterConstant } from 'src/constants/utils';

export const formRegistrationCandidateProgram: FormSchema<{
  program: Program[];
  birthDate: string;
  department: FilterConstant<Department>;
}> = {
  id: 'form-registration-candidate-program',
  fields: [
    {
      id: 'program',
      name: 'program',
      component: 'radio',
      isRequired: true,
      title:
        'Souhaitez-vous bénéficier gratuitement d’un accompagnement par un coach personnel pendant 3 à 6 mois ?',
      errorMessage: 'Veuillez sélectionner une des réponses',
      options: ProgramOptions[USER_ROLES.CANDIDATE],
    },
  ],
};
