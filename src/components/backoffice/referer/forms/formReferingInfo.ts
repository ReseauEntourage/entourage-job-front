import { FormSchema } from 'src/components/forms/FormSchema';
import {
  CANDIDATE_YES_NO_FILTERS,
  CandidateYesNoNSPP,
  CandidateYesNoNSPPValue,
  CandidateYesNoValue,
} from 'src/constants';
import { Department, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { FilterConstant } from 'src/constants/utils';

export const formReferingInfo: FormSchema<{
  birthDate: string;
  department: FilterConstant<Department>;
  workingRight: CandidateYesNoNSPPValue;
  materialInsecurity: CandidateYesNoValue;
  networkInsecurity: CandidateYesNoValue;
}> = {
  id: 'form-refering-candidate-info',
  fields: [
    {
      id: 'birthDateLabel',
      name: 'birthDateLabel',
      title: 'Quelle est la date de naissance de votre candidat ?*',
      component: 'heading',
    },
    {
      id: 'birthDateSubLabel',
      name: 'birthDateSubLabel',
      component: 'text',
      title:
        'Les candidats doivent avoir plus de 18 ans pour participer au programme Entourage Pro',
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
            'Le candidat doit avoir plus de 18 ans pour participer au programme Entourage Pro',
        },
      ],
    },
    {
      id: 'departmentLabel',
      name: 'departmentLabel',
      title: 'Dans quel département habite le candidat ?*',
      component: 'heading',
    },
    {
      id: 'departmentSubLabel',
      name: 'departmentSubLabel',
      component: 'text',
      title:
        'Indiquer le département nous permettra de proposer des coachs à proximité du candidat.',
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
      title: 'Le candidat a-t-il le droit de travailler en France ?*',
      component: 'heading',
    },
    {
      id: 'workingRightSubLabel',
      name: 'workingRightLabel',
      component: 'text',
      title:
        'Le candidat doit avoir le droit de travailler en France pour participer au programme Entourage Pro',
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
            'Le candidat doit avoir le droit de travailler en France pour participer au programme Entourage Pro',
        },
      ],
    },
    {
      id: 'materialInsecurityLabel',
      name: 'materialInsecurityLabel',
      title: 'Le candidat est-il en situation de précarité matérielle ?*',
      component: 'heading',
    },
    {
      id: 'materialInsecuritySubLabel',
      name: 'materialInsecurityLabel',
      component: 'text',
      title:
        'Rencontre-t-il des difficultés pour subvenir à ses besoins de base (se loger, se nourrir, ...) ?',
    },
    {
      id: 'materialInsecurity',
      name: 'materialInsecurity',
      component: 'radio',
      showLabel: false,
      isRequired: true,
      options: CANDIDATE_YES_NO_FILTERS.map((option) => ({
        ...option,
        inputId: `material-insecurity-${option.value}`,
      })),
    },
    {
      id: 'networkInsecurityLabel',
      name: 'networkInsecurityLabel',
      title:
        "Le candidat est-il en situation d'isolement dans sa recherche d'emploi ?*",
      component: 'heading',
    },
    {
      id: 'networkInsecuritySubLabel',
      name: 'networkInsecurityLabel',
      component: 'text',
      title:
        "Est-ce que des amis ou des personnes qu'il connait peuvent l'aider à trouver un travail ?",
    },
    {
      id: 'networkInsecurity',
      name: 'networkInsecurity',
      component: 'radio',
      showLabel: false,
      isRequired: true,
      options: CANDIDATE_YES_NO_FILTERS.map((option) => ({
        ...option,
        inputId: `network-insecurity-${option.value}`,
      })),
    },
  ],
};
