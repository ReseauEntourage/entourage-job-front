import React from 'react';
import { FormSchema } from 'src/components/forms/FormSchema';
import { Typography } from 'src/components/utils';
import { ANTENNE_INFO } from 'src/constants';
import { Department } from 'src/constants/departements';
import { Program, ProgramOptions, Programs } from 'src/constants/programs';
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
      component: 'select-card',
      options: ProgramOptions[USER_ROLES.CANDIDATE],
      showLabel: false,
      isRequired: true,
      isMulti: false,
      optionsToDisable: (getValue) => {
        const birthDate = getValue('birthDate');
        const department = getValue('department');
        const isDepartmentEligible = !!ANTENNE_INFO.find((antenne) => {
          return department.value.includes(antenne.dpt);
        });

        const maxBirthdate = new Date();
        maxBirthdate.setFullYear(maxBirthdate.getFullYear() - 31);
        const realBirthdate = new Date(birthDate);
        const isAgeEligible = maxBirthdate <= realBirthdate;

        if (!isDepartmentEligible || !isAgeEligible) {
          return [
            {
              option: Programs.LONG,
              message: (
                <>
                  <Typography size="small" weight="bold">
                    Pour l&apos;instant, le Programme 360 est uniquement
                    disponible pour les moins de 30 ans résidant dans certaines
                    villes et département définis
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
