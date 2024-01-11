import { FormSchema } from '../FormSchema';

export const formEditProfileDescription: FormSchema<{ description: string }> = {
  id: 'form-profile-description',
  fields: [
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Description',
      placeholder:
        "Exemple : “Passionné par le secteur du tourisme, je cherche à améliorer mes candidatures. Je suis motivé à apprendre et à grandir. Ouvert à un contrat CDI ou CDD dans la région Lyonnaise, j'espère apporter mes compétences à une équipe dynamique.”",
      rows: 14,
      maxLines: { lines: 5, width: 655 },
    },
  ],
};
