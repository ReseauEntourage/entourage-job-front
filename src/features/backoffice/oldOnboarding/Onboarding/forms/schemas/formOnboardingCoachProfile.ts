import { FormSchema } from '@/src/features/forms/FormSchema';

export const formOnboardingCoachProfile: FormSchema<{
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
        "Exemple: Passionné.e par le secteur de la logistique, je souhaite transmettre mon expérience et faire profiter les personnes en recherche d'emploi de mon réseau.",
      rows: 14,
    },
  ],
};
