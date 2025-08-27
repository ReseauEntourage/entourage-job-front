import { Api } from '@/src/api';
import { FilterConstant } from '@/src/constants/utils';
import {
  FileTypes,
  FormComponents,
  FormSchema,
} from 'src/components/forms/FormSchema';

const loadDepartmentsOptions = async (callback, inputValue) => {
  try {
    const { data: departments } = await Api.getAllDepartments({
      search: inputValue,
    });
    callback([
      ...departments.map((u) => {
        return {
          value: u.id,
          label: `${u.value} - ${u.name}`,
        };
      }),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};

const loadBusinessSectorsOptions = async (callback, inputValue) => {
  try {
    const { data: businessSectors } = await Api.getAllBusinessSectors({
      search: inputValue,
      limit: 50,
      offset: 0,
    });
    callback([
      ...businessSectors.map((u) => {
        return {
          value: u.id,
          label: u.name,
        };
      }),
    ]);
  } catch (error) {
    console.error(error);
    callback([]);
  }
};

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
      placeholder: 'Séléctionnez un département',
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
