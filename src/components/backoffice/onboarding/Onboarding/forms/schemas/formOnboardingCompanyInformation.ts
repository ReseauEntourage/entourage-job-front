import {
  loadBusinessSectorsOptions,
  loadDepartmentsOptions,
} from '@/src/components/forms/utils/loadOptions.utils';
import { FilterConstant } from '@/src/constants/utils';
import {
  FileTypes,
  FormComponents,
  FormSchema,
} from 'src/components/forms/FormSchema';

export const formOnboardingCompanyInformation: FormSchema<{
  description: string;
  logo: File;
  businessSectorIds: FilterConstant<string>[];
  departmentId: FilterConstant<string>;
  url: string;
  linkedinUrl: string;
  hiringUrl: string;
}> = {
  id: 'form-onboarding-candidate-job',
  fields: [
    {
      id: 'description',
      name: 'description',
      title: 'Description',
      component: FormComponents.TEXTAREA,
      placeholder: 'Presentez votre entreprise',
      showLabel: true,
    },
    {
      id: 'logo',
      name: 'logo',
      title: 'Logo',
      component: FormComponents.FILE,
      fileType: FileTypes.LOGO,
      showLabel: true,
      accept: '.png',
    },
    {
      id: 'businessSectorIds',
      name: 'businessSectorIds',
      title: 'Secteur d’activité',
      component: 'select-async',
      loadOptions: loadBusinessSectorsOptions,
      placeholder: 'Sélectionnez dans la liste',
      isMulti: true,
      showLabel: true,
    },
    {
      id: 'departmentId',
      name: 'departmentId',
      title: 'Département',
      component: 'select-async',
      loadOptions: loadDepartmentsOptions,
      placeholder: 'Sélectionnez un département',
      isRequired: true,
      showLabel: true,
      isMulti: false,
    },
    {
      id: 'url',
      name: 'url',
      component: FormComponents.TEXT_INPUT,
      title: "Site de l'entreprise",
      placeholder: 'Lien du site de l’entreprise',
      showLabel: true,
    },
    {
      id: 'linkedinUrl',
      name: 'linkedinUrl',
      component: FormComponents.TEXT_INPUT,
      title: 'Lien Linkedin',
      placeholder: "Lien LinkedIn de l'entreprise",
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
    {
      id: 'hiringUrl',
      name: 'hiringUrl',
      component: FormComponents.TEXT_INPUT,
      title: 'Lien plateforme de recrutement',
      placeholder: 'Lien recrutement',
      showLabel: true,
    },
  ],
};
