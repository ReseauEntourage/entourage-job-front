import { FormSchema } from '../FormSchema';

export const formEditProfileDescriptionCandidate: FormSchema<{
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
        "Exemple: Je suis un jeune diplômé en marketing, passionné par les stratégies de communication digitale. J'ai acquis une expérience pratique lors de stages dans des agences de publicité, où j'ai travaillé sur des campagnes pour des clients variés. Je suis à la recherche d'opportunités pour développer mes compétences et contribuer à des projets innovants dans le domaine du marketing.",
      rows: 14,
      maxLength: 1000,
    },
  ],
};
