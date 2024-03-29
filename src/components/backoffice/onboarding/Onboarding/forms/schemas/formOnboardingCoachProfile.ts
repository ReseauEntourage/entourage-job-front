import { FormSchema } from 'src/components/forms/FormSchema';

export const formOnboardingCoachProfile: FormSchema<{ description: string }> = {
  id: 'form-onboarding-profile',
  fields: [
    {
      id: 'description',
      name: 'description',
      component: 'textarea',
      title: 'Présentez-vous en quelques mots*',
      showLabel: true,
      placeholder:
        "Retraité actif dans le domaine de la cybersécurité après avoir exercé différentes fonctions en finance, RH, audit et informatique chez Décathlon. Dotée d'une forte capacité d'adaptation et d'un désir d'en apprendre toujours plus, je cherche à donner d'élan à ceux qui ont besoin. ",
      rows: 14,
      isRequired: true,
      maxLines: { lines: 5, width: 655 },
    },
  ],
};
