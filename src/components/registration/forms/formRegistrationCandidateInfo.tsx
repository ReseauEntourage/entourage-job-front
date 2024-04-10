import { FormSchema } from 'src/components/forms/FormSchema';
import {
  CANDIDATE_YES_NO_NSPP_FILTERS,
  CandidateYesNoNSPP,
  CandidateYesNoNSPPValue,
} from 'src/constants';
import { Department, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { FilterConstant } from 'src/constants/utils';

export const formRegistrationCandidateInfo: FormSchema<{
  birthDate: string;
  department: FilterConstant<Department>;
  workingRight: CandidateYesNoNSPPValue;
}> = {
  id: 'form-registration-candidate-info',
  fields: [
    {
      id: 'birthDateLabel',
      name: 'birthDateLabel',
      title: 'Quelle est votre date de naissance ?*',
      component: 'heading',
    },
    {
      id: 'birthDateSubLabel',
      name: 'birthDateSubLabel',
      component: 'text',
      title:
        'Vous devez avoir plus de 18 ans pour participer au programme Entourage Pro',
    },
    {
      id: 'birthDate',
      name: 'birthDate',
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
            'Vous devez avoir plus de 18 ans pour participer au programme Entourage Pro',
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
        'En renseignant votre département, nous pourrons vous conseiller des coachs à proximité',
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
    {
      id: 'workingRightLabel',
      name: 'workingRightLabel',
      title: 'Avez-vous le droit de travailler en France ?*',
      component: 'heading',
    },
    {
      id: 'workingRightSubLabel',
      name: 'workingRightLabel',
      component: 'text',
      title:
        'Vous devez avoir le droit de travailler en France pour participer au programme Entourage Pro',
    },
    {
      id: 'workingRight',
      name: 'workingRight',
      component: 'select-simple',
      showLabel: false,
      isRequired: true,
      options: CANDIDATE_YES_NO_NSPP_FILTERS,
      rules: [
        {
          method: (fieldValue) => fieldValue !== CandidateYesNoNSPP.NO,
          message:
            'Vous devez avoir le droit de travailler en France pour participer au programme Entourage Pro',
        },
      ],
    },
  ],
};
