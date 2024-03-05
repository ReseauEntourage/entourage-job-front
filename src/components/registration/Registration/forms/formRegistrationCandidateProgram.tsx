import { FormSchema } from 'src/components/forms/FormSchema';
import { Programs, ProgramOptions } from 'src/constants/programs';
import { USER_ROLES } from 'src/constants/users';

export const formRegistrationCandidateProgram: FormSchema<{
  program: Programs[];
}> = {
  id: 'form-registration-candidate-program',
  fields: [
    {
      id: 'program',
      name: 'program',
      component: 'select-card',
      options: ProgramOptions[USER_ROLES.CANDIDATE],
      showLabel: false,
      isRequired: true,
      isMulti: false,
    },
  ],
};
