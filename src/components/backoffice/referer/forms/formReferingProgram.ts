import { FormSchema } from 'src/components/forms/FormSchema';
import { Program, ProgramOptions } from 'src/constants/programs';
import { USER_ROLES } from 'src/constants/users';

export const formReferingProgram: FormSchema<{
  program: Program[];
}> = {
  id: 'form-refering-candidate-program',
  fields: [
    {
      id: 'program',
      name: 'program',
      component: 'radio',
      isRequired: true,
      title:
        'Le candidat souhaite-t-il bénéficier gratuitement d’un accompagnement par un coach personnel pendant 3 à 6 mois ?',
      errorMessage: 'Veuillez sélectionner une des réponses',
      options: ProgramOptions[USER_ROLES.CANDIDATE],
    },
  ],
};
