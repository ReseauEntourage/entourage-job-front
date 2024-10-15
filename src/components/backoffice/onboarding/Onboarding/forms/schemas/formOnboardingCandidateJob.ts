import {
  FileTypes,
  FormComponents,
  FormSchema,
} from 'src/components/forms/FormSchema';
import { BUSINESS_LINES, BusinessLineValue } from 'src/constants';
import { FilterConstant } from 'src/constants/utils';

export const formOnboardingCandidateJob: FormSchema<{
  searchBusinessLine0: FilterConstant<BusinessLineValue>;
  searchAmbition0: string;
  searchBusinessLine1: FilterConstant<BusinessLineValue>;
  searchAmbition1: string;
  linkedinUrl: string;
  externalCv: File;
}> = {
  id: 'form-onboarding-candidate-job',
  fields: [
    {
      id: 'carreerPath0',
      name: 'carreerPath0',
      component: 'fieldgroup',
      fields: [
        {
          id: 'searchBusinessLine0',
          name: 'searchBusinessLine0',
          title: 'Secteur(s) recherché(s)',
          component: FormComponents.SELECT,
          showLabel: true,
          options: BUSINESS_LINES,
          isMulti: false,
          isRequired: true,
          placeholder: 'Secteur 1 *',
        },
        {
          id: 'searchAmbition0',
          name: 'searchAmbition0',
          component: FormComponents.TEXT_INPUT,
          showLabel: true,
          title: 'Métier(s) recherché(s)',
          placeholder: 'Métier 1',
        },
      ],
    },
    {
      id: 'carreerPath1',
      name: 'carreerPath1',
      component: 'fieldgroup',
      fields: [
        {
          id: 'searchBusinessLine1',
          name: 'searchBusinessLine1',
          title: 'Secteur 2',
          component: FormComponents.SELECT,
          isMulti: false,
          options: BUSINESS_LINES,
          rules: [
            {
              method: (fieldValue, fieldValues) => {
                return !!fieldValue || !fieldValues.searchAmbition1;
              },
              message: 'Obligatoire',
            },
          ],
        },
        {
          id: 'searchAmbition1',
          name: 'searchAmbition1',
          component: FormComponents.TEXT_INPUT,
          title: 'Métier 2',
        },
      ],
    },
    {
      id: 'externalCv',
      name: 'externalCv',
      title:
        'Télécharger votre CV pour que les membres puissent le découvrir !',
      component: FormComponents.FILE,
      fileType: FileTypes.CV,
      showLabel: true,
      accept: '.pdf',
    },
    {
      id: 'linkedinUrl',
      name: 'linkedinUrl',
      component: FormComponents.TEXT_INPUT,
      title:
        'Ajouter votre profil Linkedin pour que les membres puissent le découvrir !',
      placeholder: 'Ajouter le lien LinkedIn',
      showLabel: true,
      rules: [
        {
          method: (fieldValue) => {
            return (
              !fieldValue ||
              (!!fieldValue && fieldValue.includes('linkedin.com'))
            );
          },
          message: 'Doit être un lien Linkedin valide',
        },
      ],
    },
  ],
};
