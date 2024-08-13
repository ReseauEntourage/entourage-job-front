import { FormSchema } from 'src/components/forms/FormSchema';

export const formOnboardingCandidateProfile: FormSchema<{
  description: string;
  optinNewsletter: boolean;
}> = {
  id: 'form-onboarding-profile',
  fields: [
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Présentez-vous en quelques mots',
      showLabel: true,
      placeholder:
        "Exemple : “Passionné par le secteur du tourisme, je cherche à améliorer mes candidatures. Je suis motivé à apprendre et à grandir. Ouvert à un contrat CDI ou CDD dans la région Lyonnaise, j'espère apporter mes compétences à une équipe dynamique.”",
      rows: 14,
      maxLines: { lines: 5, width: 655 },
    },
    {
      id: 'optinNewsletter',
      name: 'optinNewsletter',
      component: 'checkbox-alert',
      title:
        'En cochant cette case, j’accepte de recevoir des informations et des actualités sur le programme entourage pro',
      showLabel: true,
    },
  ],
};
