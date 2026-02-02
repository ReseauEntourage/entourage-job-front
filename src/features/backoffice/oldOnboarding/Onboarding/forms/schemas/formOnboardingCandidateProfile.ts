import { FormSchema } from '@/src/features/forms/FormSchema';

export const formOnboardingCandidateProfile: FormSchema<{
  introduction: string;
}> = {
  id: 'form-onboarding-profile',
  fields: [
    {
      id: 'introduction',
      name: 'introduction',
      component: 'textarea',
      title: 'Présentez-vous en quelques mots*',
      showLabel: true,
      placeholder:
        "Exemple : “Passionné par le secteur du tourisme, je cherche à améliorer mes candidatures. Je suis motivé à apprendre et à grandir. Ouvert à un contrat CDI ou CDD dans la région Lyonnaise, j'espère apporter mes compétences à une équipe dynamique.”",
      rows: 14,
    },
  ],
};
