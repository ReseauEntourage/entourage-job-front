import { FormSchema } from 'src/components/forms/FormSchema';

export const formOnboardingCandidateAI: FormSchema<{
  generateProfile: boolean;
}> = {
  id: 'form-onboarding-candidate-ai',
  fields: [
    {
      id: 'generateProfile',
      name: 'generateProfile',
      component: 'checkbox',
      title: "Générer mon profil avec l'IA",
      showLabel: false,
      //   isHidden: true,
    },
  ],
};
