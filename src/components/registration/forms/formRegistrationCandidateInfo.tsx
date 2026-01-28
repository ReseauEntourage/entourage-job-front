import { FormSchema } from 'src/components/forms/FormSchema';
import {
  CANDIDATE_YES_NO_FILTERS,
  CandidateYesNoNSPP,
  CandidateYesNoNSPPValue,
} from 'src/constants';
import {
  DepartmentName,
  DEPARTMENTS_FILTERS,
} from 'src/constants/departements';
import { FilterConstant } from 'src/constants/utils';
import {
  isBirthDateAtLeastAge,
  isBirthDateAtMostAge,
  isBirthDateNotInFuture,
  parseISODateOnly,
} from 'src/utils/BirthDate';

export const formRegistrationCandidateInfo: FormSchema<{
  birthDate: string;
  department: FilterConstant<DepartmentName>;
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
            return parseISODateOnly(fieldValue) !== null;
          },
          message: 'Veuillez saisir une date de naissance valide',
        },
        {
          method: (fieldValue) => {
            const birthDate = parseISODateOnly(fieldValue);
            return birthDate ? isBirthDateNotInFuture(birthDate) : false;
          },
          message: 'La date de naissance ne peut pas être dans le futur',
        },
        {
          method: (fieldValue) => {
            const birthDate = parseISODateOnly(fieldValue);
            return birthDate ? isBirthDateAtMostAge(birthDate, 120) : false;
          },
          message: 'La date de naissance est trop ancienne',
        },
        {
          method: (fieldValue) => {
            const birthDate = parseISODateOnly(fieldValue);
            return birthDate ? isBirthDateAtLeastAge(birthDate, 18) : false;
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
      component: 'radio',
      showLabel: false,
      isRequired: true,
      options: CANDIDATE_YES_NO_FILTERS.map((option) => ({
        ...option,
        inputId: `working-right-${option.value}`,
      })),
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
