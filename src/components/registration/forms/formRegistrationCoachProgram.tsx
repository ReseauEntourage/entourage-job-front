import React from 'react';
import { FormSchema } from 'src/components/forms/FormSchema';
import { Typography } from 'src/components/utils';
import { ANTENNE_INFO } from 'src/constants';
import { Department } from 'src/constants/departements';
import { Program, ProgramOptions, Programs } from 'src/constants/programs';
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
      component: 'select-card',
      options: ProgramOptions[USER_ROLES.COACH],
      showLabel: false,
      isRequired: true,
      isMulti: false,
      optionsToDisable: (getValue) => {
        const department = getValue('department');
        const isDepartmentEligible = !!ANTENNE_INFO.find((antenne) => {
          return department.value.includes(antenne.dpt);
        });

        if (!isDepartmentEligible) {
          return [
            {
              option: Programs.THREE_SIXTY,
              message: (
                <>
                  <Typography size="small" weight="bold">
                    Pour l&apos;instant, le Format 360 est uniquement disponible
                    pour les coachs résidant dans certaines villes et
                    départements définis.
                  </Typography>
                  <Typography size="small" variant="italic">
                    (Paris, Seine-Saint-Denis, Hauts-de-Seine, Lille, Lyon et
                    Rennes).
                  </Typography>
                </>
              ),
            },
          ];
        }
        return [];
      },
    },
  ],
};
