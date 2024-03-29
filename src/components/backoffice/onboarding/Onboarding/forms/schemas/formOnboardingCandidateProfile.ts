import { FormSchema } from 'src/components/forms/FormSchema';

export const formOnboardingCandidateProfile: FormSchema<{
  description: string;
}> = {
  id: 'form-onboarding-profile',
  fields: [
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Présentez-vous en quelques mots*',
      showLabel: true,
      placeholder:
        "Exemple : “Passionné par le secteur du tourisme, je cherche à améliorer mes candidatures. Je suis motivé à apprendre et à grandir. Ouvert à un contrat CDI ou CDD dans la région Lyonnaise, j'espère apporter mes compétences à une équipe dynamique.”",
      rows: 14,
      isRequired: true,
      maxLines: { lines: 5, width: 655 },
    },
  ],
};
