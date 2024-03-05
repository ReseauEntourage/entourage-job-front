import { FormSchema } from 'src/components/forms/FormSchema';
import { Programs, ProgramOptions } from 'src/constants/programs';
import { USER_ROLES } from 'src/constants/users';

export const formRegistrationCoachProgram: FormSchema<{
  program: Programs[];
}> = {
  id: 'form-registration-coach-program',
  fields: [
    {
      id: 'program',
      name: 'program',
      component: 'select-card',
      options: ProgramOptions[USER_ROLES.COACH],
      showLabel: false,
      isRequired: true,
      isMulti: false,
    },
  ],
};
