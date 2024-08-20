import { FormSchema } from '../FormSchema';

export const formEditProfileDescriptionCoach: FormSchema<{
  description: string;
}> = {
  id: 'form-profile-description',
  fields: [
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Description',
      placeholder:
        "Exemple: Passionné.e par le secteur de la logistique, je souhaite transmettre mon expérience et faire profiter les personnes en recherche d'emploi de mon réseau.",
      rows: 14,
      maxLines: { lines: 5, width: 655 },
    },
  ],
};
