import { Api } from 'src/api';
import { FormComponents, FormSchema } from 'src/components/forms/FormSchema';
import { FilterConstant } from 'src/constants/utils';

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

export const formOnboardingCoachJob: FormSchema<{
  currentJob: string;
  businessSectorIds: FilterConstant<string>[];
  linkedinUrl: string;
}> = {
  id: 'form-onboarding-coach-job',
  fields: [
    {
      id: 'currentJob',
      name: 'currentJob',
      component: 'text-input',
      title: 'Mon métier et mon expérience',
      showLabel: true,
    },
    {
      id: 'businessSectorIds',
      name: 'businessSectorIds',
      component: 'select-async',
      loadOptions: loadBusinessSectorsOptions,
      placeholder: "Les secteurs dans lesquels j'ai du réseau*",
      isMulti: true,
      showLabel: true,
    },
    {
      id: 'linkedinUrl',
      name: 'linkedinUrl',
      component: FormComponents.TEXT_INPUT,
      title:
        'Ajoutez votre profil LinkedIn pour que les membres le découvrent et vous y soutiennent aussi',
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
