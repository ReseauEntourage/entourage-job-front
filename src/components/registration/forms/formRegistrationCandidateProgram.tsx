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
      title:
        'Souhaitez vous bénéficier d’un accompagnement avec un coach  personnalisé (gratuit) ? *',
      subtitle:
        'Vous pouvez bénéficier de l’accompagnement d’un coach personnel, une heures ou deux par semaine pendant 3 à 6 mois',
      errorMessage: 'Veuillez sélectionner une des réponses',
      options: ProgramOptions[USER_ROLES.CANDIDATE],
      // optionsToDisable: (getValue) => {
      //   return [];
      // },
      // optionsToDisable: (getValue) => {
      //   const birthDate = getValue('birthDate');
      //   const department = getValue('department');
      //   const isDepartmentEligible = !!ANTENNE_INFO.find((antenne) => {
      //     return department.value.includes(antenne.dpt);
      //   });

      //   const maxBirthdate = new Date();
      //   maxBirthdate.setFullYear(maxBirthdate.getFullYear() - 31);
      //   const realBirthdate = new Date(birthDate);
      //   const isAgeEligible = maxBirthdate <= realBirthdate;

      //   if (!isDepartmentEligible || !isAgeEligible) {
      //     return [
      //       {
      //         option: Programs.THREE_SIXTY,
      //         message: (
      //           <>
      //             <Typography size="small" weight="bold">
      //               Pour l&apos;instant, le Format 360 est uniquement disponible
      //               pour les moins de 30 ans résidant dans certaines villes et
      //               département définis
      //             </Typography>
      //             <Typography size="small" variant="italic">
      //               (Paris, Seine-Saint-Denis, Hauts-de-Seine, Lille, Lyon et
      //               Rennes).
      //             </Typography>
      //           </>
      //         ),
      //       },
      //     ];
      //   }
      //   return [];
      // },
    },
  ],
};
