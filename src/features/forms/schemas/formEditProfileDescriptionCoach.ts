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
        "Exemple: Chef.fe de projet digital avec plus de 10 ans d'expérience, j'ai dirigé des équipes dans la création de campagnes innovantes pour des clients internationaux. Mon expertise couvre la gestion de projets, le développement de stratégies digitales et l'optimisation des processus.",
      rows: 14,
      maxLength: 1000,
    },
  ],
};
