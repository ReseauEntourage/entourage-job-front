import { FormComponents, FormSchema } from '../FormSchema';

export const formEditCompanyLinks: FormSchema<{
  url: string;
  linkedInUrl: string;
  hiringUrl: string;
}> = {
  id: 'form-links',
  fields: [
    {
      id: 'url',
      name: 'url',
      component: FormComponents.TEXT_INPUT,
      title: "Site de l'entreprise",
      placeholder: 'Lien du site de l’entreprise',
      showLabel: true,
    },
    {
      id: 'linkedInUrl',
      name: 'linkedInUrl',
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
